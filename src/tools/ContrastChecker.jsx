import { useMemo, useState } from "react";

function hexToRgb(hex) {
  const c = hex.replace("#", "").trim();
  if (c.length !== 6) return null;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b };
}

function srgbToLinear(v) {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance({ r, g, b }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  if (!a || !b) return null;

  const L1 = luminance(a);
  const L2 = luminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return (lighter + 0.05) / (darker + 0.05);
}

function passLabel(ratio, size = "normal") {
  if (ratio == null) return { aa: false, aaa: false };

  const aa = size === "large" ? ratio >= 3 : ratio >= 4.5;
  const aaa = size === "large" ? ratio >= 4.5 : ratio >= 7;
  return { aa, aaa };
}

function Pill({ ok, children }) {
  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs ring-1",
        ok
          ? "bg-core-3/15 text-white/80 ring-core-3/20"
          : "bg-white/5 text-white/55 ring-white/10",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function ContrastChecker() {
  const [fg, setFg] = useState("#F6F8FE");
  const [bg, setBg] = useState("#091A2B");
  const [size, setSize] = useState("normal");

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const passes = useMemo(() => passLabel(ratio, size), [ratio, size]);
  const formatted = ratio ? ratio.toFixed(2) : "—";

  const onSwap = () => {
    setFg(bg);
    setBg(fg);
  };

  const copyResult = async () => {
    const text = `Foreground: ${fg}\nBackground: ${bg}\nContrast: ${formatted}:1\nSize: ${size}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Niente
    }
  };

  return (
    <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-white">Contrast Checker</h3>
          <p className="mt-1 text-sm text-white/70 max-w-2xl">
            Check readability between two colors. Helpful to validate token pairs
            for UI text and backgrounds.
          </p>
        </div>

        <button
          onClick={copyResult}
          className="h-10 rounded-xl bg-white/5 px-4 text-sm text-white/85 ring-1 ring-white/10 hover:bg-white/10 transition"
          type="button"
        >
          Copy result
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/55">Foreground</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="h-10 w-full rounded-xl bg-white/5 px-3 text-sm text-white/85 ring-1 ring-white/10 outline-none"
                  placeholder="#F6F8FE"
                />
                <input
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="h-10 w-12 rounded-xl bg-transparent ring-1 ring-white/10"
                  aria-label="Pick foreground color"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/55">Background</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-10 w-full rounded-xl bg-white/5 px-3 text-sm text-white/85 ring-1 ring-white/10 outline-none"
                  placeholder="#091A2B"
                />
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-10 w-12 rounded-xl bg-transparent ring-1 ring-white/10"
                  aria-label="Pick background color"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
              <button
                type="button"
                onClick={() => setSize("normal")}
                className={[
                  "h-9 px-4 rounded-lg text-sm transition",
                  size === "normal"
                    ? "bg-core-3/20 text-white ring-1 ring-core-3/25"
                    : "text-white/70 hover:text-white hover:bg-white/5",
                ].join(" ")}
              >
                Normal text
              </button>
              <button
                type="button"
                onClick={() => setSize("large")}
                className={[
                  "h-9 px-4 rounded-lg text-sm transition",
                  size === "large"
                    ? "bg-core-3/20 text-white ring-1 ring-core-3/25"
                    : "text-white/70 hover:text-white hover:bg-white/5",
                ].join(" ")}
              >
                Large text
              </button>
            </div>

            <button
              onClick={onSwap}
              className="h-10 rounded-xl bg-white/5 px-4 text-sm text-white/85 ring-1 ring-white/10 hover:bg-white/10 transition"
              type="button"
            >
              Swap
            </button>
          </div>
        </div>

        <div className="rounded-2xl ring-1 ring-white/10 overflow-hidden">
          <div className="p-5" style={{ backgroundColor: bg, color: fg }}>
            <p className="text-xs opacity-80">Preview</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              Contrast {formatted}:1
            </p>
            <p className="mt-3 text-sm opacity-90 max-w-md">
              The quick brown fox jumps over the lazy dog. 0123456789
            </p>

            <div className="mt-5 flex items-center gap-2 flex-wrap">
              <span
                className="rounded-full px-3 py-1 text-xs ring-1"
                style={{
                  borderColor: `${fg}55`,
                  backgroundColor: `${fg}12`,
                  color: fg,
                }}
              >
                FG {fg.toUpperCase()}
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs ring-1"
                style={{
                  borderColor: `${fg}55`,
                  backgroundColor: `${fg}12`,
                  color: fg,
                }}
              >
                BG {bg.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-black/20 border-t border-white/10 p-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Pill ok={passes.aa}>AA</Pill>
              <Pill ok={passes.aaa}>AAA</Pill>
              <span className="text-xs text-white/55">
                ({size === "large" ? "large" : "normal"} text)
              </span>
            </div>

            <span className="text-xs text-white/55">
              {ratio ? "WCAG contrast ratio" : "Invalid HEX"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
