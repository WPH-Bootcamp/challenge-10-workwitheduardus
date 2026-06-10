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
    <footer className="w-full h-[490px] bg-neutral-950 border-t border-neutral-300">
      <div className="flex justify-between items-start px-[120px] py-20 gap-[69px]">
        {/*  Col 1: Content Container  */}
        <div className="flex flex-col gap-10 w-[380px] h-[284px]">
          <div className="flex flex-col gap-[22px] w-[380px] h-[154px]">
            <Link
              href="/"
              className="flex items-center gap-[15px] w-[149px] h-[42px]"
            >
              <div className="relative w-[42px] h-[42px] flex-shrink-0">
                <Image
                  src="/asset/logo.svg"
                  alt="Foody"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="display-md-extrabold leading-[42px] text-white">
                Foody
              </span>
            </Link>

            <p className="text-md-regular leading-[1.875rem] tracking-[-0.02em] text-neutral-25 w-[380px] h-[90px]">
              Enjoy homemade flavors &amp; chef&apos;s signature dishes. Freshly
              prepared every day. Order online or visit us at the nearest
              restaurant.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-5 w-[196px] h-[90px]">
            <div className="flex items-center gap-2 w-[196px] h-[30px]">
              <p className="text-md-extrabold text-neutral-25 text-center w-[176px]">
                Follow us on Social Media
              </p>
            </div>

            <div className="flex items-center gap-3 w-[196px] h-10">
              {SOCIALS.map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-neutral-800 rounded-[--radius-full] text-white hover:border-neutral-500 transition-colors flex-shrink-0"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2: E-Commerce / Explore Menu*/}
        <div className="flex flex-col gap-5 w-[200px] h-[330px]">
          <h4 className="text-md-extrabold text-neutral-25 text-center">
            Explore
          </h4>

          <nav className="flex flex-col gap-5">
            {EXPLORE.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-md-regular tracking-[-0.02em] text-neutral-25 h-[30px] flex items-center hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3: Help Menu*/}
        <div className="flex flex-col gap-5 w-[200px] h-[280px]">
          <h4 className="text-md-extrabold text-neutral-25 text-center">
            Help
          </h4>

          <nav className="flex flex-col gap-5">
            {HELP.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-md-regular tracking-[-0.02em] text-neutral-25 h-[30px] flex items-center hover:text-white transition-colors"
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
