// src/components/BranchesSection.jsx
import { useEffect, useMemo, useState } from "react";

const PALETTES = [
  {
    name: "Boulevard",
    role: "Light palette",
    description:
      "Blues for highlights, selection states, and calm emphasis in UI.",
    colors: [
      { token: "core-1", hex: "#C7DCFF" },
      { token: "core-2", hex: "#B4D0FF" },
      { token: "core-3", hex: "#A1C4FF" },
      { token: "core-4", hex: "#8FB1F0" },
    ],
  },
  {
    name: "Venomous",
    role: "Accent palette",
    description:
      "Soft greens and violets for accents, badges, and secondary emphasis.",
    colors: [
      { token: "core-5", hex: "#B0D8BE" },
      { token: "core-6", hex: "#D9EEDB" },
      { token: "core-7", hex: "#F6F8FE" },
      { token: "core-8", hex: "#DBCCE8" },
      { token: "core-9", hex: "#C7AFD7" },
    ],
  },
  {
    name: "Swamp",
    role: "Dark palette",
    description:
      "Deep blues for backgrounds, panels, and editor surfaces.",
    colors: [
      { token: "core-10", hex: "#1E2646" },
      { token: "core-11", hex: "#142039" },
      { token: "core-12", hex: "#091A2B" },
    ],
  },
];

// ===== Contraste (tu función) =====
function getContrast(color) {
  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);
  let brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#222" : "#eee";
}

// ===== TheColorAPI cache =====
const nameCache = new Map();
async function fetchColorName(hex, signal) {
  const key = hex.toUpperCase();
  if (nameCache.has(key)) return nameCache.get(key);

  const clean = key.replace("#", "");
  const res = await fetch(`https://www.thecolorapi.com/id?hex=${clean}`, { signal });
  if (!res.ok) throw new Error("Color API failed");
  const data = await res.json();
  const value = data?.name?.value || key;
  nameCache.set(key, value);
  return value;
}

function SwatchCard({ token, hex }) {
  const [name, setName] = useState(token);
  const [copied, setCopied] = useState(false);

  const textColor = useMemo(() => getContrast(hex), [hex]);

  useEffect(() => {
    const controller = new AbortController();
    fetchColorName(hex, controller.signal)
      .then((n) => setName(n))
      .catch(() => setName(token));
    return () => controller.abort();
  }, [hex, token]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      // noop
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="group rounded-2xl overflow-hidden ring-1 ring-white/10 bg-white/5 text-left transition hover:ring-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-core-3/40"
      title="Click to copy HEX"
      aria-label={`Copy ${hex}`}
    >
      <div className="relative h-28" style={{ backgroundColor: hex }}>
        <div className="absolute inset-0 p-3 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: textColor }}>
                {name}
              </p>
              <p className="text-xs opacity-80 truncate" style={{ color: textColor }}>
                {token}
              </p>
            </div>

            <span
              className={[
                "shrink-0 rounded-full px-2 py-1 text-[11px] font-medium ring-1 transition",
                copied
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0",
              ].join(" ")}
              style={{
                color: textColor,
                borderColor: `${textColor}55`,
                backgroundColor: `${textColor}12`,
              }}
            >
              {copied ? "Copied" : "Copy"}
            </span>
          </div>

          <div className="flex items-end justify-between gap-2">
            <p className="text-xs font-medium" style={{ color: textColor }}>
              {hex.toUpperCase()}
            </p>
            <span className="text-[11px] opacity-80" style={{ color: textColor }}>
              Click
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        <p className="text-xs text-white/55">Token</p>
        <p className="text-xs text-white/80">{token}</p>
      </div>
    </button>
  );
}

function PaletteBlock({ palette }) {
  return (
    <section className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{palette.name}</h3>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
              {palette.role}
            </span>
          </div>
          <p className="mt-2 text-sm text-white/70 max-w-2xl">{palette.description}</p>
        </div>

        <div className="text-xs text-white/50">
          Click a swatch to copy HEX
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {palette.colors.map((c) => (
          <SwatchCard key={c.token} token={c.token} hex={c.hex} />
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
        <p className="text-xs text-white/55">Suggested usage</p>
        <p className="mt-1 text-sm text-white/75">
          Use tokens <span className="text-white/90 font-medium">{palette.colors[0].token}</span> →{" "}
          <span className="text-white/90 font-medium">{palette.colors[palette.colors.length - 1].token}</span>{" "}
          for consistent styling across your UI.
        </p>
      </div>
    </section>
  );
}

export default function BranchesSection() {
  return (
    <section className="flex flex-col gap-10">
      {/* Intro (Nord-like) */}
      <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-8">
        <p className="text-xs text-white/55">Colors & Palettes</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Adech Superior
        </h2>
        <p className="mt-3 text-sm text-white/70 max-w-3xl">
          Superior is structured in palettes (Boulevard, Venomous, Swamp). Each palette
          groups colors by role (light, accent, dark) so you can build consistent UIs without
          guessing. Inspired by Nord’s “Colors & Palettes” documentation style.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
            <p className="text-xs text-white/55">Tokenized</p>
            <p className="mt-1 text-sm text-white/80">core-1 → core-12</p>
          </div>
          <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
            <p className="text-xs text-white/55">Workflow</p>
            <p className="mt-1 text-sm text-white/80">Pick palette → apply tokens</p>
          </div>
          <div className="rounded-2xl bg-black/20 ring-1 ring-white/10 p-4">
            <p className="text-xs text-white/55">Action</p>
            <p className="mt-1 text-sm text-white/80">Click swatches to copy HEX</p>
          </div>
        </div>
      </div>

      {/* Palettes */}
      <div className="flex flex-col gap-6">
        {PALETTES.map((p) => (
          <PaletteBlock key={p.name} palette={p} />
        ))}
      </div>
    </section>
  );
}
