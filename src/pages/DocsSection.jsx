import { useMemo, useState } from "react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      // noop
    }
  };

  return (
    <button
      onClick={onCopy}
      className="h-9 rounded-lg bg-white/5 px-3 text-xs text-white/80 ring-1 ring-white/10 hover:bg-white/10 transition"
      type="button"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ title, code }) {
  return (
    <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <p className="text-xs font-medium text-white/70">{title}</p>
        <CopyButton text={code} />
      </div>
      <pre className="px-4 py-4 text-[12px] leading-relaxed text-white/80 overflow-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DocsSection() {
  const tabs = useMemo(
    () => [
      { id: "install", label: "Install" },
      { id: "tailwind", label: "Tailwind" },
      { id: "css", label: "CSS Variables" },
    ],
    []
  );

  const [tab, setTab] = useState("install");

  const content = useMemo(() => {
    if (tab === "install") {
      return {
        title: "Install with npm",
        desc:
          "Instala el paquete y luego elige si usas Tailwind tokens o variables CSS.",
        code: `npm i @adech/themes`,
      };
    }

    if (tab === "tailwind") {
      return {
        title: "Use Adech tokens in Tailwind",
        desc:
          "Usa clases estables como bg-core-12, text-core-1, etc. (mapeadas a CSS variables).",
        code: `export default function Card() {
  return (
    <div className="bg-core-12 text-core-1 rounded-2xl p-6 ring-1 ring-core-2/15">
      <p className="text-core-2/80">Adech Superior</p>

      <button className="mt-4 rounded-xl bg-core-3/20 px-4 py-2 text-core-3 hover:bg-core-3/30 transition">
        Button
      </button>
    </div>
  );
}`,
      };
    }

    return {
      title: "CSS variables (like Nord Usage)",
      desc:
        "Importa tu CSS de tokens y usa var(--core-*) en estilos. (Nord muestra este patrón en su guía de uso).",
      code: `/* Example: core tokens */
:root {
  --core-1: 199 220 255; /* #C7DCFF */
  --core-2: 180 208 255; /* #B4D0FF */
  --core-3: 161 196 255; /* #A1C4FF */
  --core-4: 143 177 240; /* #8FB1F0 */
  /* --core-5 .. --core-12 */
}

/* Usage */
.hero {
  background: rgb(var(--core-12));
  color: rgb(var(--core-1));
}`,
    };
  }, [tab]);

  return (
    <section id="docs" className="scroll-mt-24">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Docs
          </h2>
          <p className="mt-2 text-sm text-white/70 max-w-2xl">
            Instalación y uso al estilo “Usage” de Nord: primero instalar, luego
            elegir tu forma de consumir los tokens.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
          {tabs.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  "h-9 px-4 rounded-lg text-sm transition",
                  active
                    ? "bg-core-3/20 text-core-1 ring-1 ring-core-3/25"
                    : "text-white/70 hover:text-white hover:bg-white/5",
                ].join(" ")}
                type="button"
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6">
          <p className="text-xs text-white/55">Guide</p>
          <h3 className="mt-1 text-lg font-semibold text-white">How to use</h3>
          <p className="mt-2 text-sm text-white/70">{content.desc}</p>

          <div className="mt-5 space-y-2 text-sm text-white/70">
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
              <p className="text-white/80 font-medium">Recommended</p>
              <p className="mt-1 text-white/65">
                Usa Tailwind tokens (<span className="text-white/80">core-1..core-12</span>) para mantener tu UI estable.
              </p>
            </div>
            <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
              <p className="text-white/80 font-medium">Also works</p>
              <p className="mt-1 text-white/65">
                Variables CSS si no usas Tailwind o quieres runtime styling.
              </p>
            </div>
          </div>
        </div>

        <CodeBlock title={content.title} code={content.code} />
      </div>
    </section>
  );
}
