import type { Metadata } from "next";
import { ServiceHero } from "@/components/site/ServiceHero";
import { SectionHeading, SectionLabel } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { SiteCard } from "@/components/site/SiteCard";
import { Icon } from "@/components/site/Icon";
import { CTABanner } from "@/components/site/CTABanner";
import { Eye, Target } from "lucide-react";
import { CORE_VALUES, TEAM, WHY_CHOOSE_MAGNENCE } from "@/lib/site-data/site-data";

export const metadata: Metadata = {
  title: "About Magnence — AI-First Technology & Creative Company in India",
  description:
    "Magnence is an AI-first technology and creative company headquartered in Bangalore, India with a second office in Gurugram. Specialized, dedicated teams for every discipline — AI, Software Engineering, Web & Mobile, Automation, UX/UI Design, Branding, Digital Marketing, Video Production, and 3D Rendering — operating as one coordinated unit under a single roof. Senior-only, founder-led, with strict 1-to-1 confidentiality on every engagement.",
  alternates: { canonical: "/about" },
};

const MILESTONES = [
  { year: "2020", achievement: "Founded in Bangalore, India by Anurag Singh with a vision for AI-first technology." },
  { year: "2021", achievement: "Shipped first 10 projects. Rituraj Sharma joined as Head of Design & Creative." },
  { year: "2022", achievement: "Expanded into AI engineering. Added Yashraj Kumar (Principal Engineer) and Reeshav Raj (Automation Architect)." },
  { year: "2024", achievement: "Opened creative & 3D teams. Crossed 100+ projects shipped across 13 industries." },
  { year: "2025", achievement: "150+ projects shipped. 50+ clients across 8 countries." },
  { year: "2026", achievement: "Launched Magnence OS — our internal AI-first operating system." },
];

