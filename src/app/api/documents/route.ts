import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const { searchParams } = new URL(req.url);
  const parentId = searchParams.get("parentId"); // null = root
  const where: Record<string, unknown> = {};
  if (parentId === "null" || parentId === null) {
    where.parentId = null;
  } else if (parentId) {
    where.parentId = parentId;
  }
  // Show own + shared
  if (user) {
    where.OR = [{ ownerId: user.id }, { isShared: true }];
  }
  if (!user) return NextResponse.json({ documents: [] });
  const documents = await db.document.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, avatarColor: true } },
      _count: { select: { versions: true, children: true } },
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, type, mimeType, size, url, parentId, isShared, tags } = body;
  if (!name || !type) {
    return NextResponse.json({ error: "Name and type required" }, { status: 400 });
  }
  const doc = await db.document.create({
    data: {
      name,
      type,
      mimeType,
      size: size || 0,
      url,
      parentId: parentId || null,
      ownerId: user.id,
      isShared: !!isShared,
      tags,
    },
  });
  if (type === "file") {
    await db.documentVersion.create({
      data: {
        documentId: doc.id,
        version: 1,
        url,
        size: size || 0,
        uploadedById: user.id,
        note: "Initial upload",
      },
    });
  }
  await db.activityLog.create({
    data: { userId: user.id, action: `upload_${type}`, target: name, category: "file" },
  });
  return NextResponse.json({ document: doc });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, action, name, parentId, isShared, permissions, version, url, size, note } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (action === "new_version") {
    const doc = await db.document.findUnique({ where: { id }, include: { versions: true } });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const nextVersion = doc.versions.length + 1;
    await db.documentVersion.create({
      data: { documentId: id, version: nextVersion, url, size: size || 0, uploadedById: user.id, note },
    });
    await db.document.update({ where: { id }, data: { url, size: size || 0, updatedAt: new Date() } });
    return NextResponse.json({ ok: true, version: nextVersion });
  }
  if (action === "delete") {
    await db.document.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }
  const update: Record<string, unknown> = {};
  if (name !== undefined) update.name = name;
  if (parentId !== undefined) update.parentId = parentId;
  if (isShared !== undefined) update.isShared = isShared;
  if (permissions !== undefined) update.permissions = JSON.stringify(permissions);
  const doc = await db.document.update({ where: { id }, data: update });
  return NextResponse.json({ document: doc });
}
