"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Clock, ArrowRight, CheckCircle2, Loader2, Calendar, Phone } from "lucide-react";
import { ServiceHero } from "@/components/site/ServiceHero";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  callTiming: z.string().min(1, "Please select a preferred call time"),
  message: z.string().min(20, "Please tell us a bit more (min 20 characters)").max(1000, "Max 1000 characters"),
});

type FormValues = z.infer<typeof schema>;

const SERVICES = [
  "Artificial Intelligence",
  "Software Development",
  "Web & Mobile",
  "Automation",
  "UI/UX Design",
  "Branding",
  "Marketing",
  "Video Editing",
  "3D & Rendering",
  "Other",
];

const BUDGETS = [
  "Under ₹1L",
  "₹1L – 5L",
  "₹5L – 20L",
  "₹20L+",
  "Prefer not to say",
];

const TIMELINES = [
  "ASAP",
  "1 – 3 months",
  "3 – 6 months",
  "6+ months",
];

const CALL_TIMINGS = [
  "Morning (9 AM – 12 PM IST)",
  "Afternoon (12 PM – 4 PM IST)",
  "Evening (4 PM – 7 PM IST)",
  "Night (7 PM – 10 PM IST)",
  "Anytime (24×7 available)",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      phone: "",
      service: "",
      budget: "",
      timeline: "",
      callTiming: "",
      message: "",
    },
  });

  const messageValue = useWatch({ control, name: "message" }) ?? "";

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Submission failed");
      }
      setSubmitted(true);
      reset();
    } catch (err: any) {
      setSubmitError(err.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <ServiceHero
        eyebrow="// contact"
        title={<>Let's Build Something Together</>}
        subtitle="Tell us about your project. We'll get back to you within 24 hours — with next steps, timeline, and a discovery call invite if it's a fit."
      />

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left column — info */}
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-display font-bold text-text-primary text-3xl mb-4">
                  Get in touch
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed">
                  Whether you have a fully-scoped project or just an idea you want to
                  pressure-test, we'd love to hear from you. Use the form to share details, or
                  reach out directly via email.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ContactCard icon={<Mail size={20} />} label="Email" value="support@magnence.com" href="mailto:support@magnence.com" />
                <ContactCard icon={<Phone size={20} />} label="Phone (24×7)" value="+91 9470961258" href="tel:+919470961258" />
                <ContactCard icon={<MapPin size={20} />} label="Headquarters" value="Bangalore, Karnataka, India" />
                <ContactCard icon={<MapPin size={20} />} label="Second Office" value="Gurugram, Haryana, India" />
                <ContactCard icon={<Clock size={20} />} label="Hours" value="24×7 Available" spanFull />
              </div>

              <div className="rounded-2xl bg-white border border-border-subtle p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-core/20 flex items-center justify-center text-cyan-signal">
                    <Calendar size={20} />
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-lg">
                    Prefer to talk directly?
                  </h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Call us anytime — we're available 24×7. Or fill out the form with your preferred
                  call timing and we'll reach out at a time that works for you.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="tel:+919470961258" className="btn-primary justify-center">
                    <Phone size={16} /> Call Now
                  </a>
                  <a href="#contact-form" className="btn-secondary justify-center">
                    <Calendar size={16} /> Fill the Form Below
                  </a>
                </div>
              </div>
            </div>

            {/* Right column — form */}
            <div id="contact-form" className="rounded-2xl bg-white border border-border-subtle p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] scroll-mt-24">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-16">
                  <CheckCircle2 size={64} className="text-cyan-signal" />
                  <h3 className="font-display font-bold text-text-primary text-2xl">
                    Thanks! We'll be in touch.
                  </h3>
                  <p className="text-text-secondary text-base max-w-md">
                    Your message has been received. We'll get back to you within 24 hours with
                    next steps.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary mt-4"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" required error={errors.fullName?.message}>
                      <input
                        {...register("fullName")}
                        className="input-base"
                        placeholder="Anurag Singh"
                      />
                    </Field>
                    <Field label="Work Email" required error={errors.email?.message}>
                      <input
                        {...register("email")}
                        type="email"
                        className="input-base"
                        placeholder="anurag@magnence.com"
                      />
                    </Field>
                    <Field label="Company Name" error={errors.company?.message}>
                      <input
                        {...register("company")}
                        className="input-base"
                        placeholder="Magnence"
                      />
                    </Field>
                    <Field label="Phone Number" error={errors.phone?.message}>
                      <input
                        {...register("phone")}
                        className="input-base"
                        placeholder="+91 9470961258"
                      />
                    </Field>
                  </div>

                  <Field label="Service Interested In" required error={errors.service?.message}>
                    <select {...register("service")} className="input-base">
                      <option value="">Select a service…</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Project Budget" required error={errors.budget?.message}>
                      <select {...register("budget")} className="input-base">
                        <option value="">Select budget…</option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Project Timeline" required error={errors.timeline?.message}>
                      <select {...register("timeline")} className="input-base">
                        <option value="">Select timeline…</option>
                        {TIMELINES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Preferred Call Timing" required error={errors.callTiming?.message}>
                    <select {...register("callTiming")} className="input-base">
                      <option value="">When should we call you?</option>
                      {CALL_TIMINGS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>

                  <Field
                    label="Tell us about your project"
                    required
                    error={errors.message?.message}
                    hint={`${messageValue.length}/1000`}
                  >
                    <textarea
                      {...register("message")}
                      className="input-base min-h-[120px] resize-y"
                      placeholder="What are you building? What problem are you solving? What's your timeline and budget?"
                      maxLength={1000}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Send Message <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {submitError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 text-center">
                      {submitError}
                    </div>
                  )}

                  <p className="text-text-muted text-xs text-center">
                    We typically reply within 24 hours, Monday to Saturday.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

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
        :global(select.input-base) {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239b9b9b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        :global(select.input-base option) {
          background: #ffffff;
          color: #1a1a1a;
        }
      `}</style>
    </>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  spanFull,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  spanFull?: boolean;
}) {
  const Inner = (
    <div className={`rounded-2xl bg-surface border border-border-subtle p-5 hover:border-indigo-core/40 transition-colors flex flex-col gap-2 h-full ${spanFull ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-wider font-code">
        {icon} {label}
      </div>
      <p className="text-text-primary text-base">{value}</p>
    </div>
  );
  if (href) {
    return <a href={href} className="block">{Inner}</a>;
  }
  return Inner;
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-text-primary text-sm font-medium">
          {label} {required && <span className="text-ember">*</span>}
        </label>
        {hint && <span className="text-text-muted text-xs font-code">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-ember text-xs">{error}</p>}
    </div>
  );
}
