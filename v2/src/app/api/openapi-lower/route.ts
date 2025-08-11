import YAML from 'yaml'

function lowerOutsideBraces(s: string): string {
  let out = ''
  let depth = 0
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '{') { depth++; out += ch; continue }
    if (ch === '}') { depth = Math.max(0, depth - 1); out += ch; continue }
    out += depth === 0 ? ch.toLowerCase() : ch
  }
  return out
}

function normalizeServer(s: any): any {
  if (!s || typeof s !== 'object') return s
  const out: any = { ...s }
  if (typeof out.url === 'string') out.url = lowerPathInUrl(out.url)
  if (out.variables && typeof out.variables === 'object') {
    const vars: Record<string, any> = {}
    for (const [k, v] of Object.entries<any>(out.variables)) {
      if (v && typeof v === 'object') {
        const nv: any = { ...v }
        if (typeof nv.default === 'string') nv.default = lowerOutsideBraces(nv.default)
        if (Array.isArray(nv.enum)) nv.enum = nv.enum.map((ev: any) => (typeof ev === 'string' ? lowerOutsideBraces(ev) : ev))
        vars[k] = nv
      } else {
        vars[k] = v
      }
    }
    out.variables = vars
  }
  return out
}

function lowerPathInUrl(u: string): string {
  try {
    if (/^https?:\/\//i.test(u)) {
      const url = new URL(u)
      url.pathname = url.pathname.toLowerCase()
      try { url.hostname = url.hostname.toLowerCase() } catch {}
      try { url.protocol = url.protocol.toLowerCase() } catch {}
      return url.toString()
    }
    const m = u.match(/^(https?:\/\/)([^/]+)?([^?#]*)(.*)$/i)
    if (m) {
      const scheme = m[1] || ''
      const host = lowerOutsideBraces(m[2] || '')
      const path = lowerOutsideBraces(m[3] || '')
      const suffix = m[4] || ''
      return `${scheme}${host}${path}${suffix}`
    }
    return u
  } catch {
    return u
  }
}

function lowercaseSpec(input: any): any {
  if (!input || typeof input !== 'object') return input
  const data: any = input

  // OAS2 adjustments
  if (typeof data.basePath === 'string') data.basePath = data.basePath.toLowerCase()
  if (typeof data.host === 'string') data.host = data.host.toLowerCase()
  if (Array.isArray(data.schemes)) data.schemes = data.schemes.map((s: any) => (typeof s === 'string' ? s.toLowerCase() : s))

  // OAS3 servers
  if (Array.isArray(data.servers)) {
    data.servers = data.servers.map((s: any) => normalizeServer(s))
  }

  const httpMethods = ['get','put','post','delete','patch','head','options','trace']

  // paths keys + servers at path and operation levels
  if (data.paths && typeof data.paths === 'object') {
    const lowerPaths: Record<string, any> = {}
    for (const [p, value] of Object.entries<any>(data.paths)) {
      const lower = String(p).toLowerCase()
      const v: any = { ...value }
      if (Array.isArray(v.servers)) v.servers = v.servers.map((s: any) => normalizeServer(s))
      for (const m of httpMethods) {
        if (v[m] && Array.isArray(v[m].servers)) v[m].servers = v[m].servers.map((s: any) => normalizeServer(s))
      }
      if (!(lower in lowerPaths)) lowerPaths[lower] = v
    }
    data.paths = lowerPaths
  }

  // webhooks keys (OAS 3.1) + servers at path and operation levels
  if (data.webhooks && typeof data.webhooks === 'object') {
    const lowerHooks: Record<string, any> = {}
    for (const [p, value] of Object.entries<any>(data.webhooks)) {
      const lower = String(p).toLowerCase()
      const v: any = { ...value }
      if (Array.isArray(v.servers)) v.servers = v.servers.map((s: any) => normalizeServer(s))
      for (const m of httpMethods) {
        if (v[m] && Array.isArray(v[m].servers)) v[m].servers = v[m].servers.map((s: any) => normalizeServer(s))
      }
      if (!(lower in lowerHooks)) lowerHooks[lower] = v
    }
    data.webhooks = lowerHooks
  }

  // Azure x-ms-paths -> merge into paths with lowercase keys (non-conflicting only)
  if (data['x-ms-paths'] && typeof data['x-ms-paths'] === 'object') {
    const lowered: Record<string, any> = {}
    for (const [p, value] of Object.entries<any>(data['x-ms-paths'])) {
      const lower = String(p).toLowerCase()
      const v: any = { ...value }
      if (Array.isArray(v.servers)) v.servers = v.servers.map((s: any) => normalizeServer(s))
      for (const m of httpMethods) {
        if (v[m] && Array.isArray(v[m].servers)) v[m].servers = v[m].servers.map((s: any) => normalizeServer(s))
      }
      lowered[lower] = v
    }
    if (!data.paths || typeof data.paths !== 'object') data.paths = {}
    for (const [k, v] of Object.entries<any>(lowered)) {
      if (!(k in data.paths)) data.paths[k] = v
    }
    delete data['x-ms-paths']
  }

  // Common URL fields to normalize
  const lowerUrlField = (obj: any, key: string) => {
    if (obj && typeof obj === 'object' && typeof obj[key] === 'string') {
      obj[key] = lowerPathInUrl(obj[key])
    }
  }
  if (data.externalDocs) lowerUrlField(data.externalDocs, 'url')
  if (data.info) {
    if (data.info.contact) lowerUrlField(data.info.contact, 'url')
    if (data.info.license) lowerUrlField(data.info.license, 'url')
  }
  if (Array.isArray(data.tags)) {
    for (const t of data.tags) if (t && t.externalDocs) lowerUrlField(t.externalDocs, 'url')
  }
  // OAuth2 flows URLs
  if (data.components && data.components.securitySchemes && typeof data.components.securitySchemes === 'object') {
    for (const scheme of Object.values<any>(data.components.securitySchemes)) {
      if (scheme && scheme.type === 'oauth2' && scheme.flows && typeof scheme.flows === 'object') {
        for (const flow of Object.values<any>(scheme.flows)) {
          if (flow && typeof flow === 'object') {
            lowerUrlField(flow, 'authorizationUrl')
            lowerUrlField(flow, 'tokenUrl')
            lowerUrlField(flow, 'refreshUrl')
          }
        }
      }
    }
  }

  return data
}

async function fetchJsonSpec(target: string, headers: Headers): Promise<any | null> {
  const baseHeaders: Record<string, string> = {
    Accept: 'application/json, text/yaml;q=0.9, */*;q=0.8',
  }
  const auth = headers.get('authorization')
  if (auth) baseHeaders['Authorization'] = auth

  // Try original URL first
  try {
    const res = await fetch(target, { headers: baseHeaders })
    if (!res.ok) return null
    const ct = (res.headers.get('content-type') || '').toLowerCase()
    const text = await res.text()
    if (ct.includes('application/json') || text.trim().startsWith('{')) {
      try { return JSON.parse(text) } catch { /* fallthrough */ }
    }
  } catch { /* next */ }

  // Try alternative JSON endpoints
  const tryUrls: string[] = []
  try {
    const u = new URL(target)
    const pathname = u.pathname
    if (/\.ya?ml$/i.test(pathname)) {
      u.pathname = pathname.replace(/\.ya?ml$/i, '.json')
      tryUrls.push(u.toString())
    }
    const usp = new URLSearchParams(u.search)
    usp.set('format', 'json')
    u.search = `?${usp.toString()}`
    tryUrls.push(u.toString())
  } catch {
    tryUrls.push(target.replace(/\.ya?ml($|\?)/i, '.json$1'))
    tryUrls.push(target + (target.includes('?') ? '&' : '?') + 'format=json')
  }

  for (const alt of tryUrls) {
    try {
      const r2 = await fetch(alt, { headers: baseHeaders })
      if (!r2.ok) continue
      const t2 = await r2.text()
      if (t2.trim().startsWith('{')) {
        try { return JSON.parse(t2) } catch { /* next */ }
      }
    } catch { /* next */ }
  }

  return null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const target = searchParams.get('target')
  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing target' }), { status: 400, headers: { 'content-type': 'application/json' } })
  }
  try {
    const reqHeaders = new Headers(req.headers)
    const baseHeaders: Record<string, string> = {
      Accept: 'application/json, text/yaml;q=0.9, */*;q=0.8',
    }
    const auth = reqHeaders.get('authorization')
    if (auth) baseHeaders['Authorization'] = auth

    // First try to fetch the upstream as-is. If it is YAML, pass through unchanged.
    try {
      const upstream = await fetch(target, { headers: baseHeaders })
      if (upstream.ok) {
        const ct = (upstream.headers.get('content-type') || '').toLowerCase()
        const text = await upstream.text()
        const cacheHeaders: Record<string, string> = {
          'cache-control': 'public, max-age=300, stale-while-revalidate=60',
          'vary': 'Authorization',
        }

        const isJsonLike = ct.includes('application/json') || text.trim().startsWith('{')
        let isYamlLike = ct.includes('yaml')
        if (!isYamlLike) {
          try {
            const u = new URL(target)
            isYamlLike = /\.ya?ml$/i.test(u.pathname) || text.trim().toLowerCase().startsWith('openapi:')
          } catch {
            isYamlLike = text.trim().toLowerCase().startsWith('openapi:')
          }
        }

        // If YAML or non-JSON, parse YAML, transform, and return JSON
        if (!isJsonLike && isYamlLike) {
          try {
            const parsed = YAML.parse(text)
            if (parsed && typeof parsed === 'object') {
              const lowered = lowercaseSpec(parsed)
              return new Response(JSON.stringify(lowered), {
                status: 200,
                headers: {
                  'content-type': 'application/json; charset=utf-8',
                  ...cacheHeaders,
                },
              })
            }
          } catch {
            // fall through to pass-through below
          }
          // As a last resort, pass through original YAML
          return new Response(text, {
            status: 200,
            headers: {
              'content-type': upstream.headers.get('content-type') || 'text/yaml; charset=utf-8',
              ...cacheHeaders,
            },
          })
        }

        // If JSON, apply lowercase transformation and return
        if (isJsonLike) {
          let parsed: any = null
          try { parsed = JSON.parse(text) } catch { /* pass */ }
          if (parsed) {
            const lowered = lowercaseSpec(parsed)
            return new Response(JSON.stringify(lowered), {
              status: 200,
              headers: {
                'content-type': 'application/json; charset=utf-8',
                ...cacheHeaders,
              },
            })
          }
        }

        // Unknown or unparsable content-type: pass through as-is
        return new Response(text, {
          status: 200,
          headers: {
            'content-type': upstream.headers.get('content-type') || 'application/octet-stream',
            ...cacheHeaders,
          },
        })
      }
    } catch {
      // Fall back to JSON-specific fetch below
    }

    // If direct fetch failed or didn't yield parseable JSON/YAML, try JSON variants and transform
    const parsed = await fetchJsonSpec(target, reqHeaders)
    if (!parsed) {
      return new Response(JSON.stringify({ error: 'Could not obtain OpenAPI document' }), { status: 502, headers: { 'content-type': 'application/json' } })
    }
    const lowered = lowercaseSpec(parsed)
    return new Response(JSON.stringify(lowered), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=300, stale-while-revalidate=60',
        'vary': 'Authorization',
      }
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Failed to fetch spec' }), { status: 500, headers: { 'content-type': 'application/json' } })
  }
}
