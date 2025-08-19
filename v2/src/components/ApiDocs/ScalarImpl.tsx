"use client"
import { ApiReferenceConfiguration, ApiReferenceReact } from '@scalar/api-reference-react'
import { useEffect, useRef, useState } from "react"
import '@scalar/api-reference-react/style.css'

export default function ScalarImpl({ openApiUrl }: { openApiUrl: string }) {
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

  // Remove only top-level scroll containers so API doc uses page scroll and auto height
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const findMainContent = (): HTMLElement | null => {
      const cands = Array.from(
        root.querySelectorAll<HTMLElement>(
          'main, [role="main"], [class*="content" i], [class*="main" i], section'
        )
      )
      let best: HTMLElement | null = null
      let bestScore = -1
      for (const el of cands) {
        const score = el.querySelectorAll('h1, h2, h3, h4').length
        if (score > bestScore) {
          best = el
          bestScore = score
        }
      }
      return best
    }

    const stripScrolls = () => {
      const main = findMainContent() || root
      // Walk up from main content and relax vertical scroll constraints on 1-2 ancestor containers
      const toRelax: HTMLElement[] = []
      let cur: HTMLElement | null = main
      while (cur && cur !== root && toRelax.length < 2) {
        const parent = cur.parentElement as HTMLElement | null
        if (!parent) break
        // Skip obvious sidebar containers
        if (
          parent.matches(
            'nav[aria-label], nav[role="navigation"], aside[role="complementary"], [class*="sidebar" i], [class*="toc" i], [data-sidebar]'
          )
        ) {
          cur = parent
          continue
        }
        const cs = getComputedStyle(parent)
        const isScrollable =
          (cs.overflowY === 'auto' || cs.overflowY === 'scroll') &&
          parent.scrollHeight > parent.clientHeight
        const likelyPageConstraint =
          cs.height.endsWith('vh') || cs.maxHeight.endsWith('vh') || cs.height.endsWith('px')
        if (isScrollable || likelyPageConstraint) {
          toRelax.push(parent)
        }
        cur = parent
      }

      toRelax.forEach((el) => {
        const cs = getComputedStyle(el)
        el.style.overflowY = 'visible'
        el.style.maxHeight = 'none'
        if (cs.height && (cs.height.endsWith('px') || cs.height.endsWith('vh'))) {
          el.style.height = 'auto'
        }
      })
    }

    stripScrolls()
    const mo = new MutationObserver(() => stripScrolls())
    mo.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    })
    return () => mo.disconnect()
  }, [])

  // Minimal client-side transform: lowercase only path keys
  const [spec, setSpec] = useState<any>(null)
  const [useProxy, setUseProxy] = useState(true)
  const containerRef = useRef<HTMLDivElement | null>(null)

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

  // Smooth-scroll for in-page anchor links inside the API reference
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    // Enable smooth scroll globally during this page to catch any native jumps
    const prevScrollBehavior = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'smooth'

    const scrollToHash = (hash: string) => {
      const id = hash.replace(/^#/, '')
      const el = document.getElementById(id) || document.querySelector(hash)
      if (!el) return
      const HEADER_OFFSET = 80
      const rect = (el as HTMLElement).getBoundingClientRect()
      const y = window.scrollY + rect.top - HEADER_OFFSET
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
    }

    const findAnchor = (e: MouseEvent): HTMLAnchorElement | null => {
      const path = (e as any).composedPath ? (e as any).composedPath() : []
      for (const node of path) {
        if (node instanceof Element && node.tagName === 'A') return node as HTMLAnchorElement
      }
      const target = e.target as HTMLElement | null
      return (target ? (target.closest('a') as HTMLAnchorElement | null) : null)
    }

    const onClick = (e: MouseEvent) => {
      const link = findAnchor(e)
      if (!link) return
      const hrefAttr = link.getAttribute('href') || ''
      // Only handle same-page links with a hash (either just '#...' or full URL with same path)
      let hash = ''
      if (hrefAttr.startsWith('#')) {
        hash = hrefAttr
      } else if (link.hash && link.pathname === window.location.pathname) {
        hash = link.hash
      }
      if (!hash) return
      // Only adjust when clicking within the sidebar/toc; let default navigation occur
      const inSidebar = !!link.closest(
        'nav[aria-label], nav[role="navigation"], aside[role="complementary"], [class*="sidebar" i], [class*="toc" i], [data-sidebar]'
      )
      if (!inSidebar) return
      // Intercept and perform our own smooth scroll to avoid library-internal scrolling
      e.preventDefault()
      // Update the URL hash without reloading
      if (hash !== window.location.hash) {
        try { history.pushState(null, '', hash) } catch {}
      }
      // Smooth scroll with header offset
      scrollToHash(hash)
    }
    const onHashChange = () => {
      if (window.location.hash) scrollToHash(window.location.hash)
    }

    // Use capture phase to beat any library default handlers
    root.addEventListener('click', onClick, true)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      root.removeEventListener('click', onClick, true)
      window.removeEventListener('hashchange', onHashChange)
      document.documentElement.style.scrollBehavior = prevScrollBehavior
    }
  }, [])

  // Make sidebar sticky/persistent using robust DOM detection
  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const HEADER_OFFSET = 80
    let currentSidebar: HTMLElement | null = null
    let placeholderEl: HTMLElement | null = null
    let cleanupFns: Array<() => void> = []
    let shadowObservers: MutationObserver[] = []
    let relaxedAncestors: Array<{ el: HTMLElement; prev: Partial<CSSStyleDeclaration> }> = []
    let tweakedStickyChildren: Array<{ el: HTMLElement; prev: Partial<CSSStyleDeclaration> }> = []
    let tweakedInnerScrollers: Array<{ el: HTMLElement; prev: Partial<CSSStyleDeclaration> }> = []

    // Query selector that pierces shadow DOMs under the root
    const queryAllDeep = (selector: string): HTMLElement[] => {
      const results: HTMLElement[] = []
      const stack: (Element | DocumentFragment)[] = [root]
      const seen = new Set<Node>()
      while (stack.length) {
        const node = stack.pop()!
        if (seen.has(node)) continue
        seen.add(node)
        const found = (node.querySelectorAll ? Array.from(node.querySelectorAll(selector)) : []) as HTMLElement[]
        results.push(...found)
        // Explore children that host shadow roots
        const allEls: Element[] = node.querySelectorAll ? Array.from(node.querySelectorAll('*')) : []
        for (const el of allEls) {
          const sr = (el as any).shadowRoot as ShadowRoot | null
          if (sr) stack.push(sr)
        }
      }
      // De-duplicate
      return Array.from(new Set(results))
    }

    const observeShadows = () => {
      shadowObservers.forEach((o) => o.disconnect())
      shadowObservers = []
      const hosts = Array.from(root.querySelectorAll('*')) as Element[]
      for (const host of hosts) {
        const sr = (host as any).shadowRoot as ShadowRoot | null
        if (!sr) continue
        const o = new MutationObserver(() => { applySticky(); hideUnwantedBlocks() })
        o.observe(sr, { subtree: true, childList: true })
        shadowObservers.push(o)
      }
    }

    // Hide only the header area (title/download/server/client-libraries) and keep the rest visible
    const hideUnwantedBlocks = () => {
      const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()
      const hideNode = (el: HTMLElement | null) => { if (!el) return; if (!el.hasAttribute('data-hidden-by-app')) { el.setAttribute('data-hidden-by-app', 'true'); el.style.display = 'none' } }

      // 1) Find the top H1 (API title)
      const h1 = (queryAllDeep('h1, [role="heading"][aria-level="1"]')[0] as HTMLElement | undefined)
      if (!h1) return
      // Hide the title block itself (its nearest section/article/div)
      const titleBlock = (h1.closest('section, article') as HTMLElement) || (h1.parentElement as HTMLElement | null)
      hideNode(titleBlock)

      // 2) Hide a few immediate siblings that match download/server/client-libraries
      const isDownloadBlock = (el: HTMLElement) => {
        const t = norm(el.textContent || '')
        if (t.includes('download openapi')) return true
        const a = el.querySelector('a[download], a, button') as HTMLAnchorElement | HTMLButtonElement | null
        const href = (a as HTMLAnchorElement)?.href || ''
        return /openapi|\.ya?ml|\.json/i.test(href)
      }
      const isServerBlock = (el: HTMLElement) => {
        const hs = Array.from(el.querySelectorAll('h1,h2,h3,[role="heading"],dt,strong,label'))
        return hs.some(h => norm(h.textContent || '') === 'server' || norm(h.textContent || '').includes('servers'))
      }
      const isClientLibsBlock = (el: HTMLElement) => {
        const tabs = Array.from(el.querySelectorAll('[role="tablist"] [role="tab"]'))
        const labels = tabs.map(t => norm(t.textContent || ''))
        const langs = ['shell','curl','ruby','node','node.js','php','python','go','java']
        return labels.some(l => langs.some(lang => l.includes(lang))) || norm(el.textContent || '').includes('client librar')
      }
      let sib = titleBlock?.nextElementSibling as HTMLElement | null
      let lastHidden: HTMLElement | null = null
      let scanned = 0
      while (sib && scanned < 6) {
        if (isDownloadBlock(sib) || isServerBlock(sib) || isClientLibsBlock(sib)) {
          hideNode(sib)
          lastHidden = sib
        }
        // Stop once we reach something that looks like endpoints/paths content
        const txt = norm(sib.textContent || '')
        if (txt.includes('paths') || txt.includes('endpoint') || txt.includes('operations')) break
        sib = sib.nextElementSibling as HTMLElement | null
        scanned++
      }

      // 3) Trim any leftover spacing above the first visible content block
      if (lastHidden) {
        lastHidden.style.marginBottom = '0'
        lastHidden.style.paddingBottom = '0'
        ;(lastHidden.style as any).borderBottom = 'none'
      }
      const contentCandidates = queryAllDeep('h2, h3, h4, h5, h6, [role="heading"][aria-level="2"], [role="heading"][aria-level="3"], section, article, div')
      const isVisible = (el: Element) => {
        const e = el as HTMLElement
        if (!e || !e.offsetParent) return false
        const style = window.getComputedStyle(e)
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0'
      }
      const firstContent = contentCandidates.find((el) => isVisible(el)) as HTMLElement | undefined
      if (firstContent) {
        const rootEl = containerRef.current as HTMLElement | null
        const block = (firstContent.closest('section, article, div') as HTMLElement) || firstContent
        // Collapse this block
        block.style.marginTop = '0'
        block.style.paddingTop = '0'
        ;(block.style as any).borderTop = 'none'
        // Tighten the heading itself
        if (/^H[2-6]$/i.test(firstContent.tagName)) {
          firstContent.style.marginTop = '0'
          ;(firstContent.style as any).paddingTop = '0'
        }
        // Walk up a few ancestors to remove any container spacing
        let ancestor: HTMLElement | null = block.parentElement
        let hops = 0
        while (ancestor && ancestor !== rootEl && hops < 6) {
          ancestor.style.marginTop = '0'
          ancestor.style.paddingTop = '0'
          ;(ancestor.style as any).borderTop = 'none'
          ancestor = ancestor.parentElement
          hops++
        }
        // Ensure the ApiDoc container itself has no top spacing
        if (rootEl) {
          rootEl.style.marginTop = '0'
          rootEl.style.paddingTop = '0'
        }
        // Hide any immediate separators at the top (global)
        const separators = queryAllDeep('hr, [role="separator"], .divider')
        for (const sep of separators) {
          const sp = sep as HTMLElement
          if (!sp.offsetParent) continue
          sp.style.display = 'none'
          break
        }
        // Also target the direct previous sibling of the first content block if it looks like a spacer/divider
        const prev = block.previousElementSibling as HTMLElement | null
        if (prev) {
          const hasHeadings = prev.querySelector('h1,h2,h3,h4,h5,h6,[role="heading"]')
          const rect = prev.getBoundingClientRect()
          const thin = rect.height <= 40
          const texty = (prev.textContent || '').trim().length > 0
          if (!hasHeadings && thin && !texty) {
            prev.style.display = 'none'
          } else {
            prev.style.marginBottom = '0'
            prev.style.paddingBottom = '0'
            ;(prev.style as any).borderBottom = 'none'
          }
        }
      }
    }

    const applySticky = () => {
      // Responsive: disable sticky on small screens and let page scroll naturally
      const isNarrow = window.matchMedia('(max-width: 900px)').matches
      if (isNarrow) {
        // Cleanup previously applied sticky styles and listeners
        if (currentSidebar) {
          cleanupFns.forEach((fn) => fn())
          cleanupFns = []
          const s = currentSidebar.style
          s.position = ''
          s.top = ''
          s.left = ''
          s.width = ''
          s.maxHeight = ''
          s.overflow = ''
          s.marginTop = ''
          s.paddingTop = ''
          s.height = ''
          s.minHeight = ''
          currentSidebar.removeAttribute('data-sticky-applied')
        }
        if (tweakedStickyChildren.length) {
          for (const { el, prev } of tweakedStickyChildren) {
            if (prev.position !== undefined) el.style.position = prev.position as string
            if (prev.top !== undefined) el.style.top = prev.top as string
          }
          tweakedStickyChildren = []
        }
        if (tweakedInnerScrollers.length) {
          for (const { el, prev } of tweakedInnerScrollers) {
            if (prev.height !== undefined) el.style.height = prev.height as string
            if (prev.maxHeight !== undefined) el.style.maxHeight = prev.maxHeight as string
            if (prev.minHeight !== undefined) el.style.minHeight = prev.minHeight as string
            if (prev.overflow !== undefined) el.style.overflow = prev.overflow as string
            if (prev.overflowY !== undefined) el.style.overflowY = prev.overflowY as string
            if (prev.marginTop !== undefined) el.style.marginTop = prev.marginTop as string
            if (prev.marginBottom !== undefined) el.style.marginBottom = prev.marginBottom as string
            if (prev.paddingTop !== undefined) el.style.paddingTop = prev.paddingTop as string
            if (prev.paddingBottom !== undefined) el.style.paddingBottom = prev.paddingBottom as string
            if ((prev as any).flex !== undefined) el.style.flex = (prev as any).flex
            if ((prev as any).overscrollBehavior !== undefined) (el.style as any).overscrollBehavior = (prev as any).overscrollBehavior
          }
          tweakedInnerScrollers = []
        }
        if (placeholderEl && placeholderEl.parentElement) {
          placeholderEl.parentElement.removeChild(placeholderEl)
          placeholderEl = null
        }
        if (relaxedAncestors.length) {
          for (const { el, prev } of relaxedAncestors) {
            if (prev.transform !== undefined) el.style.transform = prev.transform as string
            if (prev.overflow !== undefined) el.style.overflow = prev.overflow as string
            if (prev.overflowY !== undefined) el.style.overflowY = prev.overflowY as string
            if (prev.height !== undefined) el.style.height = prev.height as string
            if (prev.maxHeight !== undefined) el.style.maxHeight = prev.maxHeight as string
          }
          relaxedAncestors = []
        }
        return
      }
      const candidates = queryAllDeep(
        'nav[aria-label], nav[role="navigation"], aside[role="complementary"], [class*="sidebar" i], [class*="toc" i]'
      )
      // pick the one with most list items as the actual nav/toc
      let best: HTMLElement | null = null
      let bestScore = -1
      const rootRect = root.getBoundingClientRect()
      const findMain = (): HTMLElement | null => {
        const all = queryAllDeep('main, [role="main"], [class*="content" i], [class*="main" i], section')
        return all[0] || null
      }
      const mainEl = findMain()
      const countSamePageLinks = (node: Element) => {
        const anchors = Array.from(node.querySelectorAll<HTMLAnchorElement>('a[href]'))
        let count = 0
        for (const a of anchors) {
          const href = a.getAttribute('href') || ''
          if (!href || !href.includes('#')) continue
          if (href.startsWith('#')) { count++; continue }
          try {
            const url = new URL(href, window.location.href)
            if (url.pathname === window.location.pathname) count++
          } catch {}
        }
        return count
      }

      for (const el of candidates) {
        const rect = el.getBoundingClientRect()
        const widthRatio = rect.width / Math.max(1, rootRect.width)
        const leftRatio = (rect.left - rootRect.left) / Math.max(1, rootRect.width)
        const hashLinks = countSamePageLinks(el)
        const liCount = el.querySelectorAll('li').length
        const navRole = el.matches('nav, aside[role="complementary"]')
        const hasHeadings = !!el.querySelector('h1, h2, h3, h4')
        const containsMain = !!(mainEl && (el.contains(mainEl) || mainEl.contains(el)))
        // Filter out containers that are too wide or that look like main content
        if (hashLinks < 2) continue
        if (widthRatio > 0.6) continue
        if (leftRatio > 0.7) continue
        if (hasHeadings) continue
        if (containsMain) continue
        const score = hashLinks + Math.min(liCount, 50) + (navRole ? 50 : 0)
        if (score > bestScore) { best = el; bestScore = score }
      }
      // Fallback: locate by the presence of a search input and many in-page links
      if (!best) {
        const deepSearch = queryAllDeep('input[type="search"], input[role="searchbox"]')
        const search = deepSearch[0] || null
        if (search) {
          let cur: HTMLElement | null = search as HTMLElement
          while (cur && root.contains(cur)) {
            const linkCount = countSamePageLinks(cur)
            if (linkCount >= 5) { best = cur; break }
            cur = cur.parentElement as HTMLElement | null
          }
        }
      }
      if (!best) return

      // Expand target from inner nav/accordion to the full sidebar container
      const expandSidebarContainer = (el: HTMLElement): HTMLElement => {
        let target = el
        // Prefer the lowest common ancestor with the search box if present
        const searchEls = queryAllDeep('input[type="search"], input[role="searchbox"], [role="search"] input, [data-search] input')
        const searchEl = (searchEls[0] as HTMLElement) || null
        const lcaWithSearch = searchEl ? lowestCommonAncestor(el, searchEl) : null
        if (lcaWithSearch && lcaWithSearch !== root) {
          target = lcaWithSearch
        }

        // Heuristic climb: go up while staying in the left column and not swallowing main content
        let cur: HTMLElement | null = target
        let steps = 0
        while (cur && cur.parentElement && root.contains(cur.parentElement) && steps < 5) {
          const parent = cur.parentElement as HTMLElement
          const pr = parent.getBoundingClientRect()
          const br = el.getBoundingClientRect()
          const widthRatio = pr.width / Math.max(1, rootRect.width)
          const leftDiff = Math.abs(pr.left - br.left)
          const containsMain = !!(mainEl && (parent.contains(mainEl) || mainEl.contains(parent)))
          if (containsMain) break
          // keep width reasonably narrow and aligned with original
          if (widthRatio <= 0.5 && leftDiff <= 24) {
            target = parent
            cur = parent
            steps++
            continue
          }
          break
        }
        return target
      }

      const target = expandSidebarContainer(best)

      // Ensure the common layout container doesn't block sticky (overflow/height constraints)
      const lowestCommonAncestor = (a: HTMLElement, b: HTMLElement): HTMLElement | null => {
        const ancestors = new Set<HTMLElement>()
        let cur: HTMLElement | null = a
        while (cur && root.contains(cur)) { ancestors.add(cur); cur = cur.parentElement }
        cur = b
        while (cur && root.contains(cur)) { if (ancestors.has(cur)) return cur; cur = cur.parentElement }
        return null
      }
      if (mainEl) {
        const common = lowestCommonAncestor(target, mainEl)
        if (common) {
          const cs = getComputedStyle(common)
          const hasBlockingOverflow =
            cs.overflow === 'hidden' || cs.overflowY === 'hidden' || cs.overflowY === 'auto' || cs.overflowY === 'scroll'
          const hasBlockingHeight = (cs.height && (cs.height.endsWith('vh') || cs.height.endsWith('px'))) ||
            (cs.maxHeight && (cs.maxHeight.endsWith('vh') || cs.maxHeight.endsWith('px')))
          if (hasBlockingOverflow || hasBlockingHeight) {
            common.style.overflow = 'visible'
            common.style.overflowY = 'visible'
            common.style.maxHeight = 'none'
            if (cs.height && (cs.height.endsWith('vh') || cs.height.endsWith('px'))) {
              common.style.height = 'auto'
            }
          }
        }
      }

      // Further relax nearest blocking ancestors for transforms/overflow that break fixed
      // First restore any previously relaxed ancestors (if we change targets / re-run)
      if (relaxedAncestors.length) {
        for (const { el, prev } of relaxedAncestors) {
          if (prev.transform !== undefined) el.style.transform = prev.transform as string
          if (prev.overflow !== undefined) el.style.overflow = prev.overflow as string
          if (prev.overflowY !== undefined) el.style.overflowY = prev.overflowY as string
          if (prev.height !== undefined) el.style.height = prev.height as string
          if (prev.maxHeight !== undefined) el.style.maxHeight = prev.maxHeight as string
        }
        relaxedAncestors = []
      }

      const relaxBlockingAncestors = (start: HTMLElement) => {
        let cur: HTMLElement | null = start.parentElement
        let relaxedCount = 0
        while (cur && root.contains(cur) && relaxedCount < 6) {
          const cs = getComputedStyle(cur)
          const needsTransform = cs.transform && cs.transform !== 'none'
          const needsOverflow = cs.overflowY === 'hidden' || cs.overflowY === 'auto' || cs.overflowY === 'scroll' || cs.overflow === 'hidden'
          const needsHeight = (cs.height && (cs.height.endsWith('vh') || cs.height.endsWith('px'))) ||
            (cs.maxHeight && (cs.maxHeight.endsWith('vh') || cs.maxHeight.endsWith('px')))
          if (needsTransform || needsOverflow || needsHeight) {
            const prev: Partial<CSSStyleDeclaration> = {}
            if (needsTransform) { prev.transform = cur.style.transform; cur.style.transform = 'none' }
            if (needsOverflow) {
              prev.overflow = cur.style.overflow
              prev.overflowY = cur.style.overflowY
              cur.style.overflow = 'visible'
              cur.style.overflowY = 'visible'
            }
            if (needsHeight) {
              prev.height = cur.style.height
              prev.maxHeight = cur.style.maxHeight
              cur.style.maxHeight = 'none'
              if (cs.height && (cs.height.endsWith('vh') || cs.height.endsWith('px'))) {
                cur.style.height = 'auto'
              }
            }
            relaxedAncestors.push({ el: cur, prev })
            relaxedCount++
          }
          cur = cur.parentElement
        }
      }

      relaxBlockingAncestors(target)

      // If switching target, cleanup previous
      if (currentSidebar && currentSidebar !== target) {
        cleanupFns.forEach((fn) => fn())
        cleanupFns = []
        // Remove previous fixed styles
        const s = currentSidebar.style
        s.position = ''
        s.top = ''
        s.left = ''
        s.width = ''
        s.maxHeight = ''
        s.overflow = ''
        s.marginTop = ''
        s.paddingTop = ''
        s.height = ''
        s.minHeight = ''
        currentSidebar.removeAttribute('data-sticky-applied')
        // Restore tweaked sticky children
        if (tweakedStickyChildren.length) {
          for (const { el, prev } of tweakedStickyChildren) {
            if (prev.position !== undefined) el.style.position = prev.position as string
            if (prev.top !== undefined) el.style.top = prev.top as string
          }
          tweakedStickyChildren = []
        }
        // Restore inner scrollers
        if (tweakedInnerScrollers.length) {
          for (const { el, prev } of tweakedInnerScrollers) {
            if (prev.height !== undefined) el.style.height = prev.height as string
            if (prev.maxHeight !== undefined) el.style.maxHeight = prev.maxHeight as string
            if (prev.minHeight !== undefined) el.style.minHeight = prev.minHeight as string
            if (prev.overflow !== undefined) el.style.overflow = prev.overflow as string
            if (prev.overflowY !== undefined) el.style.overflowY = prev.overflowY as string
            if (prev.marginTop !== undefined) el.style.marginTop = prev.marginTop as string
            if (prev.marginBottom !== undefined) el.style.marginBottom = prev.marginBottom as string
            if (prev.paddingTop !== undefined) el.style.paddingTop = prev.paddingTop as string
            if (prev.paddingBottom !== undefined) el.style.paddingBottom = prev.paddingBottom as string
            if ((prev as any).flex !== undefined) el.style.flex = (prev as any).flex
            if ((prev as any).overscrollBehavior !== undefined) (el.style as any).overscrollBehavior = (prev as any).overscrollBehavior
          }
          tweakedInnerScrollers = []
        }
        // Remove old placeholder
        if (placeholderEl && placeholderEl.parentElement) {
          placeholderEl.parentElement.removeChild(placeholderEl)
        }
        placeholderEl = null
        // Restore relaxed ancestors
        if (relaxedAncestors.length) {
          for (const { el, prev } of relaxedAncestors) {
            if (prev.transform !== undefined) el.style.transform = prev.transform as string
            if (prev.overflow !== undefined) el.style.overflow = prev.overflow as string
            if (prev.overflowY !== undefined) el.style.overflowY = prev.overflowY as string
            if (prev.height !== undefined) el.style.height = prev.height as string
            if (prev.maxHeight !== undefined) el.style.maxHeight = prev.maxHeight as string
          }
          relaxedAncestors = []
        }
      }

      currentSidebar = target

      // Ensure a placeholder exists before the sidebar to preserve layout
      if (!placeholderEl || (currentSidebar && placeholderEl.parentElement !== currentSidebar.parentElement)) {
        placeholderEl = document.createElement('div')
        placeholderEl.setAttribute('data-sidebar-placeholder', 'true')
        currentSidebar?.parentElement?.insertBefore(placeholderEl, currentSidebar)
      }

      // Measure placeholder from content union (search + nav + footer) to avoid
      // inheriting large min-heights from a wide column container
      const originalRect = currentSidebar.getBoundingClientRect()
      const phWidth = Math.max(1, originalRect.width)
      const getUnionHeight = () => {
        // Use in-flow, visible children of the expanded sidebar container to compute content height
        const kids = Array.from(currentSidebar.children) as HTMLElement[]
        const inflow = kids.filter((el) => {
          const cs = getComputedStyle(el)
          if (cs.display === 'none') return false
          if (cs.position === 'absolute' || cs.position === 'fixed') return false
          return true
        })
        if (inflow.length === 0) return originalRect.height
        let top = Infinity
        let bottom = -Infinity
        for (const el of inflow) {
          const r = el.getBoundingClientRect()
          top = Math.min(top, r.top)
          bottom = Math.max(bottom, r.bottom)
        }
        if (!isFinite(top) || !isFinite(bottom)) return originalRect.height
        return Math.max(1, bottom - top)
      }
      const csSidebar = getComputedStyle(currentSidebar)
      const topSpacing = (parseFloat(csSidebar.marginTop || '0') || 0) + (parseFloat(csSidebar.paddingTop || '0') || 0)
      const bottomSpacing = (parseFloat(csSidebar.marginBottom || '0') || 0) + (parseFloat(csSidebar.paddingBottom || '0') || 0)
      const borderSpacing = (parseFloat(csSidebar.borderTopWidth || '0') || 0) + (parseFloat(csSidebar.borderBottomWidth || '0') || 0)
      const rawUnion = getUnionHeight()
      const rawBaseline = Math.min(originalRect.height, rawUnion)
      const initialTop = currentSidebar.getBoundingClientRect().top
      // Compute the total height of fixed/sticky bars at the top (navbar, breadcrumbs, etc.)
      const getEffectiveHeaderOffset = (): number => {
        const selectors = [
          'header',
          '[role="banner"]',
          '.MuiAppBar-root',
          '.MuiToolbar-root',
          '[data-fixed-header]',
          '.breadcrumbs',
          'nav[role="navigation"]',
        ]
        const nodes = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(',')))
        let maxBottom = 0
        for (const n of nodes) {
          const cs = getComputedStyle(n)
          if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
          const r = n.getBoundingClientRect()
          // Consider bars pinned near the top edge; use union (max bottom), not sum
          if (r.height > 0 && r.top >= 0 && r.top < 160 && r.bottom > 0) {
            maxBottom = Math.max(maxBottom, r.bottom)
          }
        }
        // Fallback to default when nothing was found
        if (maxBottom === 0) return HEADER_OFFSET
        return Math.round(maxBottom)
      }

      // Compute the height of fixed/sticky elements at the bottom (footer/bottom nav)
      const getEffectiveFooterOffset = (): number => {
        const selectors = [
          'footer',
          '[role="contentinfo"]',
          '.MuiBottomNavigation-root',
          '[data-fixed-footer]'
        ]
        const nodes = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(',')))
        let maxHeight = 0
        for (const n of nodes) {
          const cs = getComputedStyle(n)
          if (cs.position !== 'fixed' && cs.position !== 'sticky') continue
          const r = n.getBoundingClientRect()
          const nearBottom = (window.innerHeight - r.bottom) <= 2
          if (r.height > 0 && nearBottom) {
            maxHeight = Math.max(maxHeight, r.height)
          }
        }
        return Math.round(maxHeight)
      }

      const effectiveHeader = (() => {
        try { return getEffectiveHeaderOffset() } catch { return HEADER_OFFSET }
      })()
      const effectiveFooter = (() => {
        try { return getEffectiveFooterOffset() } catch { return 0 }
      })()
      const startsUnderHeader = initialTop <= effectiveHeader + 4
      // Use content baseline; no viewport cap so height is fully auto
      const phHeight = Math.max(1, rawBaseline - topSpacing - bottomSpacing - borderSpacing - (startsUnderHeader ? effectiveHeader : 0))
      placeholderEl.style.width = `${phWidth}px`
      placeholderEl.style.height = `${phHeight}px`
      placeholderEl.style.visibility = 'hidden'

      

      // Disable sticky descendants (e.g., search bar) while container is fixed to avoid extra top gaps
      const disableStickyDescendants = () => {
        const all = currentSidebar.querySelectorAll<HTMLElement>('*')
        for (const el of Array.from(all)) {
          const cs = getComputedStyle(el)
          if (cs.position === 'sticky') {
            const prev: Partial<CSSStyleDeclaration> = { position: el.style.position, top: el.style.top }
            el.style.position = 'static'
            el.style.top = 'auto'
            tweakedStickyChildren.push({ el, prev })
          }
        }
      }
      disableStickyDescendants()

      // Disable inner scroll containers (e.g., nav.sidebar-pages) so links area is auto height and uses page scroll
      const disableInnerScrollers = () => {
        const candidates: HTMLElement[] = []
        // Common Scalar classes/selectors
        candidates.push(
          ...Array.from(currentSidebar.querySelectorAll<HTMLElement>('nav.sidebar-pages')),
          ...Array.from(currentSidebar.querySelectorAll<HTMLElement>('nav.sidebar-pages > ul')),
          ...Array.from(currentSidebar.querySelectorAll<HTMLElement>('.sidebar-group')),
          ...Array.from(currentSidebar.querySelectorAll<HTMLElement>('.custom-scroll')),
          ...Array.from(currentSidebar.querySelectorAll<HTMLElement>('.custom-scroll-self-contain-overflow'))
        )
        const seen = new Set<HTMLElement>()
        for (const el of candidates) {
          if (seen.has(el)) continue
          seen.add(el)
          const prev: Partial<CSSStyleDeclaration> & { overscrollBehavior?: string } = {
            height: el.style.height,
            maxHeight: el.style.maxHeight,
            minHeight: el.style.minHeight,
            overflow: el.style.overflow,
            overflowY: el.style.overflowY,
            marginTop: el.style.marginTop,
            marginBottom: el.style.marginBottom,
            paddingTop: el.style.paddingTop,
            paddingBottom: el.style.paddingBottom,
            flex: el.style.flex,
            overscrollBehavior: (el.style as any).overscrollBehavior,
          }
          el.style.setProperty('height', 'auto', 'important')
          el.style.setProperty('max-height', 'none', 'important')
          el.style.setProperty('min-height', '0', 'important')
          el.style.setProperty('overflow', 'visible', 'important')
          el.style.setProperty('overflow-y', 'visible', 'important')
          el.style.setProperty('margin-top', '0px', 'important')
          el.style.setProperty('margin-bottom', '0px', 'important')
          el.style.setProperty('padding-top', '0px', 'important')
          el.style.setProperty('padding-bottom', '0px', 'important')
          el.style.setProperty('flex', '0 0 auto', 'important')
          ;(el.style as any).overscrollBehavior = 'auto'
          tweakedInnerScrollers.push({ el, prev })
        }
      }
      disableInnerScrollers()

      // Re-measure placeholder after tweaks so reserved space matches final layout
      {
        const rect2 = currentSidebar.getBoundingClientRect()
        const phWidth2 = Math.max(1, rect2.width)
        const kids2 = Array.from(currentSidebar.children) as HTMLElement[]
        const inflow2 = kids2.filter((el) => {
          const cs = getComputedStyle(el)
          if (cs.display === 'none') return false
          if (cs.position === 'absolute' || cs.position === 'fixed') return false
          return true
        })
        let top2 = Infinity
        let bottom2 = -Infinity
        for (const el of inflow2) {
          const r = el.getBoundingClientRect()
          top2 = Math.min(top2, r.top)
          bottom2 = Math.max(bottom2, r.bottom)
        }
        const raw2 = isFinite(top2) && isFinite(bottom2) ? Math.max(1, bottom2 - top2) : rect2.height
        const base2 = Math.min(rect2.height, raw2)
        const phHeight2 = Math.max(1, base2 - topSpacing - bottomSpacing - borderSpacing - (startsUnderHeader ? effectiveHeader : 0))
        placeholderEl.style.width = `${phWidth2}px`
        placeholderEl.style.height = `${phHeight2}px`
      }
      

      const switchToStickyFallback = () => {
        if (!currentSidebar) return
        // Remove listeners first
        cleanupFns.forEach((fn) => fn())
        cleanupFns = []
        // Remove placeholder
        if (placeholderEl && placeholderEl.parentElement) {
          placeholderEl.parentElement.removeChild(placeholderEl)
        }
        placeholderEl = null
        // Apply sticky styles instead of fixed
        const s = currentSidebar.style
        s.position = 'sticky'
        s.top = `${HEADER_OFFSET}px`
        s.left = ''
        s.width = ''
        s.maxHeight = ''
        s.overflow = ''
      }

      const updateFixed = () => {
        if (!currentSidebar || !placeholderEl) return
        const pr = placeholderEl.getBoundingClientRect()
        const left = pr.left
        const width = pr.width
        const s = currentSidebar.style
        s.setProperty('position', 'fixed', 'important')
        // Determine header/footer heights dynamically
        const headerOffset = getEffectiveHeaderOffset()
        const footerOffset = getEffectiveFooterOffset()

        // Emulate sticky: follow placeholder until headerOffset, then stick,
        // and when approaching the end of the column, move up so the bottom of
        // the sidebar can enter the viewport (no inner scrollbars).
        const colEl = (currentSidebar.parentElement as HTMLElement) || (placeholderEl.parentElement as HTMLElement) || placeholderEl
        const colRect = colEl.getBoundingClientRect()
        // Auto height: use the element's own current height; no viewport cap
        const sidebarH = currentSidebar.getBoundingClientRect().height
        const stickTop = Math.max(headerOffset, pr.top)
        const bottomLimitTop = colRect.bottom - sidebarH
        const topPx = Math.min(stickTop, bottomLimitTop)
        s.setProperty('top', `${topPx}px`, 'important')
        s.setProperty('left', `${left}px`, 'important')
        s.setProperty('width', `${width}px`, 'important')
        // Remove top spacing so we don't double-count header height
        const cs = getComputedStyle(currentSidebar)
        if (parseFloat(cs.marginTop || '0') !== 0) s.setProperty('margin-top', '0px', 'important')
        if (parseFloat(cs.paddingTop || '0') !== 0) s.setProperty('padding-top', '0px', 'important')
        s.setProperty('height', 'auto', 'important')
        s.setProperty('min-height', 'auto', 'important')
        s.setProperty('max-height', 'none', 'important')
        s.setProperty('overflow', 'visible', 'important')
        s.setProperty('z-index', '10', 'important')
        ;(currentSidebar as any).dataset['stickyApplied'] = 'true'
      }

      updateFixed()
      const onResize = () => updateFixed()
      const onScroll = () => { updateFixed() }
      window.addEventListener('resize', onResize)
      window.addEventListener('scroll', onScroll, { passive: true })
      cleanupFns.push(() => window.removeEventListener('resize', onResize))
      cleanupFns.push(() => window.removeEventListener('scroll', onScroll))
      // Also watch for breakpoint crossing to toggle sticky on/off
      const mql = window.matchMedia('(max-width: 900px)')
      const onMqlChange = () => { applySticky() }
      mql.addEventListener('change', onMqlChange)
      cleanupFns.push(() => mql.removeEventListener('change', onMqlChange))
    }

    // Initial try and observe for changes as Scalar can re-render
    applySticky()
    hideUnwantedBlocks()
    const mo = new MutationObserver(() => { applySticky(); observeShadows(); hideUnwantedBlocks() })
    mo.observe(root, { subtree: true, childList: true })
    observeShadows()
    return () => {
      mo.disconnect()
      shadowObservers.forEach((o) => o.disconnect())
      cleanupFns.forEach((fn) => fn())
      // Clear styles on unmount
      if (currentSidebar) {
        const s = currentSidebar.style
        s.position = ''
        s.top = ''
        s.left = ''
        s.width = ''
        s.maxHeight = ''
      }
      if (relaxedAncestors.length) {
        for (const { el, prev } of relaxedAncestors) {
          if (prev.transform !== undefined) el.style.transform = prev.transform as string
          if (prev.overflow !== undefined) el.style.overflow = prev.overflow as string
          if (prev.overflowY !== undefined) el.style.overflowY = prev.overflowY as string
          if (prev.height !== undefined) el.style.height = prev.height as string
          if (prev.maxHeight !== undefined) el.style.maxHeight = prev.maxHeight as string
        }
        relaxedAncestors = []
      }
    }
  }, [])


  return (
    (() => {
      const effectiveUrl = useProxy
        ? `/api/openapi-lower?target=${encodeURIComponent(openApiUrl)}`
        : openApiUrl
      return (
        <div className="api-doc-root" ref={containerRef}>
          <ApiReferenceReact
            key={spec ? 'with-spec' : `with-url:${effectiveUrl}`}
            configuration={{
              ...(spec ? { spec } : { url: effectiveUrl }),
              forceDarkModeState: "light",
              hideDarkModeToggle: true,
              authentication: auth,
              customCss: `
                /* Smooth scrolling inside the API doc area */
                .api-doc-root { scroll-behavior: smooth; }

                /* Ensure anchors don't hide behind the fixed header */
                .api-doc-root h1, .api-doc-root h2, .api-doc-root h3,
                .api-doc-root h4, .api-doc-root h5, .api-doc-root h6 {
                  scroll-margin-top: 92px;
                }

                /* Aggressively collapse any spacing before first visible content */
                .api-doc-root > *:first-child {
                  margin-top: 0 !important;
                  padding-top: 0 !important;
                  border-top: none !important;
                }

                /* Remove renderer-added top padding on main content */
                .api-doc-root main.references-rendered,
                .api-doc-root [role="main"].references-rendered,
                .api-doc-root main[role="main"] {
                  padding-top: 0 !important;
                }

                /* Remove top padding on the sidebar search box */
                .api-doc-root .scalar-api-references-standalone-search {
                  padding-top: 0 !important;
                  margin-top: 0 !important;
                }
              `,
            }}
          />
        </div>
      )
    })()
  )
}