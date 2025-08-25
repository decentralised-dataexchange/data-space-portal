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
};

export default function SwaggerDoc({ openApiUrl }: SwaggerDocProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const specLoadingRef = useRef<boolean>(true);

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

    const init = async () => {
      try {
        await ensureScript();
        if (cancelled || !containerRef.current || !window.SwaggerUIBundle) return;
        // Clear previous instance
        containerRef.current.innerHTML = '';
        specLoadingRef.current = true;
        // Plugin to alias schema names in the parsed spec (works for JSON or YAML sources)
        const schemaAliasPlugin = () => ({
          statePlugins: {
            spec: {
              wrapActions: {
                updateJsonSpec: (ori: any) => (spec: any) => {
                  try {
                    const schemas = spec && spec.components && spec.components.schemas;
                    if (schemas && typeof schemas === 'object') {
                      const keys = Object.keys(schemas);
                      try { console.debug('[Swagger] updateJsonSpec: schema keys =', keys.length); } catch {}
                      for (const k of keys) {
                        const variants = new Set<string>();
                        variants.add(k.replace(/\+/g, '.'));
                        variants.add(k.replace(/\./g, '+'));
                        variants.add(k.replace(/\+/g, '_'));
                        variants.add(k.replace(/\./g, '_'));
                        for (const v of variants) {
                          if (v && v !== k && !schemas[v]) {
                            schemas[v] = schemas[k];
                          }
                        }
                      }
                      // After aliasing schema keys, rewrite $ref values that point to non-existent keys
                      const schemaKeys = new Set(Object.keys(schemas));
                      const pickExistingKey = (name: string) => {
                        if (schemaKeys.has(name)) return name;
                        const alts = [
                          name.replace(/\+/g, '.'),
                          name.replace(/\./g, '+'),
                          name.replace(/\+/g, '_'),
                          name.replace(/\./g, '_'),
                        ];
                        for (const a of alts) if (schemaKeys.has(a)) return a;
                        return name; // no change
                      };
                      const missing = new Set<string>();
                      const walk = (node: any) => {
                        if (!node || typeof node !== 'object') return;
                        if (typeof node.$ref === 'string') {
                          const m = node.$ref.match(/^#\/components\/schemas\/(.+)$/);
                          if (m) {
                            const fixed = pickExistingKey(m[1]);
                            node.$ref = `#/components/schemas/${fixed}`;
                            if (!schemaKeys.has(fixed)) missing.add(fixed);
                          }
                        }
                        for (const key of Object.keys(node)) walk(node[key]);
                      };
                      walk(spec);
                      if (missing.size) {
                        for (const name of missing) {
                          if (!schemas[name]) {
                            schemas[name] = { type: 'object', description: 'Auto-generated placeholder for unresolved schema' };
                          }
                        }
                      }
                    }
                  } catch {}
                  return ori(spec);
                }
                ,
                updateSpec: (ori: any) => (spec: any) => {
                  try {
                    // spec here may be a JS object already
                    const obj = typeof spec === 'string' ? null : spec;
                    if (obj && obj.components && obj.components.schemas) {
                      const schemas = obj.components.schemas;
                      const keys = Object.keys(schemas);
                      try { console.debug('[Swagger] updateSpec: schema keys =', keys.length); } catch {}
                      for (const k of keys) {
                        const variants = new Set<string>();
                        variants.add(k.replace(/\+/g, '.'));
                        variants.add(k.replace(/\./g, '+'));
                        variants.add(k.replace(/\+/g, '_'));
                        variants.add(k.replace(/\./g, '_'));
                        for (const v of variants) if (v && v !== k && !schemas[v]) schemas[v] = schemas[k];
                      }
                      const schemaKeys = new Set(Object.keys(schemas));
                      const pick = (name: string) => {
                        if (schemaKeys.has(name)) return name;
                        const alts = [name.replace(/\+/g, '.'), name.replace(/\./g, '+'), name.replace(/\+/g, '_'), name.replace(/\./g, '_')];
                        for (const a of alts) if (schemaKeys.has(a)) return a;
                        return name;
                      };
                      const missing = new Set<string>();
                      const walk = (node: any) => {
                        if (!node || typeof node !== 'object') return;
                        if (typeof node.$ref === 'string') {
                          const m = node.$ref.match(/^#\/components\/schemas\/(.+)$/);
                          if (m) {
                            const fixed = pick(m[1]);
                            node.$ref = `#/components/schemas/${fixed}`;
                            if (!schemaKeys.has(fixed)) missing.add(fixed);
                          }
                        }
                        for (const key of Object.keys(node)) walk(node[key]);
                      };
                      walk(obj);
                      if (missing.size) {
                        for (const name of missing) {
                          if (!schemas[name]) {
                            schemas[name] = { type: 'object', description: 'Auto-generated placeholder for unresolved schema' };
                          }
                        }
                      }
                    }
                  } catch {}
                  return ori(spec);
                }
                ,
                setSpec: (ori: any) => (spec: any) => {
                  try {
                    if (spec && spec.components && spec.components.schemas) {
                      const schemas = spec.components.schemas;
                      const keys = Object.keys(schemas);
                      try { console.debug('[Swagger] setSpec: schema keys =', keys.length); } catch {}
                      for (const k of keys) {
                        const variants = new Set<string>();
                        variants.add(k.replace(/\+/g, '.'));
                        variants.add(k.replace(/\./g, '+'));
                        variants.add(k.replace(/\+/g, '_'));
                        variants.add(k.replace(/\./g, '_'));
                        for (const v of variants) if (v && v !== k && !schemas[v]) schemas[v] = schemas[k];
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
            const containers: Array<{ map: any, base: string }> = [];
            const schemas = root && root.components && root.components.schemas;
            const definitions = root && root.definitions;
            if (schemas && typeof schemas === 'object') containers.push({ map: schemas, base: '#/components/schemas/' });
            if (definitions && typeof definitions === 'object') containers.push({ map: definitions, base: '#/definitions/' });

            if (containers.length) {
              // Alias keys in each container
              for (const { map } of containers) {
                const keys = Object.keys(map);
                for (const k of keys) {
                  const variants = new Set<string>();
                  variants.add(k.replace(/\+/g, '.'));
                  variants.add(k.replace(/\./g, '+'));
                  variants.add(k.replace(/\+/g, '_'));
                  variants.add(k.replace(/\./g, '_'));
                  for (const v of variants) if (v && v !== k && !map[v]) map[v] = map[k];
                }
              }
              // Build a global key set
              const allKeys = new Set<string>();
              for (const { map } of containers) for (const k of Object.keys(map)) allKeys.add(k);
              // Also build suffix map (last segment after '.' or '+') for best-effort alias
              const suffixMap = new Map<string, string[]>();
              const getSuffix = (name: string) => {
                const norm = name.replace(/\+/g, '.');
                const idx = norm.lastIndexOf('.');
                return idx >= 0 ? norm.slice(idx + 1) : norm;
              };
              for (const key of allKeys) {
                const sfx = getSuffix(key);
                const arr = suffixMap.get(sfx) || [];
                arr.push(key);
                suffixMap.set(sfx, arr);
              }
              const pick = (name: string) => {
                if (allKeys.has(name)) return name;
                const alts = [name.replace(/\+/g, '.'), name.replace(/\./g, '+'), name.replace(/\+/g, '_'), name.replace(/\./g, '_')];
                for (const a of alts) if (allKeys.has(a)) return a;
                // Try suffix match if unique
                const sfx = getSuffix(name);
                const matches = suffixMap.get(sfx) || [];
                if (matches.length === 1) return matches[0];
                return name;
              };
              const missing = new Set<string>();
              const walk = (node: any) => {
                if (!node || typeof node !== 'object') return;
                if (typeof node.$ref === 'string') {
                  const mComp = node.$ref.match(/^#\/components\/schemas\/(.+)$/);
                  const mDef = !mComp && node.$ref.match(/^#\/definitions\/(.+)$/);
                  const target = mComp ? mComp[1] : (mDef ? mDef[1] : null);
                  if (target) {
                    const fixed = pick(target);
                    node.$ref = (mComp ? '#/components/schemas/' : '#/definitions/') + fixed;
                    if (!allKeys.has(fixed)) missing.add(fixed);
                  }
                }
                for (const key of Object.keys(node)) walk(node[key]);
              };
              walk(root);
              if (missing.size) {
                for (const name of missing) {
                  for (const { map } of containers) if (!map[name]) map[name] = { type: 'object', description: 'Auto-generated placeholder for unresolved schema' };
                }
              }
            }
          } catch {}
          return root;
        };
        // Try to pre-fetch the spec and fix it before Swagger parses it
        const fetchAndTransformSpec = async () => {
          try {
            // Only prefetch when same-origin to avoid CORS/preflight issues
            let sameOrigin = false;
            try { const u = new URL(openApiUrl, window.location.origin); sameOrigin = (u.origin === window.location.origin); } catch {}
            if (!sameOrigin) return null;
            const headers: Record<string, string> = {};
            const token = localStorage.getItem('token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const r = await fetch(openApiUrl, { headers });
            const txt = await r.text();
            if (txt && txt.trim().startsWith('{')) {
              const json = JSON.parse(txt);
              const fixed = aliasAndRewrite(json);
              fixed['x-schema-alias-applied'] = true;
              return fixed;
            }
          } catch {}
          return null;
        };
        // Prefetch normalized JSON spec via server proxy, then feed as `spec`.
        const preSpec = await (async () => {
          try {
            const proxied = `/api/openapi-lower?target=${encodeURIComponent(openApiUrl)}&_ts=${Date.now()}`;
            const token = localStorage.getItem('token') || '';
            const r = await fetch(proxied, {
              headers: {
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              }
            });
            const txt = await r.text();
            if (txt && txt.trim().startsWith('{')) return JSON.parse(txt);
          } catch {}
          return null;
        })();
        try { (window as any).__openapi_preSpec = preSpec; } catch {}
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
          syntaxHighlight: {
            activate: true,
          },
          onComplete: () => {
            // Mark spec + $ref resolution as finished; enable lowercase for API calls only
            specLoadingRef.current = false;
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
            } catch {}
          },
          requestInterceptor: (req: any) => {
            try {
              // Determine if this is the spec fetch; if so, avoid mutating headers/url
              let isSpecFetchOverall = false;
              let isSameOrigin = false;
              if (req && typeof req.url === 'string') {
                try {
                  const u = new URL(req.url, window.location.origin);
                  isSameOrigin = u.origin === window.location.origin;
                  // Do NOT lowercase when Swagger UI is fetching the spec itself.
                  // Skip for common spec file extensions and also when the pathname
                  // matches our provided openApiUrl exactly (supports routes without extensions).
                  let isSpecFetch = /\.(yaml|yml|json)$/i.test(u.pathname);
                  try {
                    const specUrl = new URL(loadUrl, window.location.origin);
                    const specPath = specUrl.pathname;
                    const specDirPath = specPath.endsWith('/') ? specPath : specPath.replace(/[^/]+$/, '');
                    if (u.pathname === specPath) isSpecFetch = true;
                    // Also treat adjacent YAML/JSON files next to the spec as spec-related (external $refs)
                    if (!isSpecFetch && u.pathname.startsWith(specDirPath) && /\.(yaml|yml|json)$/i.test(u.pathname)) {
                      isSpecFetch = true;
                    }
                  } catch {}
                  isSpecFetchOverall = isSpecFetch;
                  // Also skip lowercasing during initial spec and $ref resolution phase
                  if (!isSpecFetch && !specLoadingRef.current) {
                    u.pathname = u.pathname.toLowerCase();
                    req.url = u.toString();
                  }
                } catch {
                  // If URL ctor fails (e.g., swagger passes path only), fallback
                  const m = req.url.match(/^(https?:\/\/[^/]+)?([^?#]*)(.*)$/i);
                  if (m) {
                    const prefix = m[1] || '';
                    const pathOnly = (m[2] || '');
                    // Relative path => same-origin; absolute => compare host
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
                    const path = (isSpecFetch || specLoadingRef.current) ? pathOnly : pathOnly.toLowerCase();
                    const suffix = m[3] || '';
                    req.url = `${prefix}${path}${suffix}`;
                  }
                }
              }
              // Route spec-related fetches (main doc and external $refs) through our proxy so they arrive as normalized JSON
              try {
                if (isSpecFetchOverall && req && typeof req.url === 'string' && !/\/api\/openapi-lower\b/.test(req.url)) {
                  const original = req.url;
                  req.url = `/api/openapi-lower?target=${encodeURIComponent(original)}`;
                }
              } catch {}
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
              const isSpecRelated = (() => {
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
              if (isSpecRelated && bodyText && bodyText.trim().startsWith('{')) {
                try {
                  const spec = JSON.parse(bodyText);
                  const fixedObj = aliasAndRewrite(spec);
                  const fixed = JSON.stringify(fixedObj);
                  res.text = fixed;
                  res.data = fixed;
                } catch { /* ignore parse errors */ }
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
    <div className="api-doc-root swagger-doc">
      <div ref={containerRef} />
    </div>
  );
}
