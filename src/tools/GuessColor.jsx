import { useEffect, useState } from "react";

function hexToRgb(hex) {
  const c = hex.replace("#", "").trim();
  if (c.length !== 6) return null;

  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);

  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b };
}

function readableText(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#F3F4F6";

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? "#1F2937" : "#F9FAFB";
}

function generateHexCode() {
  const hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
  let hexCode = "#";

  for (let i = 0; i < 6; i++) {
    hexCode += hexDigits[Math.floor(Math.random() * hexDigits.length)];
  }

  return hexCode;
}

function createInitialState() {
  return {
    targetColor: generateHexCode(),
    targetCodeVisible: "",
    targetName: "",
    guessInput: "",
    guessColor: "",
    guessName: "",
    percentage: "?",
    rgbStats: ["?", "?", "?"],
    message: "Type the Hex code",
  };
}

function checkCodes(targetHex, guessHex) {
  const target = targetHex.replace("#", "");
  const guess = guessHex.replace("#", "");

  let percentage = 0;
  const rgbPercentages = [0, 0, 0];

  for (let i = 0; i < 6; i += 2) {
    const targetDigit = parseInt(target.slice(i, i + 2), 16);
    const guessDigit = parseInt(guess.slice(i, i + 2), 16);
    const difference = Math.abs(targetDigit - guessDigit);

    rgbPercentages[i / 2] = Math.max(0, Math.round(100 - difference / 2.55));
    percentage += 100 - difference / 2.55;
  }

  return {
    percentage: (percentage / 3).toFixed(1).replace(/\.?0+$/, ""),
    rgbPercentages: rgbPercentages.map(String),
  };
}

function getMessage(percentage) {
  const p = Number(percentage);

  if (p === 100) return "Well done! You guessed the color!";
  if (p >= 95) return "C'mon! Just fix some details!";
  if (p >= 90) return "Almost there!";
  if (p >= 80) return "You're close!";
  if (p >= 70) return "Keep trying!";
  if (p >= 60) return "You can do better!";
  if (p >= 40) return "You're far!";
  if (p >= 20) return "You're very far!";
  return "I guessed colors are not your thing...";
}

async function fetchColorName(hex) {
  try {
    const clean = hex.replace("#", "");
    const res = await fetch(`https://www.thecolorapi.com/id?hex=${clean}`);

    if (!res.ok) throw new Error("Network error");

    const data = await res.json();
    return data?.name?.value || "";
  } catch {
    return "";
  }
}

function StatBox({ value, tone = "text-white" }) {
  return (
    <div className="min-w-[64px] rounded-xl bg-[#09152A] px-4 py-3 text-center shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <span className={`text-2xl font-semibold tracking-tight ${tone}`}>
        {value === "?" ? "?" : `${value}%`}
      </span>
    </div>
  );
}

