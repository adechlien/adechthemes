// src/hooks/useNpmVersion.js
import { useEffect, useMemo, useState } from "react";

export function useNpmVersion(packageName, { cacheMinutes = 60 } = {}) {
  const cacheKey = useMemo(() => `npm_version_${packageName}`, [packageName]);

  // 1) Leer cache de forma síncrona SOLO al inicializar state
  const [version, setVersion] = useState(() => {
    if (!packageName) return null;

    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
      if (!cached?.version || !cached?.ts) return null;

      const ageMs = Date.now() - cached.ts;
      const maxAgeMs = cacheMinutes * 60 * 1000;

      return ageMs < maxAgeMs ? cached.version : null;
    } catch {
      return null;
    }
  });

  // 2) Fetch async para llenar/actualizar (sin setState síncrono dentro del effect)
  useEffect(() => {
    if (!packageName) return;

    const controller = new AbortController();

    fetch(`https://registry.npmjs.org/${packageName}/latest`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then((r) => {
        if (!r.ok) throw new Error("npm registry error");
        return r.json();
      })
      .then((data) => {
        const v = data?.version ?? null;
        if (!v) return;

        setVersion(v);

        try {
          localStorage.setItem(cacheKey, JSON.stringify({ version: v, ts: Date.now() }));
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // ignore: si falla, nos quedamos con lo que haya
      });

    return () => controller.abort();
  }, [packageName, cacheKey]);

  return { version };
}
