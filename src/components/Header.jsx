import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNpmVersion } from "../hooks/useNpmVersion";

const TABS = [
  { id: "home", label: "Home" },
  { id: "branches", label: "Branches" },
  { id: "workspaces", label: "Workspaces" },
  { id: "docs", label: "Docs" },
  { id: "tools", label: "Tools" },
];

export default function Header({ activeTab, onChangeTab }) {
  const { version, status } = useNpmVersion("@adech/themes", { cacheMinutes: 60 });

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navTabRefs = useRef({});
  const [sliderStyle, setSliderStyle] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    opacity: 0,
  });

  const linkBase = "relative z-10 text-base transition px-4 py-1 rounded-lg uppercase font-semibold";
  const linkActive = "text-adech-swamp-1";
  const linkIdle = "text-adech-boulevard-4 hover:cursor-pointer";

  const activeItem = useMemo(
    () => TABS.find((tab) => tab.id === activeTab) || TABS[0],
    [activeTab]
  );

  const go = (tab) => {
    onChangeTab(tab);
    setOpen(false);
  };

  const updateSlider = () => {
    const activeButton = navTabRefs.current[activeTab];
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
  }, [activeTab]);

  useEffect(() => {
    updateSlider();

    const onResize = () => updateSlider();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [activeTab]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="flex items-center justify-between gap-4 p-4">
      <button
        onClick={() => go("home")}
        className="flex min-w-0 items-center gap-2"
        type="button"
      >
        <img src="/adech-logo.svg" className="w-8 shrink-0" alt="Adech Theme" />
        <span className="truncate text-2xl">Adech</span>
        <span className="shrink-0 text-xs text-adech-venomous-2">
          {status === "loading" ? "…" : version ? `v${version}` : "v—"}
        </span>
      </button>

      <nav className="relative hidden md:flex gap-2 font-bellota bg-adech-swamp-3 rounded-xl p-1">
        <span
          className="pointer-events-none absolute left-0 top-0 rounded-lg bg-adech-boulevard-4 transition-all duration-300 ease-out"
          style={{
            width: `${sliderStyle.width}px`,
            height: `${sliderStyle.height}px`,
            transform: `translate(${sliderStyle.x}px, ${sliderStyle.y}px)`,
            opacity: sliderStyle.opacity,
          }}
        />

        {TABS.map((tab) => {
          const isCurrent = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(node) => {
                if (node) navTabRefs.current[tab.id] = node;
              }}
              type="button"
              onClick={() => go(tab.id)}
              className={`${linkBase} ${isCurrent ? linkActive : linkIdle}`}
              aria-current={isCurrent ? "page" : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="relative md:hidden" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-xl transition hover:cursor-pointer p-1 bg-adech-swamp-3"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="text-base px-4 py-1 rounded-lg uppercase font-semibold bg-adech-boulevard-4 text-adech-swamp-1">
            {activeItem.label}
          </span>
        </button>

        <div
          className={[
            "absolute right-0 top-[calc(100%+0.5rem)] z-30",
            "rounded-xl bg-adech-swamp-3 p-1 shadow-lg",
            "origin-top-right transition-all duration-200",
            open
              ? "visible scale-100 opacity-100 pointer-events-auto"
              : "invisible scale-95 opacity-0 pointer-events-none",
          ].join(" ")}
          role="menu"
        >
          <nav className="flex flex-col gap-1 font-bellota">
            {TABS.map((tab) => {
              const isCurrent = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => go(tab.id)}
                  className={`text-base transition px-4 py-1 rounded-lg uppercase font-semibold text-right ${
                    isCurrent
                      ? "bg-adech-boulevard-4 text-adech-swamp-1"
                      : "text-adech-boulevard-4 hover:bg-adech-swamp-1 hover:cursor-pointer"
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                  role="menuitem"
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