function GuessColorBoard({
  targetColor,
  targetCodeVisible,
  targetName,
  guessColor,
  guessName,
  guessInput,
  percentage,
  rgbStats,
  message,
  onInputChange,
  onGuess,
  onSeeCode,
  onRetry,
  onAnotherColor,
  onZenMode,
  showZenButton = true,
  fullscreen = false,
}) {
  const targetTextColor = readableText(targetColor);
  const guessBg = guessColor || "#7BC2BF";
  const guessTextColor = readableText(guessBg);

  return (
    <div
      className={[
        "relative overflow-hidden ",
        fullscreen ? "min-h-[100svh] rounded-none ring-0" : "h-full rounded-lg",
      ].join(" ")}
    >
      <div className="grid min-h-inherit grid-cols-1 md:grid-cols-2">
        <div
          className="flex min-h-[260px] items-center justify-center px-8 py-14 text-center"
          style={{ backgroundColor: targetColor, color: targetTextColor }}
        >
          <div>
            <p className="text-[13px] opacity-80">Target</p>
            <p className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
              {targetCodeVisible || ""}
            </p>
            <p className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
              {targetName || ""}
            </p>
          </div>
        </div>

        <div
          className="flex min-h-[260px] items-center justify-center px-8 py-14 text-center"
          style={{ backgroundColor: guessBg, color: guessTextColor }}
        >
          <div>
            <p className="text-[13px] opacity-80">Your guess</p>
            <p className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
              {guessColor || ""}
            </p>
            <p className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
              {guessName || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
        <div className="pointer-events-auto w-full max-w-[320px] rounded-2xl bg-[#1A2550] px-4 py-5 text-center text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:max-w-[360px]">
          <h3 className="text-[2rem] font-semibold leading-none tracking-tight">
            {percentage === "?" ? "Guess it" : message}
          </h3>

          <p className="mt-4 text-lg text-white/70">
            {guessInput ? `#${guessInput}` : "Type the Hex code"}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <StatBox value={rgbStats[0]} tone="text-[#E7A1A1]" />
            <StatBox value={rgbStats[1]} tone="text-[#DCEFD9]" />
            <StatBox value={rgbStats[2]} tone="text-[#DDE7FF]" />
          </div>

          <div className="mt-5">
            <div className="flex items-center rounded-xl bg-[#09152A] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
              <span className="mr-2 text-lg text-white/60">#</span>
              <input
                value={guessInput}
                onChange={onInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onGuess();
                }}
                maxLength={6}
                placeholder="FF99FF"
                className="w-full bg-transparent text-center text-lg uppercase tracking-[0.2em] text-white outline-none placeholder:text-white/25"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <button
              onClick={onAnotherColor}
              className="rounded-xl bg-[#222E61] px-3 py-3 text-base font-medium text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition hover:bg-[#2A3873]"
              type="button"
            >
              Change
            </button>

            <button
              onClick={onSeeCode}
              className="rounded-xl bg-[#222E61] px-3 py-3 text-base font-medium text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition hover:bg-[#2A3873]"
              type="button"
            >
              See code
            </button>

            <button
              onClick={onRetry}
              className="rounded-xl bg-[#222E61] px-3 py-3 text-base font-medium text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition hover:bg-[#2A3873]"
              type="button"
            >
              Retry
            </button>
          </div>

          <button
            onClick={onGuess}
            className="mt-3 w-full rounded-xl bg-core-3/20 px-4 py-3 text-base font-medium text-white ring-1 ring-core-3/25 transition hover:bg-core-3/25"
            type="button"
          >
            Guess
          </button>

          {showZenButton && (
            <button
              onClick={onZenMode}
              className="mt-3 w-full rounded-xl bg-white/8 px-4 py-3 text-sm font-medium text-white/90 ring-1 ring-white/10 transition hover:bg-white/12"
              type="button"
            >
              Zen mode
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuessColor() {
  const [game, setGame] = useState(createInitialState);
  const [zenMode, setZenMode] = useState(false);

  useEffect(() => {
    if (!zenMode) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setZenMode(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [zenMode]);

  const resetRound = () => {
    setGame((prev) => ({
      ...prev,
      targetCodeVisible: "",
      targetName: "",
      guessInput: "",
      guessColor: "",
      guessName: "",
      percentage: "?",
      rgbStats: ["?", "?", "?"],
      message: "Type the Hex code",
    }));
  };

  const generateNewColor = () => {
    setGame({
      targetColor: generateHexCode(),
      targetCodeVisible: "",
      targetName: "",
      guessInput: "",
      guessColor: "",
      guessName: "",
      percentage: "?",
      rgbStats: ["?", "?", "?"],
      message: "Type the Hex code",
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9A-Fa-f]/g, "").toUpperCase();
    setGame((prev) => ({
      ...prev,
      guessInput: value,
    }));
  };

  const handleGuess = async () => {
    let guess = game.guessInput.trim().replace("#", "").toUpperCase();

    if (guess.length === 3) {
      guess = `${guess[0]}${guess[0]}${guess[1]}${guess[1]}${guess[2]}${guess[2]}`;
    }

    if (guess.length !== 6) return;

    const hexGuess = `#${guess}`;
    const result = checkCodes(game.targetColor, hexGuess);

    setGame((prev) => ({
      ...prev,
      guessColor: hexGuess,
      percentage: result.percentage,
      rgbStats: result.rgbPercentages,
      message: getMessage(result.percentage),
      guessInput: "",
    }));

    const name = await fetchColorName(hexGuess);

    setGame((prev) => ({
      ...prev,
      guessName: name,
    }));
  };

  const handleSeeCode = async () => {
    const color = game.targetColor;

    setGame((prev) => ({
      ...prev,
      targetCodeVisible: color,
    }));

    const name = await fetchColorName(color);

    setGame((prev) => ({
      ...prev,
      targetName: name,
    }));
  };

  return (
    <>
      <div className="rounded-3xl h-full">
        <GuessColorBoard
          targetColor={game.targetColor}
          targetCodeVisible={game.targetCodeVisible}
          targetName={game.targetName}
          guessColor={game.guessColor}
          guessName={game.guessName}
          guessInput={game.guessInput}
          percentage={game.percentage}
          rgbStats={game.rgbStats}
          message={game.message}
          onInputChange={handleInputChange}
          onGuess={handleGuess}
          onSeeCode={handleSeeCode}
          onRetry={resetRound}
          onAnotherColor={generateNewColor}
          onZenMode={() => setZenMode(true)}
          showZenButton
        />
      </div>

      {zenMode && (
        <div className="fixed inset-0 z-[999] bg-black/75 backdrop-blur-md">
          <button
            onClick={() => setZenMode(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white ring-1 ring-white/15 transition hover:bg-white/15 md:right-6 md:top-6"
            type="button"
            aria-label="Close zen mode"
          >
            ✕
          </button>

          <GuessColorBoard
            targetColor={game.targetColor}
            targetCodeVisible={game.targetCodeVisible}
            targetName={game.targetName}
            guessColor={game.guessColor}
            guessName={game.guessName}
            guessInput={game.guessInput}
            percentage={game.percentage}
            rgbStats={game.rgbStats}
            message={game.message}
            onInputChange={handleInputChange}
            onGuess={handleGuess}
            onSeeCode={handleSeeCode}
            onRetry={resetRound}
            onAnotherColor={generateNewColor}
            onZenMode={() => setZenMode(false)}
            showZenButton={false}
            fullscreen
          />
        </div>
      )}
    </>
  );
}
