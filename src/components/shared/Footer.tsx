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
      <div className="flex flex-col lg:flex-row justify-between items-start px-6 lg:px-[120px] py-10 lg:py-20 gap-10 lg:gap-[69px]">
 
        {/* ── Col 1: Brand + Description + Social ── */}
        <div className="flex flex-col gap-8 lg:gap-10 w-full lg:w-[380px]">
 
          {/* Logo + Description */}
          <div className="flex flex-col gap-[22px]">
            <Link href="/" className="flex items-center gap-[15px]">
              <div className="relative w-[42px] h-[42px] flex-shrink-0">
                <Image src="/Logo-red.svg" alt="Foody" fill sizes="42px" className="object-contain" />
              </div>
              <span style={{ fontSize: '32px', fontWeight: 800, lineHeight: '42px' }} className="text-white">
                Foody
              </span>
            </Link>
 
            <p style={{ fontSize: '16px', fontWeight: 400, lineHeight: '30px', letterSpacing: '-0.02em' }}
               className="text-[#FDFDFD] w-full lg:w-[380px]">
              Enjoy homemade flavors &amp; chef&apos;s signature dishes.
              Freshly prepared every day. Order online or visit us
              at the nearest branch.
            </p>
          </div>
 
          {/* Social Media */}
          <div className="flex flex-col gap-5 w-[196px]">
            <p style={{ fontSize: '16px', fontWeight: 800, lineHeight: '30px' }} className="text-[#FDFDFD]">
              Follow on Social Media
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                   className="w-10 h-10 flex items-center justify-center border border-[#252B37] rounded-full text-white hover:border-neutral-500 transition-colors flex-shrink-0">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
 
        <div className="grid grid-cols-2 lg:flex lg:flex-row lg:gap-[69px] gap-8 w-full lg:w-auto">
 
          {/* ── Col 2: Explore ── */}
          <div className="flex flex-col gap-5 lg:w-[200px]">
            <p style={{ fontSize: '16px', fontWeight: 800, lineHeight: '30px' }}
               className="text-left text-[#FDFDFD]">
              Explore
            </p>
            <nav className="flex flex-col gap-4 lg:gap-5">
              {EXPLORE.map((l) => (
                <Link key={l.href + l.label} href={l.href}
                      style={{ fontSize: '16px', fontWeight: 400, lineHeight: '30px', letterSpacing: '-0.02em' }}
                      className="text-left text-[#FDFDFD] hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
 
          {/* ── Col 3: Help ── */}
          <div className="flex flex-col gap-5 lg:w-[200px]">
            <p style={{ fontSize: '16px', fontWeight: 800, lineHeight: '30px' }}
               className="text-left text-[#FDFDFD]">
              Help
            </p>
            <nav className="flex flex-col gap-4 lg:gap-5">
              {HELP.map((l) => (
                <Link key={l.href + l.label} href={l.href}
                      style={{ fontSize: '16px', fontWeight: 400, lineHeight: '30px', letterSpacing: '-0.02em' }}
                      className="text-left text-[#FDFDFD] hover:text-white transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
 
      </div>
    </footer>
  );
}