export default function AboutPage() {
  return (
    <>
      <ServiceHero
        eyebrow="// who we are"
        title={<>Technology, by Design.</>}
        subtitle="Specialized, dedicated teams for every discipline — Artificial Intelligence, Software Engineering, Web & Mobile, Automation, UX/UI Design, Branding, Digital Marketing, Video Production, and 3D Rendering — operating as one coordinated unit under a single roof. Headquartered in Bangalore, India with a second office in Gurugram. Senior-only, founder-led, with strict 1-to-1 confidentiality on every engagement."
        showOrb
      />

      {/* Our Story */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <Reveal>
              <SectionLabel>{"// our story"}</SectionLabel>
              <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl mt-4 mb-6 leading-tight">
                Built by engineers, designers, and creators who got tired of the studio model.
              </h2>
              <div className="flex flex-col gap-4 text-text-secondary text-lg leading-relaxed">
                <p>
                  Magnence was founded in 2020 in Bangalore, India, by Anurag Singh — a
                  technologist who believed the traditional studio model was broken. Too many
                  handoffs. Too many juniors learning on client time. Too many "AI features" that
                  were really just an API call to OpenAI wrapped in a button.
                </p>
                <p>
                  He set out to build a different kind of company: senior teams, AI-first by
                  default, and full-spectrum capabilities under one roof. Software, AI, design,
                  automation, branding, marketing, video, and 3D — coordinated by a single
                  accountable project team, not five competing studios.
                </p>
                <p>
                  Rituraj Sharma joined in 2021 as Head of Design & Creative, bringing design leadership. Yashraj
                  Kumar (Principal Engineer) and Reeshav Raj (Automation Architect) rounded out
                  the founding team in 2022. Six years later, we've shipped 150+ production
                  systems for 50+ clients across 13 industries and 8 countries — from edge AI
                  traffic systems for government to multi-agent travel planners for Series A
                  startups.
                </p>
                <p>
                  We're still founder-led, still senior-only, and still obsessed with the same
                  thing: building technology that genuinely elevates the businesses we work with.
                  Imagine. Create. Engineer. Elevate. That's not a tagline — it's how we work.
                </p>
              </div>
            </Reveal>

            {/* Timeline */}
            <Reveal delay={150}>
              <div className="relative pl-8">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-core via-cyan-signal to-transparent" />
                <div className="flex flex-col gap-8">
                  {MILESTONES.map((m) => (
                    <div key={m.year} className="relative">
                      <div className="absolute -left-[1.65rem] top-1 w-4 h-4 rounded-full bg-indigo-core border-4 border-void" />
                      <p className="font-code text-cyan-signal text-sm">{m.year}</p>
                      <p className="font-display text-text-primary text-xl mt-1 leading-snug">
                        {m.achievement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <Reveal>
              <SiteCard glowing className="h-full p-10">
                <div className="w-16 h-16 rounded-2xl icon-halo flex items-center justify-center mb-6">
                  <Eye size={28} />
                </div>
                <h3 className="font-display font-bold text-text-primary text-3xl mb-4">Our Vision</h3>
                <p className="text-text-secondary text-lg leading-relaxed">
                  To be the partner that ambitious businesses turn to when they need technology
                  that genuinely elevates them — not just shipped, but engineered to scale. We
                  envision a world where every business, from startup to enterprise, has access
                  to senior AI-first engineering and creative talent working as dedicated teams for every domain toward
                  their outcomes.
                </p>
              </SiteCard>
            </Reveal>
            <Reveal delay={120}>
              <SiteCard glowing className="h-full p-10">
                <div className="w-16 h-16 rounded-2xl icon-halo flex items-center justify-center mb-6">
                  <Target size={28} />
                </div>
                <h3 className="font-display font-bold text-text-primary text-3xl mb-4">Our Mission</h3>
                <p className="text-text-secondary text-lg leading-relaxed">
                  To build intelligent software, automation systems, and creative work that
                  compounds for our clients — delivered by senior teams, on time, with full
                  transparency. We exist to make AI-first technology accessible, reliable, and
                  genuinely transformative for the businesses we partner with.
                </p>
              </SiteCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// what we stand for"
              title={<>Our Core Values</>}
              subtitle="Ten principles that shape every decision we make — from hiring to architecture to client conversations."
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14">
            {CORE_VALUES.map((v, i) => (
              <Reveal key={v.name} delay={i * 50}>
                <SiteCard glowing className="h-full">
                  <div className="w-12 h-12 rounded-xl icon-halo flex items-center justify-center mb-4">
                    <Icon name={v.icon} size={22} />
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-lg mb-2">
                    {v.name}
                  </h3>
                  <p className="text-text-secondary text-base leading-relaxed">
                    {v.description}
                  </p>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 lg:py-28 bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// leadership"
              title={<>The Team Behind Magnence</>}
              subtitle="Founder-led, senior-only. Different dedicated teams for different works and domains — coordinated by one accountable project team. The people you talk to are the people building your project."
            />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-14">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 100}>
                <SiteCard glowing className="text-center">
                  <div
                    className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-text-primary font-display font-bold text-3xl mb-4"
                    style={{ background: member.avatarGradient }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-lg">
                    {member.name}
                  </h3>
                  <p className="text-cyan-signal text-sm mb-3">{member.role}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{member.bio}</p>
                </SiteCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Magnence */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              label="// why magnence"
              title={<>Why Teams Choose Magnence</>}
              subtitle="Seven things that make us different — not by marketing claim, but by how we actually operate."
            />
          </Reveal>
          <div className="flex flex-col gap-6 mt-14">
            {WHY_CHOOSE_MAGNENCE.map((item, i) => (
              <Reveal key={item.title} delay={i * 50}>
                <div className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-2xl border border-border-subtle bg-surface/50 hover:bg-surface hover:border-indigo-core/40 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl icon-halo flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-text-primary text-xl mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="font-code text-text-muted text-3xl font-bold flex-shrink-0">
                    0{i + 1}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        heading="Want to work with us?"
        subheading="We'd love to hear about your project. Book a free 30-minute discovery call and find out if Magnence is the right partner for you."
        primaryLabel="Start Your Project"
        primaryHref="/contact"
        secondaryLabel="See Our Work"
        secondaryHref="/work"
      />
    </>
  );
}
