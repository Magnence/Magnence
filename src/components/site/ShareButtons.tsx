"use client";

import * as React from "react";
import { Twitter, Linkedin, Facebook, Link2, Share2, Check, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Working social share buttons for blog articles.
 * Uses each platform's official share URL.
 * Includes a copy-link button with success state.
 */
export function ShareButtons({ url, title, description = "", className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);

  // Ensure absolute URL for share endpoints
  const absoluteUrl = React.useMemo(() => {
    if (typeof window === "undefined") return url;
    try {
      return new URL(url, window.location.origin).toString();
    } catch {
      return url;
    }
  }, [url]);

  const encodedUrl = encodeURIComponent(absoluteUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const shareLinks = React.useMemo(
    () => ({
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=magnenceindia`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    }),
    [encodedTitle, encodedUrl]
  );

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = absoluteUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // give up silently
      }
      document.body.removeChild(textarea);
    }
  }, [absoluteUrl]);

  // Use native share sheet on supported devices (mobile especially)
  const handleNativeShare = React.useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.share) return false;
    try {
      await navigator.share({
        title,
        text: description,
        url: absoluteUrl,
      });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, [title, description, absoluteUrl]);

  const buttonClass =
    "w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-text-secondary hover:text-cyan-signal hover:border-indigo-core/60 hover:bg-surface transition-all duration-200";

  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      <span className="text-text-muted text-sm font-code">Share:</span>

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter / X"
        className={buttonClass}
      >
        <Twitter size={16} />
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={buttonClass}
      >
        <Linkedin size={16} />
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className={buttonClass}
      >
        <Facebook size={16} />
      </a>

      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className={buttonClass}
      >
        <MessageCircle size={16} />
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={buttonClass}
      >
        {copied ? <Check size={16} className="text-cyan-signal" /> : <Link2 size={16} />}
      </button>

      {/* Native share button — only shows on supported devices */}
      {typeof navigator !== "undefined" && navigator.share && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="More share options"
          className={buttonClass}
        >
          {shared ? <Check size={16} className="text-cyan-signal" /> : <Share2 size={16} />}
        </button>
      )}

      {copied && (
        <span className="text-xs text-cyan-signal font-code animate-pulse">Link copied to clipboard</span>
      )}
    </div>
  );
}
