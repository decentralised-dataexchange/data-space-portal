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

  // load and transform OpenAPI document so that all paths are lowercase
  const [spec, setSpec] = useState<any>(null)

  useEffect(() => {
    const loadSpec = async () => {
      try {
        const res = await fetch(openApiUrl)
        if (!res.ok) return
        const data = await res.json()
        if (data.paths) {
          const lowerPaths: Record<string, any> = {}
          Object.entries(data.paths).forEach(([path, value]) => {
            lowerPaths[path.toLowerCase()] = value
          })
          data.paths = lowerPaths
        }

        console.log("data", data)
        setSpec(data)
      } catch (err) {
        console.error("Failed to load OpenAPI spec", err)
      }
    }
    loadSpec()
  }, [openApiUrl])

  return (
    <ApiReferenceReact
    configuration={{
      ...(spec ? { spec } : { url: openApiUrl }),
      forceDarkModeState: "light",
      hideDarkModeToggle: true,
      
      authentication: auth
    }}
    />
  )
}

export default ApiDoc;