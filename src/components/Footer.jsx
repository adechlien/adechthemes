import FooterSvg from "./FooterSvg";

// src/components/layout/Footer.jsx
const NAV = [
  { label: "Branches", href: "#branches" },
  { label: "Workspaces", href: "#workspaces" },
  { label: "Docs", href: "#docs" },
  { label: "Tools", href: "#tools" },
];

const RESOURCES = [
  { label: "GitHub", href: "https://github.com/adechlien/adech" },
  { label: "NPM", href: "https://www.npmjs.com/package/@adech/themes" },
  { label: "Releases", href: "https://github.com/adechlien/adech/releases" },
  { label: "Issues", href: "https://github.com/adechlien/adech/issues" },
];

function FooterLink({ href, label }) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="text-sm text-adech-boulevard-3 transition hover:text-adech-venomous-3"
    >
      {label}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-adech-swamp-3 text-adech-boulevard-1">
      <img src="/footer.svg" alt="Adech Theme" className="w-full bg-adech-swamp-1" />
      {/* <FooterSvg /> */}

      <div className="mx-auto max-w-6xl p-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:justify-between">
          {/* Brand */}
          <div className="flex w-full max-w-md flex-col items-start gap-4 sm:flex-row sm:items-start">
            <img
              src="/adech-logo.svg"
              alt="Adech Theme"
              className="size-16 shrink-0 sm:size-20"
            />

            <div className="min-w-0 text-left">
              <p className="text-base font-semibold sm:text-lg">Adech Theme</p>
              <p className="mt-1 text-sm leading-relaxed text-adech-boulevard-3">
                A portable theme ecosystem built around reusable branches and design
                tokens for interfaces and workspaces.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:w-auto lg:gap-16">
            {/* Nav */}
            <div className="text-left">
              <p className="text-base font-semibold tracking-wide">Navigation</p>
              <div className="mt-3 flex flex-col items-start gap-2">
                {NAV.map((l) => (
                  <FooterLink key={l.href} {...l} />
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="text-left">
              <p className="text-base font-semibold tracking-wide">Resources</p>
              <div className="mt-3 flex flex-col items-start gap-2">
                {RESOURCES.map((l) => (
                  <FooterLink key={l.label} {...l} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-adech-swamp-1 pt-4 px-4">
          <p className="text-center sm:text-left text-xs text-adech-boulevard-3">
            © {year} Adech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
