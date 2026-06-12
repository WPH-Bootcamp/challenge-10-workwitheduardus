import Link from "next/link";
import Image from "next/image";

const EXPLORE = [
  { label: "All Food", href: "/" },
  { label: "Nearby", href: "/?category=nearby" },
  { label: "Discount", href: "/?category=discount" },
  { label: "Best Seller", href: "/?category=bestseller" },
  { label: "Delivery", href: "/?category=delivery" },
  { label: "Lunch", href: "/?category=lunch" },
];

const HELP = [
  { label: "How to Order", href: "/help/how-to-order" },
  { label: "Payment Methods", href: "/help/payment" },
  { label: "Track My Order", href: "/orders" },
  { label: "Contact Us", href: "/help/contact" },
  { label: "FAQ", href: "/help/faq" },
];

function IconInstagram() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

const SOCIALS = [
  { Icon: IconInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: IconFacebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: IconLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: IconX, href: "https://x.com", label: "X" },
];
 
export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0D12] border-t border-[#D5D7DA]">
      <div className="flex flex-col lg:flex-row justify-between items-start px-6 lg:px-[120px] py-12 lg:py-20 gap-10 lg:gap-[69px]">
        <div className="flex flex-col gap-10 w-full lg:w-[380px]">
          <div className="flex flex-col gap-[22px]">
            <Link
              href="/"
              className="flex items-center gap-[15px] w-[149px] h-[42px]"
            >
              <div className="relative w-[42px] h-[42px] flex-shrink-0">
                <Image
                  src="/Logo-white.svg"
                  alt="Foody"
                  fill
                  sizes="42px"
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-[32px] leading-[42px] text-white">
                Foody
              </span>
            </Link>

            <p className="font-normal text-[16px] leading-[30px] tracking-[-0.02em] text-[#FDFDFD] w-[380px]">
              Enjoy homemade flavors &amp; chef&apos;s signature dishes. Freshly
              prepared every day. Order online or visit us at the nearest
              branch.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-5 w-[196px]">
            <p className="font-extrabold text-[16px] leading-[30px] text-[#FDFDFD]">
              Follow on Social Media
            </p>

            <div className="flex items-center gap-3 w-[196px] h-10">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center border border-[#252B37] rounded-full text-white hover:border-neutral-500 transition-colors flex-shrink-0"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 w-full lg:w-[200px]">
          <p className="font-extrabold text-[16px] leading-[30px] text-center text-[#FDFDFD]">
            Explore
          </p>
          <nav className="flex flex-col gap-5">
            {EXPLORE.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-normal text-[16px] leading-[30px] tracking-[-0.02em] text-center text-[#FDFDFD] h-[30px] flex items-center justify-center hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-5 w-full lg:w-[200px]">
          <p className="font-extrabold text-[16px] leading-[30px] text-center text-[#FDFDFD]">
            Help
          </p>
          <nav className="flex flex-col gap-5">
            {HELP.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-normal text-[16px] leading-[30px] tracking-[-0.02em] text-center text-[#FDFDFD] h-[30px] flex items-center justify-center hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
