import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setCopied(true);

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      // si falla, no pasa niente
    }
  };

  return (
    <button
      onClick={onCopy}
      className="flex items-center cursor-pointer text-adech-boulevard-2 transition"
      type="button"
      aria-label="Copy code"
      title="Copy code"
    >
      <span key={copied ? "check" : "copy"} className="inline-flex animate-tabEnter">
        {copied ? <IconCheck stroke={2} size={20} /> : <IconCopy stroke={2} size={20} />}
      </span>
    </button>
  );
}

function CodeBlock({ title, code, tabKey }) {
  const measureRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    setHeight(measureRef.current.offsetHeight);
  }, [tabKey, title, code]);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-adech-swamp-3">
      <div className="flex items-center justify-between border-b border-adech-swamp-1 px-4 py-3">
        <p className="text-xs font-medium text-adech-boulevard-1">{title}</p>
        <CopyButton text={code} />
      </div>

      <div
        className="transition-[height] duration-300 ease-out"
        style={{ height: height ? `${height}px` : "auto" }}
      >
        <div key={tabKey} ref={measureRef} className="animate-tabEnter">
          <pre className="overflow-auto px-4 py-4 text-xs leading-relaxed text-adech-boulevard-3">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function DocsPreview() {
  const tabs = useMemo(
    () => [
      { id: "install", label: "Installation" },
      { id: "tailwind4", label: "TailwindCSS v4" },
      { id: "tailwind3", label: "TailwindCSS v3" },
      { id: "css", label: "CSS Variables" },
    ],
    []
  );

  const [tab, setTab] = useState("install");

  const tabRefs = useRef({});
  const [sliderStyle, setSliderStyle] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    opacity: 0,
  });

  const updateSlider = () => {
    const activeButton = tabRefs.current[tab];
    if (!activeButton) return;

    setSliderStyle({
      width: activeButton.offsetWidth,
      height: activeButton.offsetHeight,
      x: activeButton.offsetLeft,
      y: activeButton.offsetTop,
      opacity: 1,
    });
  };

  useLayoutEffect(() => {
    updateSlider();
  }, [tab]);

  useEffect(() => {
    updateSlider();

    const onResize = () => updateSlider();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [tab]);

  const content = useMemo(() => {
    if (tab === "install") {
      return {
        title: "Install from npm",
        code: `npm install @adech/themes`,
      };
    }

    if (tab === "tailwind4") {
      return {
        title: "index.css",
        code: `@import "tailwindcss";
@import "@adech/themes/superior/tailwind";`,
      };
    }

    if (tab === "tailwind3") {
      return {
        title: "tailwind.config.js",
        code: `module.exports = {
  presets: [require("@adech/themes/superior/preset")],
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"]
};`,
      };
    }

    return {
      title: "styles.css",
      code: `@import "@adech/themes/superior/css";

.card {
  background: var(--adech-swamp-3);
  color: var(--adech-boulevard-1);
}`,
    };
  }, [tab]);

  return (
    <section id="docs" className="flex w-full flex-col gap-2">
      <div>
        <p className="text-sm text-adech-boulevard-3">
          Install Adech Themes from npm and use{" "}
          <span className="font-semibold">Superior</span> through public subpaths for
          Tailwind CSS v4, v3, or CSS variables.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="hidden w-full sm:flex">
          <div className="relative flex w-full items-center gap-1 rounded-xl bg-adech-swamp-3 p-1">
            <span
              className="pointer-events-none absolute left-0 top-0 rounded-lg bg-adech-boulevard-4 transition-all duration-300 ease-out"
              style={{
                width: `${sliderStyle.width}px`,
                height: `${sliderStyle.height}px`,
                transform: `translate(${sliderStyle.x}px, ${sliderStyle.y}px)`,
                opacity: sliderStyle.opacity,
              }}
            />

            {tabs.map((t) => {
              const active = t.id === tab;

              return (
                <button
                  key={t.id}
                  ref={(node) => {
                    if (node) tabRefs.current[t.id] = node;
                  }}
                  onClick={() => setTab(t.id)}
                  className={[
                    "relative z-10 flex-1 rounded-lg px-4 py-2 text-sm transition cursor-pointer",
                    active
                      ? "font-semibold text-adech-swamp-3"
                      : "text-adech-boulevard-4",
                  ].join(" ")}
                  type="button"
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full min-h-52">
          <CodeBlock title={content.title} code={content.code} tabKey={tab} />
        </div>
      </div>
    </section>
  );
}

export default function Hero({ activeTab, onChangeTab }) {
  const goTo = (nextTab) => {
    if (nextTab !== activeTab) {
      onChangeTab(nextTab);
    }
  };

  return (
    <section className="flex flex-col items-start gap-8 sm:grid sm:grid-cols-2 sm:items-start">
      <div className="mx-auto flex w-full flex-col gap-3 self-start">
        <p className="text-sm font-medium uppercase tracking-widest text-adech-venomous-4">
          Portable tokens for interfaces
        </p>

        <h1 className="text-4xl font-semibold">
          Loneliness and introspection
        </h1>

        <p className="text-sm sm:text-base text-adech-boulevard-2">
            Adech is a portable theme ecosystem built around reusable branches for
            interfaces and workspaces. Start with{" "}
            <span className="font-semibold">Superior</span> and use it through{" "}
            <span className="font-semibold">npm</span>,{" "}
            <span className="font-semibold">Tailwind CSS v4</span>,{" "}
            <span className="font-semibold">Tailwind CSS v3</span>, or{" "}
            <span className="font-semibold">CSS variables</span>.
          </p>

        <div className="flex flex-wrap items-center justify-start gap-3">
          <button type="button" onClick={() => goTo("docs")} className="rounded-lg bg-adech-venomous-2 px-4 py-2 text-sm font-medium text-adech-swamp-2 cursor-pointer">
            Installation
          </button>

          <button type="button" onClick={() => goTo("branches")} className="text-sm font-medium text-adech-venomous-1 cursor-pointer">
            Meet the Themes
          </button>
        </div>
      </div>

      <div className="w-full self-start">
        <DocsPreview />
      </div>
    </section>
  );
}
