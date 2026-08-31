import type { SVGProps } from "react";

type Brand = "instagram" | "facebook" | "whatsapp";

function BrandIcon({ brand, ...props }: SVGProps<SVGSVGElement> & { brand: Brand }) {
  if (brand === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.1" />
        <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (brand === "facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M13.7 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5H17V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.5V13h2.8v8h3.4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.75A9.2 9.2 0 0 0 4.07 16.6l-.8 4.65 4.75-1.2A9.2 9.2 0 1 0 12 2.75Zm5.33 13.05c-.22.63-1.28 1.18-1.82 1.25-.47.07-1.07.1-1.73-.1-.4-.13-.92-.3-1.58-.6-2.77-1.2-4.57-3.98-4.7-4.17-.14-.18-1.13-1.5-1.13-2.86s.72-2.03.98-2.31c.26-.28.56-.35.75-.35h.55c.17 0 .41-.06.64.49.22.54.77 1.88.84 2.02.07.14.11.31.02.5-.08.18-.13.3-.27.46-.14.17-.3.38-.42.51-.14.14-.28.3-.12.58.15.28.68 1.12 1.46 1.82 1 .9 1.85 1.18 2.13 1.32.28.14.45.12.62-.07.17-.18.71-.83.9-1.11.2-.28.38-.24.64-.14.27.1 1.68.8 1.96.94.3.14.49.21.56.33.07.11.07.66-.15 1.29Z" />
    </svg>
  );
}

export function SocialIconButton({
  brand,
  href,
  label,
  testId,
}: Readonly<{ brand: Brand; href: string; label: string; testId: string }>) {
  const brandClass = {
    instagram: "border-white/20 bg-[linear-gradient(135deg,#833ab4_0%,#e1306c_48%,#fd1d1d_72%,#fcb045_100%)] text-white shadow-[0_10px_28px_rgba(225,48,108,.24)] hover:brightness-110",
    facebook: "border-[#1877f2] bg-[#1877f2] text-white shadow-[0_10px_28px_rgba(24,119,242,.24)] hover:bg-[#2d83f3]",
    whatsapp: "border-[#25d366] bg-[#25d366] text-white shadow-[0_10px_28px_rgba(37,211,102,.22)] hover:bg-[#35dc74]",
  }[brand];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-testid={testId}
      className={`grid size-11 shrink-0 place-items-center rounded-full border transition duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 ${brandClass}`}
    >
      <BrandIcon brand={brand} className="size-5" />
    </a>
  );
}
