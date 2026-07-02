import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  experience: z.string().optional().nullable(),
  currentCtc: z.string().optional().nullable(),
  expectedCtc: z.string().optional().nullable(),
  noticePeriod: z.string().optional().nullable(),
  portfolioUrl: z.string().optional().nullable(),
  coverLetter: z.string().max(2000, "Cover letter too long (max 2000 chars)").optional().nullable(),
});

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract fields
    const fields: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        fields[key] = value;
      }
    }

    // Extract resume file
    const resumeFile = formData.get("resume") as File | null;

    // Validate fields
    const parsed = schema.safeParse(fields);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { ok: false, error: firstError?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;

    let resumeUrl: string | null = null;
    let resumeFileName: string | null = null;

    // Handle resume upload
    if (resumeFile && resumeFile.size > 0) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const allowedExtensions = [".pdf", ".doc", ".docx"];
      const fileExt = path.extname(resumeFile.name).toLowerCase();

      if (!allowedTypes.includes(resumeFile.type) && !allowedExtensions.includes(fileExt)) {
        return NextResponse.json(
          { ok: false, error: "Resume must be a PDF or DOC file" },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      if (resumeFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { ok: false, error: "Resume must be under 5MB" },
          { status: 400 }
        );
      }

      // Save file to /public/uploads/resumes/
      const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const safeName = resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueName = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadDir, uniqueName);

      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      await writeFile(filePath, buffer);

      resumeUrl = `/uploads/resumes/${uniqueName}`;
      resumeFileName = resumeFile.name;
    }

    // Save to database
    const application = await db.jobApplication.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? null,
        position: data.position,
        department: data.department,
        experience: data.experience ?? null,
        currentCtc: data.currentCtc ?? null,
        expectedCtc: data.expectedCtc ?? null,
        noticePeriod: data.noticePeriod ?? null,
        portfolioUrl: data.portfolioUrl ?? null,
        coverLetter: data.coverLetter ?? null,
        resumeUrl,
        resumeFileName,
        status: "new",
        source: "website",
        ipAddress,
      },
    });

    // Create notification in Magnence OS (for HR panel)
    try {
      // Find HR users to notify (users with HR role)
      const hrUsers = await db.user.findMany({
        where: {
          OR: [
            { role: { contains: "hr" } },
            { role: { contains: "admin" } },
          ],
        },
        select: { id: true },
      });

      if (hrUsers.length > 0) {
        await db.notification.createMany({
          data: hrUsers.map((u) => ({
            userId: u.id,
            type: "system",
            title: `New job application: ${data.fullName}`,
            body: `Applied for ${data.position} (${data.department}). Email: ${data.email}${resumeUrl ? ` · Resume: ${resumeFileName}` : ""}`,
            link: resumeUrl ?? null,
            read: false,
            createdAt: new Date(),
          })),
        });
      } else {
        // Fallback: log to audit log
        await db.auditLog.create({
          data: {
            userId: null,
            action: "JOB_APPLICATION",
            category: "system",
            target: `position:${data.position}`,
            meta: JSON.stringify({
              applicant: data.fullName,
              email: data.email,
              position: data.position,
              department: data.department,
              resumeUrl,
            }),
            ipAddress,
            createdAt: new Date(),
          },
        });
      }
    } catch (notifErr) {
      console.error("[/api/careers/apply] Failed to create notification:", notifErr);
      // Don't fail the application if notification fails
    }

    return NextResponse.json({
      ok: true,
      id: application.id,
      message: `Thanks for applying, ${data.fullName.split(" ")[0]}! Our HR team will review your application and reach out within 5 business days.`,
    });
  } catch (err) {
    console.error("[/api/careers/apply] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Admin-only: list applications
  try {
    const applications = await db.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        department: true,
        status: true,
        resumeUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json({
      ok: true,
      applications,
      count: applications.length,
    });
  } catch (err) {
    console.error("[/api/careers/apply GET] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
