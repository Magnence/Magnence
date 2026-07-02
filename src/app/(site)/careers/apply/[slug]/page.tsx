"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { SectionLabel } from "@/components/site/Section";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Decode position and department from slug (format: "position--department")
  const [position, department] = React.useMemo(() => {
    try {
      const decoded = decodeURIComponent(slug);
      const parts = decoded.split("--");
      return [parts[0] || "Open Position", parts[1] || "General"];
    } catch {
      return ["Open Position", "General"];
    }
  }, [slug]);

  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = React.useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.set("position", position);
      formData.set("department", department);

      if (resumeFile) {
        formData.set("resume", resumeFile);
      }

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  if (submitted) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
          <CheckCircle2 size={72} className="text-cyan-signal" />
          <h1 className="font-display font-bold text-text-primary text-3xl">
            Application Received!
          </h1>
          <p className="text-text-secondary text-base leading-relaxed">
            Thank you for applying for the <strong className="text-text-primary">{position}</strong> role.
            Our HR team will review your application and reach out within 5 business days if there's a fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
            <Link href="/careers" className="btn-secondary justify-center flex-1">
              <ArrowLeft size={16} /> Back to Careers
            </Link>
            <Link href="/" className="btn-primary justify-center flex-1">
              Go Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to all positions
        </Link>

        {/* Header */}
        <div className="mb-8">
          <SectionLabel>{"// apply for"}</SectionLabel>
          <h1 className="font-display font-bold text-text-primary text-2xl sm:text-3xl mt-3">
            {position}
          </h1>
          <p className="text-text-secondary text-sm mt-1">{department} · Magnence</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-sm flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="Full Name" name="fullName" required placeholder="Anurag Singh" />
            <FormInput label="Email" name="email" type="email" required placeholder="anurag@magnence.com" />
            <FormInput label="Phone" name="phone" placeholder="+91 9470961258" />
            <FormInput label="Years of Experience" name="experience" placeholder="5 years" />
            <FormInput label="Current CTC" name="currentCtc" placeholder="₹12 LPA" />
            <FormInput label="Expected CTC" name="expectedCtc" placeholder="₹18 LPA" />
            <FormInput label="Notice Period" name="noticePeriod" placeholder="30 days" />
            <FormInput label="Portfolio / LinkedIn URL" name="portfolioUrl" placeholder="https://..." />
          </div>

          {/* Resume upload */}
          <div className="flex flex-col gap-2">
            <label className="text-text-primary text-sm font-medium">
              Resume (PDF/DOC, max 5MB) <span className="text-ember">*</span>
            </label>
            <label className="cursor-pointer rounded-xl border-2 border-dashed border-border-subtle hover:border-indigo-core transition-colors p-6 flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full icon-halo flex items-center justify-center">
                {resumeFileName ? <FileText size={20} /> : <Upload size={20} />}
              </div>
              {resumeFileName ? (
                <>
                  <p className="text-text-primary text-sm font-semibold">{resumeFileName}</p>
                  <p className="text-text-muted text-xs">Click to change file</p>
                </>
              ) : (
                <>
                  <p className="text-text-primary text-sm font-semibold">Click to upload resume</p>
                  <p className="text-text-muted text-xs">PDF or DOC, max 5MB</p>
                </>
              )}
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                required
                className="sr-only"
              />
            </label>
          </div>

          {/* Cover letter */}
          <div className="flex flex-col gap-2">
            <label className="text-text-primary text-sm font-medium">
              Cover Letter — Why Magnence?
            </label>
            <textarea
              name="coverLetter"
              maxLength={2000}
              placeholder="Tell us why you want to join Magnence and what you'd bring to the team..."
              className="input-base min-h-[120px] resize-y"
            />
            <p className="text-text-muted text-xs">Max 2000 characters</p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Submitting…
              </>
            ) : (
              <>Submit Application</>
            )}
          </button>

          <p className="text-text-muted text-xs text-center">
            By submitting, you agree to our{" "}
            <a href="/privacy" className="text-cyan-signal hover:underline">Privacy Policy</a>.
            Your data is stored securely and used only for recruitment.
          </p>
        </form>
      </div>

      <style jsx>{`
        :global(.input-base) {
          width: 100%;
          background: #ffffff;
          border: 1.5px solid rgba(0,0,0,0.1);
          border-radius: 1rem;
          padding: 0.85rem 1.1rem;
          color: #1a1a1a;
          font-size: 0.95rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: inherit;
          outline: none;
        }
        :global(.input-base:hover) {
          border-color: rgba(0,0,0,0.2);
        }
        :global(.input-base:focus) {
          border-color: #fbc607;
          box-shadow: 0 0 0 4px rgba(251,198,7,0.15);
        }
        :global(.input-base::placeholder) {
          color: #9b9b9b;
        }
      `}</style>
    </section>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-text-primary text-sm font-medium">
        {label} {required && <span className="text-ember">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="input-base"
      />
    </div>
  );
}
