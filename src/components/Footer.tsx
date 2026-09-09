import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/assets";
import {
  footerBrandDescription,
  footerContactLinks,
  footerQuickLinks,
  footerSocialLinks,
} from "@/data/footer";
import HoverText from "./HoverText";

function EmailIcon() {
  return (
    <svg
      className="footer__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(3.001 3.002)">
        <path
          d="M 4.493 16.79 C 8.403 19.053 13.386 18.066 16.138 14.483 C 18.891 10.9 18.56 5.831 15.365 2.636 C 12.17 -0.559 7.101 -0.89 3.518 1.863 C -0.065 4.615 -1.052 9.598 1.211 13.508 L 1.211 13.508 L 0.039 17.01 C -0.051 17.279 0.019 17.577 0.22 17.777 C 0.421 17.978 0.718 18.049 0.987 17.959 Z"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 0 1.125 C 0 0.504 0.504 0 1.125 0 C 1.746 0 2.25 0.504 2.25 1.125 C 2.25 1.746 1.746 2.25 1.125 2.25 C 0.504 2.25 0 1.746 0 1.125 Z"
          fill="currentColor"
          transform="translate(10.875 10.875)"
        />
        <path
          d="M 0 1.125 C 0 0.504 0.504 0 1.125 0 C 1.746 0 2.25 0.504 2.25 1.125 C 2.25 1.746 1.746 2.25 1.125 2.25 C 0.504 2.25 0 1.746 0 1.125 Z"
          fill="currentColor"
          transform="translate(6.75 10.875)"
        />
        <path
          d="M 0 1.125 C 0 0.504 0.504 0 1.125 0 C 1.746 0 2.25 0.504 2.25 1.125 C 2.25 1.746 1.746 2.25 1.125 2.25 C 0.504 2.25 0 1.746 0 1.125 Z"
          fill="currentColor"
          transform="translate(15 10.875)"
        />
      </g>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className="footer__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 0 0 C 2.568 0.676 4.574 2.682 5.25 5.25"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(14.25 4.5)"
      />
      <path
        d="M 0 0 C 1.549 0.414 2.586 1.451 3 3"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(13.5 7.5)"
      />
      <path
        d="M 11.662 10.625 C 11.873 10.485 12.14 10.461 12.373 10.561 L 16.794 12.542 C 17.1 12.672 17.284 12.989 17.244 13.32 C 16.943 15.571 15.021 17.251 12.75 17.25 C 5.708 17.25 0 11.541 0 4.5 C -0.002 2.228 1.679 0.307 3.93 0.005 C 4.26 -0.034 4.577 0.149 4.708 0.455 L 6.689 4.88 C 6.788 5.111 6.765 5.376 6.627 5.586 L 4.624 7.968 C 4.479 8.187 4.46 8.465 4.573 8.701 C 5.348 10.288 6.989 11.909 8.581 12.677 C 8.818 12.789 9.097 12.768 9.315 12.621 Z"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3 3.75)"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className="footer__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M 10.5 5.25 C 10.5 10.5 5.25 13.5 5.25 13.5 C 5.25 13.5 0 10.5 0 5.25 C 0 2.351 2.351 0 5.25 0 C 8.149 0 10.5 2.351 10.5 5.25 Z"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(6.75 2.25)"
      />
      <path
        d="M 0 1.5 C 0 0.672 0.672 0 1.5 0 C 2.328 0 3 0.672 3 1.5 C 3 2.328 2.328 3 1.5 3 C 0.672 3 0 2.328 0 1.5 Z"
        fill="currentColor"
        transform="translate(10.5 6)"
      />
      <path
        d="M 16.5 0 C 18.349 0.683 19.5 1.643 19.5 2.706 C 19.5 4.777 15.135 6.456 9.75 6.456 C 4.365 6.456 0 4.777 0 2.706 C 0 1.643 1.151 0.683 3 0"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(2.25 14.544)"
      />
    </svg>
  );
}

const contactIcons = {
  email: EmailIcon,
  phone: PhoneIcon,
  location: LocationIcon,
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__brand-logo">
              <Image
                src={assets.logo}
                alt="Wearix"
                width={90}
                height={22}
                className="footer__brand-logo-img"
              />
            </div>
            <p className="footer__brand-desc">{footerBrandDescription}</p>
            <Link href="/contact" className="footer__contact-btn">
              <HoverText>Contact Wearix</HoverText>
            </Link>
          </div>

          <div className="footer__links">
            <nav className="footer__col" aria-label="Quick Links">
              <h3 className="footer__col-heading">Quick Links</h3>
              <ul className="footer__list">
                {footerQuickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="footer__col" aria-label="Social links">
              <h3 className="footer__col-heading">Follow us:</h3>
              <ul className="footer__list">
                {footerSocialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer__col footer__col--contact">
              <h3 className="footer__col-heading">Get in touch</h3>
              <ul className="footer__contact-list">
                {footerContactLinks.map((link) => {
                  const Icon = contactIcons[link.icon];
                  const external = link.href.startsWith("http");
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="footer__contact-link"
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        <Icon />
                        <span>{link.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <Link href="/" className="footer__watermark" aria-label="Wearix home">
          <Image
            src={assets.logo}
            alt=""
            width={1190}
            height={289}
            className="footer__watermark-img"
            aria-hidden="true"
          />
        </Link>
      </div>
    </footer>
  );
}
