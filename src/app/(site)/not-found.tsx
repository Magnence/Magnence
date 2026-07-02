import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center hero-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-8">
        <div className="relative">
          <p className="font-display font-extrabold text-[10rem] md:text-[14rem] leading-none text-gradient-brand">
            404
          </p>
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <div
              className="w-64 h-64 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(251,198,7,0.2) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-display font-bold text-text-primary text-3xl md:text-4xl">
            This page took a wrong turn.
          </h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link href="/" className="btn-primary">
            <Home size={16} /> Back to Home
          </Link>
          <Link href="/contact" className="btn-secondary">
            <Search size={16} /> Contact Us
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-border-subtle w-full">
          <p className="text-text-muted text-sm uppercase tracking-wider font-code mb-4">
            Popular Pages
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { href: "/services", label: "Services" },
              { href: "/work", label: "Our Work" },
              { href: "/about", label: "About" },
              { href: "/blog", label: "Blog" },
              { href: "/industries", label: "Industries" },
              { href: "/process", label: "Process" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full bg-white border border-border-subtle text-text-secondary text-sm hover:border-indigo-core hover:text-text-primary transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
