import { useMemo, useState } from "react";
import ContrastChecker from "../tools/ContrastChecker";
import GuessColor from "../tools/GuessColor";

export default function ToolsSection() {
  const tabs = useMemo(
    () => [
      { id: "contrast", label: "Contrast Checker" },
      { id: "guess", label: "Guess Color" },
      { id: "wheel", label: "Color Wheel" },
      { id: "gradients", label: "Gradients" },
    ],
    []
  );

  const [tab, setTab] = useState("contrast");

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs text-white/55">Adech Lab</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Tools
          </h2>
          <p className="mt-3 text-sm text-white/70 max-w-3xl">
            A collection of color utilities to explore Adech tokens and validate UI decisions.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-white/10 flex-wrap">
          {tabs.map((t) => {
            const active = t.id === tab;

            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  "h-9 px-4 rounded-lg text-sm transition",
                  active
                    ? "bg-core-3/20 text-white ring-1 ring-core-3/25"
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

      {tab === "contrast" && <ContrastChecker />}
      {tab === "guess" && <GuessColor />}

      {/* {tab === "wheel" && (
        <WIP />
      )}

      {tab === "gradients" && (
        <WIP />
      )}*/}
    </section>
  );
}
