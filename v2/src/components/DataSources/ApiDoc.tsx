"use client"
import { ApiReferenceConfiguration, ApiReferenceReact } from '@scalar/api-reference-react'
import { useEffect, useState } from "react"
import '@scalar/api-reference-react/style.css'

export function ApiDoc({openApiUrl}) {
  const [auth, setAuth] = useState<Required<ApiReferenceConfiguration>['authentication']>({
    securitySchemes: {
      bearerAuth: {
        token: ""
      }
    }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token")
    if (token) {
      setAuth({
        securitySchemes: {
          bearerAuth: {
            token: token
          }
        }
      })
    }
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  // Minimal client-side transform: lowercase only path keys
  const [spec, setSpec] = useState<any>(null)
  const [useProxy, setUseProxy] = useState(true)

  useEffect(() => {
    if (useProxy) return
    let cancelled = false
    const load = async () => {
      try {
        const token = localStorage.getItem('token') || ''
        const headers: Record<string, string> = {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          Accept: 'application/json, text/yaml;q=0.9, */*;q=0.8',
        }
        const res = await fetch(openApiUrl, { headers })
        if (!res.ok) return
        const contentType = (res.headers.get('content-type') || '').toLowerCase()
        const text = await res.text()
        let data: any = null
        // Try JSON first
        if (contentType.includes('application/json') || text.trim().startsWith('{')) {
          try { data = JSON.parse(text) } catch { data = null }
        }
        // If YAML (or unknown), attempt to fetch a JSON variant using heuristics
        if (!data) {
          const tryUrls: string[] = []
          try {
            const u = new URL(openApiUrl, window.location.origin)
            const pathname = u.pathname
            if (/\.ya?ml$/i.test(pathname)) {
              u.pathname = pathname.replace(/\.ya?ml$/i, '.json')
              tryUrls.push(u.toString())
            }
            // Also try format=json toggle
            const hasQuery = u.search.length > 0
            const usp = new URLSearchParams(u.search)
            usp.set('format', 'json')
            u.search = `?${usp.toString()}`
            tryUrls.push(u.toString())
          } catch {
            // If URL parsing fails, fall back to naive replacements
            tryUrls.push(openApiUrl.replace(/\.ya?ml($|\?)/i, '.json$1'))
            tryUrls.push(openApiUrl + (openApiUrl.includes('?') ? '&' : '?') + 'format=json')
          }
          for (const alt of tryUrls) {
            try {
              const r2 = await fetch(alt, { headers })
              if (!r2.ok) continue
              const t2 = await r2.text()
              if (t2.trim().startsWith('{')) {
                data = JSON.parse(t2)
                break
              }
            } catch {
              // try next
            }
          }
        }
        // If still no data, fall back to proxy for reliability
        if (!data) {
          setUseProxy(true)
          setSpec(null)
          return
        } else {
          setUseProxy(false)
        }
        // Apply minimal, safe URL lowercasing for JSON specs
        if (data && typeof data === 'object') {
          // OAS2 basePath/host
          if (typeof (data as any).basePath === 'string') (data as any).basePath = (data as any).basePath.toLowerCase()
          if (typeof (data as any).host === 'string') (data as any).host = (data as any).host.toLowerCase()

          const lowerPathInUrl = (u: string) => {
            try {
              if (/^https?:\/\//i.test(u)) {
                const url = new URL(u)
                url.pathname = url.pathname.toLowerCase()
                return url.toString()
              }
              const m = u.match(/^(https?:\/\/[^/]+)?([^?#]*)(.*)$/i)
              if (m) {
                const prefix = m[1] || ''
                const path = (m[2] || '').toLowerCase()
                const suffix = m[3] || ''
                return `${prefix}${path}${suffix}`
              }
              return u
            } catch {
              return u
            }
          }

          // OAS3 servers
          if (Array.isArray((data as any).servers)) {
            (data as any).servers = (data as any).servers.map((s: any) => (
              s && typeof s.url === 'string' ? { ...s, url: lowerPathInUrl(s.url) } : s
            ))
          }
          // path-level and operation-level servers
          const httpMethods = ['get','put','post','delete','patch','head','options','trace']
          if ((data as any).paths && typeof (data as any).paths === 'object') {
            for (const value of Object.values<any>((data as any).paths)) {
              if (value && Array.isArray(value.servers)) {
                value.servers = value.servers.map((s: any) => (s && typeof s.url === 'string' ? { ...s, url: lowerPathInUrl(s.url) } : s))
              }
              for (const m of httpMethods) {
                if (value && value[m] && Array.isArray(value[m].servers)) {
                  value[m].servers = value[m].servers.map((s: any) => (s && typeof s.url === 'string' ? { ...s, url: lowerPathInUrl(s.url) } : s))
                }
              }
            }
          }
        }
        // Also lowercase Azure x-ms-paths keys and merge if present (non-conflicting only)
        if (data && (data as any)['x-ms-paths'] && typeof (data as any)['x-ms-paths'] === 'object') {
          const xms = (data as any)['x-ms-paths'] as Record<string, any>
          const lowered: Record<string, any> = {}
          for (const [p, v] of Object.entries<any>(xms)) {
            lowered[String(p).toLowerCase()] = v
          }
          if (!(data as any).paths || typeof (data as any).paths !== 'object') (data as any).paths = {}
          for (const [k, v] of Object.entries<any>(lowered)) {
            if (!((data as any).paths as Record<string, any>)[k]) {
              ((data as any).paths as Record<string, any>)[k] = v
            }
          }
        }
        if (data && data.paths && typeof data.paths === 'object') {
          const lowerPaths: Record<string, any> = {}
          for (const [p, v] of Object.entries<any>(data.paths)) {
            lowerPaths[String(p).toLowerCase()] = v
          }
          data.paths = lowerPaths
        }
        if (!cancelled) setSpec(data)
      } catch (e) {
        console.error('Failed to load/transform OpenAPI spec', e)
        if (!cancelled) {
          setUseProxy(true)
          setSpec(null)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [openApiUrl, useProxy])


  return (
    (() => {
      const effectiveUrl = useProxy
        ? `/api/openapi-lower?target=${encodeURIComponent(openApiUrl)}`
        : openApiUrl
      return (
        <ApiReferenceReact
          key={spec ? 'with-spec' : `with-url:${effectiveUrl}`}
          configuration={{
            ...(spec ? { spec } : { url: effectiveUrl }),
            forceDarkModeState: "light",
            hideDarkModeToggle: true,
            authentication: auth,
          }}
        />
      )
    })()
  )
}

export default ApiDoc;