"use client";

import * as React from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "../Section";
import { Reveal } from "../Reveal";
import { TESTIMONIALS_5 as TESTIMONIALS } from "@/lib/site-data/site-data";

export function Testimonials() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [direction, setDirection] = React.useState<"next" | "prev">("next");

  const total = TESTIMONIALS.length;

  const goNext = React.useCallback(() => {
    setDirection("next");
    setActive((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = React.useCallback(() => {
    setDirection("prev");
    setActive((prev) => (prev - 1 + total) % total);
  }, [total]);

  React.useEffect(() => {
    if (paused) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [paused, goNext]);

  const current = TESTIMONIALS[active];

  return (
    <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle relative overflow-hidden">
      {/* Decorative background quote marks */}
      <div className="absolute top-10 left-10 text-[12rem] font-display font-bold text-indigo-core/5 leading-none pointer-events-none select-none" aria-hidden>
        "
      </div>
      <div className="absolute bottom-10 right-10 text-[12rem] font-display font-bold text-indigo-core/5 leading-none pointer-events-none select-none" aria-hidden>
        "
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <SectionHeading
            label={"// what clients say"}
            title={<>Trusted by Builders</>}
            subtitle="We don't just deliver projects — we build partnerships that compound over years."
          />
        </Reveal>

        <Reveal delay={150} className="mt-14">
          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Main testimonial card */}
            <div
              key={active}
              className="relative bg-white border border-border-subtle rounded-3xl p-8 md:p-12 overflow-hidden testimonial-card"
              style={{
                animation: direction === "next" ? "slide-in-right 0.5s ease" : "slide-in-left 0.5s ease",
              }}
            >
              <Quote size={80} className="absolute -top-3 -left-3 text-indigo-core opacity-10" strokeWidth={1} />

              <div className="relative z-10 flex flex-col gap-6">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={22}
                      className={
                        i < current.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-text-muted"
                      }
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-display text-xl md:text-2xl text-text-primary italic leading-relaxed min-h-[7rem]">
                  "{current.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-border-subtle">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-text-primary font-display font-bold text-lg flex-shrink-0"
                    style={{ background: current.avatarGradient }}
                  >
                    {current.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-text-primary">{current.name}</p>
                    <p className="text-text-secondary text-sm">
                      {current.role} · <span className="text-cyan-signal">{current.company}</span>
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-text-muted text-xs font-code">
                    {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Navigation arrows on the card */}
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-indigo-core transition-all shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-indigo-core transition-all shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Avatar dots (clickable) */}
            <div className="flex items-center justify-center gap-3 mt-8">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > active ? "next" : "prev");
                    setActive(i);
                  }}
                  className={`transition-all duration-300 ${
                    i === active
                      ? "w-12 h-12 ring-2 ring-indigo-core ring-offset-2 ring-offset-surface"
                      : "w-10 h-10 opacity-50 hover:opacity-100"
                  } rounded-full flex items-center justify-center text-text-primary font-display font-bold text-sm flex-shrink-0`}
                  style={{ background: t.avatarGradient }}
                  aria-label={`View testimonial from ${t.name}`}
                >
                  {t.name.charAt(0)}
                </button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-6 max-w-xs mx-auto h-1 bg-border-subtle rounded-full overflow-hidden">
              <div
                key={active}
                className="h-full bg-gradient-to-r from-indigo-core to-indigo-light rounded-full"
                style={{
                  animation: paused ? "none" : "progress-fill 5s linear",
                  width: "100%",
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes progress-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
