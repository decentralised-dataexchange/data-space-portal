"use client";

import React, { useEffect, useRef } from 'react';
import 'swagger-ui-dist/swagger-ui.css';
import './SwaggerDoc.scss';

declare global {
  interface Window {
    SwaggerUIBundle?: any;
  }
}

export type SwaggerDocProps = {
  openApiUrl: string;
  uiTweaks?: {
    hideInfoSubsections?: boolean;
    forceShowBar?: boolean;
    injectDefaultSecurity?: boolean;
    injectDefaultServers?: boolean;
    removeHeaderBorder?: boolean;
  };
};

export default function SwaggerDoc({ openApiUrl, uiTweaks }: SwaggerDocProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tweaks = {
    hideInfoSubsections: true,
    forceShowBar: true,
    injectDefaultSecurity: true,
    injectDefaultServers: true,
    removeHeaderBorder: true,
    ...(uiTweaks || {}),
  };

  // CSS is bundled via import above; no dynamic injection needed

  // Load the Swagger UI bundle script (CDN) and initialize
  useEffect(() => {
    let cancelled = false;
    const scriptId = 'swagger-ui-bundle-js';
    const ensureScript = () => new Promise<void>((resolve, reject) => {
      if (window.SwaggerUIBundle) return resolve();
      let s = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement('script');
        s.id = scriptId;
        s.src = 'https://unpkg.com/swagger-ui-dist@4.19.1/swagger-ui-bundle.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load Swagger UI bundle'));
        document.body.appendChild(s);
      } else {
        s.onload = () => resolve();
        if ((s as any).readyState === 'complete') resolve();
      }
    });
    // Lazy-load YAML parser when needed (global: window.jsyaml)
    const ensureYaml = () => new Promise<void>((resolve) => {
      try {
        if ((window as any).jsyaml && typeof (window as any).jsyaml.load === 'function') return resolve();
      } catch {}
      const id = 'js-yaml-lib';
      let s = document.getElementById(id) as HTMLScriptElement | null;
      if (!s) {
        s = document.createElement('script');
        s.id = id;
        s.src = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => resolve(); // fail open; we'll just skip YAML
        document.body.appendChild(s);
      } else {
        s.onload = () => resolve();
        if ((s as any).readyState === 'complete') resolve();
      }
    });

    const init = async () => {
      try {
        await ensureScript();
        // Preload YAML parser so interceptors can parse YAML synchronously
        await ensureYaml();
        if (cancelled || !containerRef.current || !window.SwaggerUIBundle) return;
        // Clear previous instance
        containerRef.current.innerHTML = '';
        // Note: All programmatic URL-lowercasing has been removed per user preference.
        // Plugin to alias schema names in the parsed spec (works for JSON or YAML sources)
        const schemaAliasPlugin = () => ({
          statePlugins: {
            spec: {
              wrapActions: {
                updateJsonSpec: (ori: any) => (spec: any) => {
                  try {
                    // Support OAS3 components.schemas and OAS2 definitions, plus $ref rewrite with suffix fallback
                    const containers: Array<{ map: any, base: string }> = [];
                    const schemas = spec && spec.components && spec.components.schemas;
                    const definitions = spec && spec.definitions;
                    if (schemas && typeof schemas === 'object') containers.push({ map: schemas, base: '#/components/schemas/' });
                    if (definitions && typeof definitions === 'object') containers.push({ map: definitions, base: '#/definitions/' });

                    if (containers.length) {
                      // Alias all keys
                      for (const { map } of containers) {
                        const keys = Object.keys(map);
                        for (const k of keys) {
                          const variants = new Set<string>();
                          variants.add(k.replace(/\+/g, '.'));
                          variants.add(k.replace(/\./g, '+'));
                          variants.add(k.replace(/\+/g, '_'));
                          variants.add(k.replace(/\./g, '_'));
                          // Add variants toggling only the last separator between last two segments
                          const idxDot = k.lastIndexOf('.');
                          if (idxDot >= 0) variants.add(k.slice(0, idxDot) + '+' + k.slice(idxDot + 1));
                          const idxPlus = k.lastIndexOf('+');
                          if (idxPlus >= 0) variants.add(k.slice(0, idxPlus) + '.' + k.slice(idxPlus + 1));
                          for (const v of variants) if (v && v !== k && !map[v]) map[v] = map[k];
                        }
                      }
                      // Build global key set and suffix map
                      const allKeys = new Set<string>();
                      const locator = new Map<string, string>(); // key -> base path
                      for (const { map, base } of containers) {
                        for (const k of Object.keys(map)) {
                          allKeys.add(k);
                          if (!locator.has(k)) locator.set(k, base);
                        }
                      }
                      const suffixMap = new Map<string, string[]>();
                      const getSuffix = (name: string) => {
                        const norm = name.replace(/\+/g, '.');
                        const idx = norm.lastIndexOf('.');
                        return idx >= 0 ? norm.slice(idx + 1) : norm;
                      };
                      const getNormPrefix = (name: string) => {
                        const norm = name.replace(/\+/g, '.');
                        const idx = norm.lastIndexOf('.');
                        return idx >= 0 ? norm.slice(0, idx) : '';
                      };
                      for (const key of allKeys) {
                        const sfx = getSuffix(key);
                        const arr = suffixMap.get(sfx) || [];
                        arr.push(key);
                        suffixMap.set(sfx, arr);
                      }
                      const pick = (name: string): { key: string, base?: string } => {
                        if (allKeys.has(name)) return { key: name, base: locator.get(name) };
                        const idxDot = name.lastIndexOf('.');
                        const lastDotToPlus = idxDot >= 0 ? name.slice(0, idxDot) + '+' + name.slice(idxDot + 1) : name;
                        const idxPlus = name.lastIndexOf('+');
                        const lastPlusToDot = idxPlus >= 0 ? name.slice(0, idxPlus) + '.' + name.slice(idxPlus + 1) : name;
                        const alts = [
                          name.replace(/\+/g, '.'),
                          name.replace(/\./g, '+'),
                          name.replace(/\+/g, '_'),
                          name.replace(/\./g, '_'),
                          lastDotToPlus,
                          lastPlusToDot,
                        ];
                        for (const a of alts) if (allKeys.has(a)) return { key: a, base: locator.get(a) };
                        const sfx = getSuffix(name);
                        const matches = suffixMap.get(sfx) || [];
                        if (matches.length === 1) return { key: matches[0], base: locator.get(matches[0]) };
                        if (matches.length > 1) {
                          // Prefer candidate whose normalized prefix matches our normalized prefix the most
                          const wantPrefix = getNormPrefix(name);
                          let best: string | null = null;
                          let bestScore = -1;
                          for (const m of matches) {
                            const p = getNormPrefix(m);
                            // score: exact match -> high; else length of longest common suffix of prefix
                            let score = 0;
                            if (p === wantPrefix) score = 1e6; else {
                              // compute suffix overlap
                              const pa = p.split('.');
                              const wa = wantPrefix.split('.');
                              let i = pa.length - 1, j = wa.length - 1, cnt = 0;
                              while (i >= 0 && j >= 0 && pa[i] === wa[j]) { cnt++; i--; j--; }
                              score = cnt;
                            }
                            if (score > bestScore) { bestScore = score; best = m; }
                          }
                          if (best) return { key: best, base: locator.get(best) };
                        }
                        return { key: name };
                      };
                      const missing = new Set<string>();
                      const walk = (node: any) => {
                        if (!node || typeof node !== 'object') return;
                        if (typeof node.$ref === 'string') {
                          const mComp = node.$ref.match(/^#\/components\/schemas\/(.+)$/);
                          const mDef = !mComp && node.$ref.match(/^#\/definitions\/(.+)$/);
                          const target = mComp ? mComp[1] : (mDef ? mDef[1] : null);
                          if (target) {
                            const { key: fixed, base } = pick(target);
                            // Prefer '.' variants if original ref contains '+' and a dot-alias exists
                            let chosenKey = fixed;
                            if (/\+/.test(target)) {
                              const dotAll = target.replace(/\+/g, '.');
                              if (allKeys.has(dotAll)) {
                                chosenKey = dotAll;
                              } else {
                                const idxPlus2 = target.lastIndexOf('+');
                                if (idxPlus2 >= 0) {
                                  const lastDotVariant = target.slice(0, idxPlus2) + '.' + target.slice(idxPlus2 + 1);
                                  if (allKeys.has(lastDotVariant)) chosenKey = lastDotVariant;
                                }
                              }
                            }
                            let chosenBase = base as string | undefined;
                            if (!chosenBase) {
                              if (mComp) {
                                chosenBase = schemas ? '#/components/schemas/' : (definitions ? '#/definitions/' : '#/components/schemas/');
                              } else {
                                chosenBase = definitions ? '#/definitions/' : (schemas ? '#/components/schemas/' : '#/definitions/');
                              }
                            }
                            node.$ref = chosenBase + chosenKey;
                            if (!allKeys.has(chosenKey)) missing.add(chosenKey);
                          }
                        }
                        for (const key of Object.keys(node)) walk(node[key]);
                      };
                      walk(spec);
                      if (missing.size) {
                        for (const name of missing) for (const { map } of containers) if (!map[name]) map[name] = { type: 'object', description: 'Auto-generated placeholder for unresolved schema' };
                      }
                    }
                  } catch {}
                  return ori(spec);
                }
                ,
                updateSpec: (ori: any) => (spec: any) => {
                  try {
                    const obj = typeof spec === 'string' ? null : spec;
                    if (!obj) return ori(spec);
                    const containers: Array<{ map: any, base: string }> = [];
                    const schemas = obj.components && obj.components.schemas;
                    const definitions = obj.definitions;
                    if (schemas && typeof schemas === 'object') containers.push({ map: schemas, base: '#/components/schemas/' });
                    if (definitions && typeof definitions === 'object') containers.push({ map: definitions, base: '#/definitions/' });
                    if (containers.length) {
                      for (const { map } of containers) {
                        const keys = Object.keys(map);
                        for (const k of keys) {
                          const variants = new Set<string>();
                          variants.add(k.replace(/\+/g, '.'));
                          variants.add(k.replace(/\./g, '+'));
                          variants.add(k.replace(/\+/g, '_'));
                          variants.add(k.replace(/\./g, '_'));
                          // last-separator toggles
                          const idxDot = k.lastIndexOf('.');
                          if (idxDot >= 0) variants.add(k.slice(0, idxDot) + '+' + k.slice(idxDot + 1));
                          const idxPlus = k.lastIndexOf('+');
                          if (idxPlus >= 0) variants.add(k.slice(0, idxPlus) + '.' + k.slice(idxPlus + 1));
                          for (const v of variants) if (v && v !== k && !map[v]) map[v] = map[k];
                        }
                      }
                      const allKeys = new Set<string>();
                      const locator = new Map<string, string>();
                      for (const { map, base } of containers) for (const k of Object.keys(map)) { allKeys.add(k); if (!locator.has(k)) locator.set(k, base); }
                      const suffixMap = new Map<string, string[]>();
                      const getSuffix = (name: string) => {
                        const norm = name.replace(/\+/g, '.');
                        const idx = norm.lastIndexOf('.');
                        return idx >= 0 ? norm.slice(idx + 1) : norm;
                      };
                      const getNormPrefix = (name: string) => {
                        const norm = name.replace(/\+/g, '.');
                        const idx = norm.lastIndexOf('.');
                        return idx >= 0 ? norm.slice(0, idx) : '';
                      };
                      for (const key of allKeys) {
                        const sfx = getSuffix(key);
                        const arr = suffixMap.get(sfx) || [];
                        arr.push(key);
                        suffixMap.set(sfx, arr);
                      }
                      const pick = (name: string): { key: string, base?: string } => {
                        if (allKeys.has(name)) return { key: name, base: locator.get(name) };
                        const idxDot = name.lastIndexOf('.');
                        const lastDotToPlus = idxDot >= 0 ? name.slice(0, idxDot) + '+' + name.slice(idxDot + 1) : name;
                        const idxPlus = name.lastIndexOf('+');
                        const lastPlusToDot = idxPlus >= 0 ? name.slice(0, idxPlus) + '.' + name.slice(idxPlus + 1) : name;
                        const alts = [name.replace(/\+/g, '.'), name.replace(/\./g, '+'), name.replace(/\+/g, '_'), name.replace(/\./g, '_'), lastDotToPlus, lastPlusToDot];
                        for (const a of alts) if (allKeys.has(a)) return { key: a, base: locator.get(a) };
                        const sfx = getSuffix(name);
                        const matches = suffixMap.get(sfx) || [];
                        if (matches.length === 1) return { key: matches[0], base: locator.get(matches[0]) };
                        if (matches.length > 1) {
                          const wantPrefix = getNormPrefix(name);
                          let best: string | null = null;
                          let bestScore = -1;
                          for (const m of matches) {
                            const p = getNormPrefix(m);
                            let score = 0;
                            if (p === wantPrefix) score = 1e6; else {
                              const pa = p.split('.');
                              const wa = wantPrefix.split('.');
                              let i = pa.length - 1, j = wa.length - 1, cnt = 0;
                              while (i >= 0 && j >= 0 && pa[i] === wa[j]) { cnt++; i--; j--; }
                              score = cnt;
                            }
                            if (score > bestScore) { bestScore = score; best = m; }
                          }
                          if (best) return { key: best, base: locator.get(best) };
                        }
                        return { key: name };
                      };
                      const missing = new Set<string>();
                      const walk = (node: any) => {
                        if (!node || typeof node !== 'object') return;
                        if (typeof node.$ref === 'string') {
                          const mComp = node.$ref.match(/^#\/components\/schemas\/(.+)$/);
                          const mDef = !mComp && node.$ref.match(/^#\/definitions\/(.+)$/);
                          const target = mComp ? mComp[1] : (mDef ? mDef[1] : null);
                          if (target) {
                            const { key: fixed, base } = pick(target);
                            let chosenBase = base as string | undefined;
                            if (!chosenBase) {
                              if (mComp) {
                                chosenBase = schemas ? '#/components/schemas/' : (definitions ? '#/definitions/' : '#/components/schemas/');
                              } else {
                                chosenBase = definitions ? '#/definitions/' : (schemas ? '#/components/schemas/' : '#/definitions/');
                              }
                            }
                            node.$ref = chosenBase + fixed;
                            if (!allKeys.has(fixed)) missing.add(fixed);
                          }
                        }
                        for (const key of Object.keys(node)) walk(node[key]);
                      };
                      walk(obj);
                      if (missing.size) for (const name of missing) for (const { map } of containers) if (!map[name]) map[name] = { type: 'object', description: 'Auto-generated placeholder for unresolved schema' };
                    }
                  } catch {}
                  return ori(spec);
                }
                ,
                setSpec: (ori: any) => (spec: any) => {
                  try {
                    const containers: Array<{ map: any, base: string }> = [];
                    const schemas = spec && spec.components && spec.components.schemas;
                    const definitions = spec && spec.definitions;
                    if (schemas && typeof schemas === 'object') containers.push({ map: schemas, base: '#/components/schemas/' });
                    if (definitions && typeof definitions === 'object') containers.push({ map: definitions, base: '#/definitions/' });
                    for (const { map } of containers) {
                      const keys = Object.keys(map);
                      for (const k of keys) {
                        const variants = new Set<string>();
                        variants.add(k.replace(/\+/g, '.'));
                        variants.add(k.replace(/\./g, '+'));
                        variants.add(k.replace(/\+/g, '_'));
                        variants.add(k.replace(/\./g, '_'));
                        // Also toggle only the last separator between the last two segments
                        const idxDot = k.lastIndexOf('.');
                        if (idxDot >= 0) variants.add(k.slice(0, idxDot) + '+' + k.slice(idxDot + 1));
                        const idxPlus = k.lastIndexOf('+');
                        if (idxPlus >= 0) variants.add(k.slice(0, idxPlus) + '.' + k.slice(idxPlus + 1));
                        for (const v of variants) if (v && v !== k && !map[v]) map[v] = map[k];
                      }
                    }
                  } catch {}
                  return ori(spec);
                }
              }
            }
          }
        });
        // Helper to alias schema keys and rewrite $ref values in an already parsed spec (OAS3 components.schemas and OAS2 definitions)
        const aliasAndRewrite = (root: any) => {
          try {
            const enableDebug = (() => { try { return localStorage.getItem('swagger:debug') === '1'; } catch { return false; } })();
            const containers: Array<{ map: any, base: string }> = [];
            const schemas = root && root.components && root.components.schemas;
            const definitions = root && root.definitions;
            if (schemas && typeof schemas === 'object') containers.push({ map: schemas, base: '#/components/schemas/' });
            if (definitions && typeof definitions === 'object') containers.push({ map: definitions, base: '#/definitions/' });

            if (containers.length) {
              // Debug: dump container presence, key counts, and targeted keys before aliasing
              if (enableDebug) {
                try {
                  const schemaKeys = schemas && typeof schemas === 'object' ? Object.keys(schemas) : [];
                  const definitionKeys = definitions && typeof definitions === 'object' ? Object.keys(definitions) : [];
                  const keysContainingLogin = [...schemaKeys, ...definitionKeys].filter(k => /LoginResponse/i.test(k));
                  console.debug('[Swagger][alias] containers:', {
                    hasSchemas: !!schemas,
                    hasDefinitions: !!definitions,
                    schemaCount: schemaKeys.length,
                    definitionCount: definitionKeys.length,
                    keysContainingLogin,
                  });
                } catch { /* noop */ }
              }

              // Debug: pre-scan $refs before any rewrite
              let preRefs: string[] = [];
              if (enableDebug) {
                try {
                  const collect = (node: any) => {
                    if (!node || typeof node !== 'object') return;
                    if (typeof (node as any).$ref === 'string') preRefs.push((node as any).$ref);
                    for (const k of Object.keys(node)) collect((node as any)[k]);
                  };
                  collect(root);
                  const refsContainingLogin = preRefs.filter(r => /LoginResponse|Nhi\.Healfy/i.test(r));
                  console.debug('[Swagger][$ref] pre-rewrite refs (subset):', refsContainingLogin);
                } catch { /* noop */ }
              }

              // Alias keys in each container (including last-separator toggles)
              for (const { map } of containers) {
                const keys = Object.keys(map);
                for (const k of keys) {
                  const variants = new Set<string>();
                  variants.add(k.replace(/\+/g, '.'));
                  variants.add(k.replace(/\./g, '+'));
                  variants.add(k.replace(/\+/g, '_'));
                  variants.add(k.replace(/\./g, '_'));
                  const idxDot = k.lastIndexOf('.');
                  if (idxDot >= 0) variants.add(k.slice(0, idxDot) + '+' + k.slice(idxDot + 1));
                  const idxPlus = k.lastIndexOf('+');
                  if (idxPlus >= 0) variants.add(k.slice(0, idxPlus) + '.' + k.slice(idxPlus + 1));
                  for (const v of variants) if (v && v !== k && !map[v]) map[v] = map[k];
                }
              }
              // Build a global key set and key->base locator
              const allKeys = new Set<string>();
              const locator = new Map<string, string>();
              for (const { map, base } of containers) for (const k of Object.keys(map)) { allKeys.add(k); if (!locator.has(k)) locator.set(k, base); }
              // Build suffix map (last segment after '.') and helpers
              const suffixMap = new Map<string, string[]>();
              const getSuffix = (name: string) => {
                const norm = name.replace(/\+/g, '.');
                const idx = norm.lastIndexOf('.');
                return idx >= 0 ? norm.slice(idx + 1) : norm;
              };
              const getNormPrefix = (name: string) => {
                const norm = name.replace(/\+/g, '.');
                const idx = norm.lastIndexOf('.');
                return idx >= 0 ? norm.slice(0, idx) : '';
              };
              for (const key of allKeys) {
                const sfx = getSuffix(key);
                const arr = suffixMap.get(sfx) || [];
                arr.push(key);
                suffixMap.set(sfx, arr);
              }
              const pick = (name: string): { key: string, base?: string } => {
                if (allKeys.has(name)) return { key: name, base: locator.get(name) };
                const idxDot = name.lastIndexOf('.');
                const lastDotToPlus = idxDot >= 0 ? name.slice(0, idxDot) + '+' + name.slice(idxDot + 1) : name;
                const idxPlus = name.lastIndexOf('+');
                const lastPlusToDot = idxPlus >= 0 ? name.slice(0, idxPlus) + '.' + name.slice(idxPlus + 1) : name;
                const alts = [
                  name.replace(/\+/g, '.'),
                  name.replace(/\./g, '+'),
                  name.replace(/\+/g, '_'),
                  name.replace(/\./g, '_'),
                  lastDotToPlus,
                  lastPlusToDot,
                ];
                for (const a of alts) if (allKeys.has(a)) return { key: a, base: locator.get(a) };
                const sfx = getSuffix(name);
                const matches = suffixMap.get(sfx) || [];
                if (matches.length === 1) return { key: matches[0], base: locator.get(matches[0]) };
                if (matches.length > 1) {
                  const wantPrefix = getNormPrefix(name);
                  let best: string | null = null;
                  let bestScore = -1;
                  for (const m of matches) {
                    const p = getNormPrefix(m);
                    let score = 0;
                    if (p === wantPrefix) score = 1e6; else {
                      const pa = p.split('.');
                      const wa = wantPrefix.split('.');
                      let i = pa.length - 1, j = wa.length - 1, cnt = 0;
                      while (i >= 0 && j >= 0 && pa[i] === wa[j]) { cnt++; i--; j--; }
                      score = cnt;
                    }
                    if (score > bestScore) { bestScore = score; best = m; }
                  }
                  if (best) return { key: best, base: locator.get(best) };
                }
                return { key: name };
              };
              const missing = new Set<string>();
              const walk = (node: any) => {
                if (!node || typeof node !== 'object') return;
                if (typeof node.$ref === 'string') {
                  const mComp = node.$ref.match(/^#\/components\/schemas\/(.+)$/);
                  const mDef = !mComp && node.$ref.match(/^#\/definitions\/(.+)$/);
                  const target = mComp ? mComp[1] : (mDef ? mDef[1] : null);
                  if (target) {
                    const { key: fixed, base } = pick(target);
                    // Prefer '.' variants if original ref contains '+' and a dot-alias exists
                    let chosenKey = fixed;
                    if (/\+/.test(target)) {
                      const dotAll = target.replace(/\+/g, '.');
                      if (allKeys.has(dotAll)) {
                        chosenKey = dotAll;
                      } else {
                        const idxPlus2 = target.lastIndexOf('+');
                        if (idxPlus2 >= 0) {
                          const lastDotVariant = target.slice(0, idxPlus2) + '.' + target.slice(idxPlus2 + 1);
                          if (allKeys.has(lastDotVariant)) chosenKey = lastDotVariant;
                        }
                      }
                    }
                    let chosenBase = base as string | undefined;
                    if (!chosenBase) {
                      if (mComp) {
                        chosenBase = schemas ? '#/components/schemas/' : (definitions ? '#/definitions/' : '#/components/schemas/');
                      } else {
                        chosenBase = definitions ? '#/definitions/' : (schemas ? '#/components/schemas/' : '#/definitions/');
                      }
                    }
                    const before = node.$ref;
                    node.$ref = chosenBase + chosenKey;
                    if (enableDebug && /[+.]/.test(before) && /Nhi\.Healfy/.test(before)) {
                      try { console.debug('[Swagger][$ref] rewrite:', before, '->', node.$ref); } catch {}
                    }
                    if (!allKeys.has(chosenKey)) missing.add(chosenKey);
                  }
                }
                for (const key of Object.keys(node)) walk(node[key]);
              };
              walk(root);
              if (missing.size) {
                if (enableDebug) { try { console.debug('[Swagger][$ref] missing placeholders:', Array.from(missing)); } catch {} }
                for (const name of missing) {
                  for (const { map } of containers) if (!map[name]) map[name] = { type: 'object', description: 'Auto-generated placeholder for unresolved schema' };
                }
              }
            }
          } catch {}
          return root;
        };
        // Note: fetch-level URL-lowercasing plugin removed per user preference.
        // Try to pre-fetch the spec and fix it before Swagger parses it
        const fetchAndTransformSpec = async () => {
          try {
            // Prefetch regardless of origin; only attach Authorization for same-origin
            let sameOrigin = false;
            try { const u = new URL(openApiUrl, window.location.origin); sameOrigin = (u.origin === window.location.origin); } catch {}
            const headers: Record<string, string> = {};
            if (sameOrigin) {
              const token = localStorage.getItem('token');
              if (token) headers['Authorization'] = `Bearer ${token}`;
            }
            const r = await fetch(openApiUrl, { headers, mode: 'cors' });
            const txt = await r.text();
            if (txt) {
              const trimmed = txt.trim();
              if (trimmed.startsWith('{')) {
                const json = JSON.parse(trimmed);
                const fixed = aliasAndRewrite(json);
                fixed['x-schema-alias-applied'] = true;
                return fixed;
              } else {
                // Try YAML
                try {
                  await ensureYaml();
                  const y = (window as any).jsyaml?.load?.(txt);
                  if (y && typeof y === 'object') {
                    const fixed = aliasAndRewrite(y);
                    fixed['x-schema-alias-applied'] = true;
                    return fixed;
                  }
                } catch {}
              }
            }
          } catch {}
          return null;
        };
        // Prefetch normalized JSON spec client-side (same-origin only), then feed as `spec`.
        const preSpec = await fetchAndTransformSpec();
        const loadUrl = openApiUrl;
        const ui = window.SwaggerUIBundle({
          // Prefer pre-fetched normalized spec to avoid resolver errors; fall back to URL
          ...(preSpec ? { spec: preSpec } : { url: loadUrl }),
          domNode: containerRef.current,
          docExpansion: 'none',
          defaultModelsExpandDepth: -1,
          displayRequestDuration: true,
          showExtensions: true,
          tryItOutEnabled: true,
          persistAuthorization: true,
          syntaxHighlight: {
            activate: true,
          },
          onComplete: () => {
            // Post-load: transform spec in-memory to guarantee resolution regardless of transport
            try {
              const sys = (ui && ui.getSystem) ? ui.getSystem() : undefined;
              const current = sys?.specSelectors?.specJson?.();
              const toJs = current && typeof current.toJS === 'function' ? current.toJS() : current;
              if (toJs && !toJs['x-schema-alias-applied']) {
                const fixed = aliasAndRewrite(toJs);
                fixed['x-schema-alias-applied'] = true;
                sys?.specActions?.updateJsonSpec?.(fixed);
              }
              // Ensure Auth UI and Servers are available:
              // - If spec lacks securitySchemes, inject a default bearer scheme (Swagger-only)
              // - If spec lacks servers (OAS3) or host/schemes (OAS2), inject defaults from current origin
              try {
                let hasServers = !!(toJs && (toJs.servers?.length || toJs.host || toJs.basePath));
                let hasSec = !!(toJs && (toJs.components?.securitySchemes || toJs.securityDefinitions));
                if (tweaks.injectDefaultSecurity && toJs && !hasSec) {
                  toJs.components = toJs.components || {};
                  toJs.components.securitySchemes = toJs.components.securitySchemes || {
                    bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
                  };
                  toJs.security = toJs.security || [{ bearerAuth: [] }];
                  hasSec = true;
                }
                if (tweaks.injectDefaultServers && toJs && !hasServers) {
                  try {
                    const here = new URL(window.location.href);
                    if (toJs.openapi) {
                      // OAS3
                      toJs.servers = toJs.servers || [
                        { url: `${here.origin}` }
                      ];
                    } else if (toJs.swagger) {
                      // OAS2
                      toJs.schemes = toJs.schemes || [here.protocol.replace(':','')];
                      toJs.host = toJs.host || here.host;
                      toJs.basePath = toJs.basePath || '';
                    }
                    hasServers = true;
                  } catch {}
                }
                if (!toJs['x-swagger-ui-meta-applied']) {
                  toJs['x-swagger-ui-meta-applied'] = true;
                  sys?.specActions?.updateJsonSpec?.(toJs);
                }
                if (tweaks.forceShowBar) {
                  const root = containerRef.current as HTMLElement | null;
                  if (root) {
                    const sel = '.swagger-ui .scheme-container, .swagger-ui .schemes-wrapper, .swagger-ui .schemes.wrapper, .swagger-ui .servers';
                    const bar = root.querySelector(sel) as HTMLElement | null;
                    if (bar) {
                      bar.style.display = 'flex';
                      (bar.style as any).visibility = 'visible';
                      bar.style.opacity = '1';
                    }
                    const auth = root.querySelector('.swagger-ui .auth-wrapper') as HTMLElement | null;
                    if (auth) {
                      auth.style.display = 'block';
                      (auth.style as any).visibility = 'visible';
                      auth.style.opacity = '1';
                    }
                    // Keep DOM pristine; rely on scoped CSS for label sizing and alignment
                    // Collapse empty info wrappers that create stray gaps above the bar
                    try {
                      const wrappers = root.querySelectorAll('.swagger-ui .information-container.wrapper, .swagger-ui .information-container .wrapper');
                      wrappers.forEach((node) => {
                        const el = node as HTMLElement;
                        const hasServers = !!el.querySelector('.servers');
                        const hasAuth = !!el.querySelector('.auth-wrapper');
                        if (!hasServers && !hasAuth && el.children.length === 0) {
                          el.style.display = 'none';
                          el.style.margin = '0';
                          el.style.padding = '0';
                        } else if (hasServers || hasAuth) {
                          el.style.padding = '0 16px';
                          el.style.margin = '0 0 12px 0';
                        }
                      });
                    } catch {}
                  }
                }
              } catch {}
            } catch {}
          },
          requestInterceptor: (req: any) => {
            try {
              // Determine if this is the spec fetch (for token injection policy only)
              let isSpecFetchOverall = false;
              let isSameOrigin = false;
              if (req && typeof req.url === 'string') {
                try {
                  const u = new URL(req.url, window.location.origin);
                  isSameOrigin = u.origin === window.location.origin;
                  let isSpecFetch = /\.(yaml|yml|json)$/i.test(u.pathname);
                  try {
                    const specUrl = new URL(loadUrl, window.location.origin);
                    const specPath = specUrl.pathname;
                    const specDirPath = specPath.endsWith('/') ? specPath : specPath.replace(/[^/]+$/, '');
                    if (u.pathname === specPath) isSpecFetch = true;
                    if (!isSpecFetch && u.pathname.startsWith(specDirPath) && /\.(yaml|yml|json)$/i.test(u.pathname)) {
                      isSpecFetch = true; // external $refs near the spec
                    }
                  } catch {}
                  isSpecFetchOverall = isSpecFetch;
                } catch {
                  // If URL ctor fails (e.g., swagger passes path only), attempt lightweight detection
                  const m = req.url.match(/^(https?:\/\/[^/]+)?([^?#]*)(.*)$/i);
                  if (m) {
                    const prefix = m[1] || '';
                    const pathOnly = (m[2] || '');
                    if (!prefix) {
                      isSameOrigin = true;
                    } else {
                      try {
                        const originCandidate = new URL(prefix + '/', window.location.origin).origin;
                        isSameOrigin = originCandidate === window.location.origin;
                      } catch {}
                    }
                    let isSpecFetch = /\.(yaml|yml|json)$/i.test(pathOnly);
                    try {
                      const specUrl = new URL(loadUrl, window.location.origin);
                      const specPath = specUrl.pathname;
                      const specDirPath = specPath.endsWith('/') ? specPath : specPath.replace(/[^/]+$/, '');
                      if (pathOnly === specPath) isSpecFetch = true;
                      if (!isSpecFetch && pathOnly.startsWith(specDirPath) && /\.(yaml|yml|json)$/i.test(pathOnly)) {
                        isSpecFetch = true;
                      }
                    } catch {}
                    isSpecFetchOverall = isSpecFetch;
                  }
                }
              }
              // Inject bearer token for non-spec API calls; for spec/$ref only when same-origin
              if (!isSpecFetchOverall || isSameOrigin) {
                const token = localStorage.getItem('token');
                if (token) {
                  req.headers = req.headers || {};
                  req.headers['Authorization'] = `Bearer ${token}`;
                }
              }
            } catch {}
            return req;
          },
          // Fix-up spec responses where component schema names use '.' but $ref uses '+' (or vice-versa).
          // We alias schema keys to include both variants to improve client-side $ref resolution.
          responseInterceptor: (res: any) => {
            try {
              const bodyText = (res.text ?? res.data ?? '').toString();
              // Transform the primary spec AND any adjacent JSON files (external $refs) under the same directory
              let isSpecRelated = (() => {
                try {
                  const u = new URL(res.url || '', window.location.origin);
                  const specUrl = new URL(loadUrl, window.location.origin);
                  const specPath = specUrl.pathname;
                  const specDirPath = specPath.endsWith('/') ? specPath : specPath.replace(/[^/]+$/, '');
                  if (u.pathname === specPath) return true;
                  if (u.pathname.startsWith(specDirPath) && /\.(yaml|yml|json)$/i.test(u.pathname)) return true;
                  return false;
                } catch { return false; }
              })();
              // Broaden detection: if the response parses into an OpenAPI-like object,
              // treat it as spec-related regardless of URL location.
              if (!isSpecRelated && bodyText) {
                const trimmedSniff = bodyText.trim();
                if (trimmedSniff.startsWith('{')) {
                  try {
                    const obj = JSON.parse(trimmedSniff);
                    if (obj && typeof obj === 'object' && (obj.openapi || obj.swagger || obj.paths || obj.components || obj.definitions)) {
                      isSpecRelated = true;
                    }
                  } catch { /* noop */ }
                } else if (/(\n|^)\s*(openapi:|swagger:|info:|paths:|components:|definitions:)/i.test(bodyText)) {
                  isSpecRelated = true;
                }
              }
              if (isSpecRelated && bodyText) {
                const trimmed = bodyText.trim();
                if (trimmed.startsWith('{')) {
                  try {
                    const spec = JSON.parse(trimmed);
                    const fixedObj = aliasAndRewrite(spec);
                    const fixed = JSON.stringify(fixedObj);
                    res.text = fixed;
                    res.data = fixed;
                  } catch { /* ignore parse errors */ }
                } else if (/(\n|^)\s*(openapi:|swagger:|info:|paths:|components:|definitions:)/i.test(bodyText)) {
                  // Likely YAML: attempt parse -> normalize -> return JSON text
                  try {
                    const y = (window as any).jsyaml?.load?.(bodyText);
                    if (y && typeof y === 'object') {
                      const fixedObj = aliasAndRewrite(y);
                      const fixed = JSON.stringify(fixedObj);
                      res.text = fixed;
                      res.data = fixed;
                    }
                  } catch { /* ignore */ }
                }
              }
            } catch { /* no-op */ }
            return res;
          },
          plugins: [schemaAliasPlugin],
        });
        // Keep reference if needed for future cleanup
        (containerRef.current as any).__swaggerUI__ = ui;
      } catch (e) {
        console.error(e);
      }
    };
    init();
    return () => { cancelled = true; };
  }, [openApiUrl]);

  return (
    <div className={`api-doc-root swagger-doc${tweaks.hideInfoSubsections ? ' tweaks-hide-info' : ''}${tweaks.removeHeaderBorder ? ' tweaks-no-border' : ''}`}>
      <div ref={containerRef} />
    </div>
  );
}
