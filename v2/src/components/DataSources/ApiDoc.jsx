"use client"
import React, { useEffect, useRef } from 'react';

const ApiDoc = ({openApiUrl}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Dynamically import rapidoc only on the client side to avoid SSR issues
    const loadRapidoc = async () => {
      if (typeof window !== 'undefined' && containerRef.current) {
        // Import rapidoc dynamically to avoid SSR issues
        await import('rapidoc');
        
        // Create the rapi-doc element
        const rapidocElement = document.createElement('rapi-doc');
        rapidocElement.setAttribute('spec-url', openApiUrl);
        rapidocElement.setAttribute('render-style', 'focus');
        rapidocElement.style.height = '100vh';
        rapidocElement.style.width = '100%';
        rapidocElement.style.margin = '0';
        rapidocElement.setAttribute('theme', 'light');
        rapidocElement.setAttribute('persist-auth', 'true');
        rapidocElement.setAttribute('show-info', 'false');
        rapidocElement.setAttribute('show-header', 'false');
        rapidocElement.setAttribute('nav-bg-color', '#00182C');
        rapidocElement.setAttribute('nav-text-color', '#fff');
        rapidocElement.setAttribute('primary-color', '#00182C');
        rapidocElement.setAttribute('show-method-in-nav-bar', 'as-colored-block');
        rapidocElement.setAttribute('show-components', 'false');
        rapidocElement.setAttribute('allow-spec-file-download', 'false');
        rapidocElement.setAttribute('show-curl-before-try', 'false');
        rapidocElement.setAttribute('schema-style', 'table');
        rapidocElement.setAttribute('font-size', 'large');
        rapidocElement.setAttribute('schema-expand-level', '1');
        rapidocElement.setAttribute('default-schema-tab', 'schema');
        rapidocElement.setAttribute('load-fonts', 'false');
        rapidocElement.setAttribute('regular-font', 'UntitledSans');
        rapidocElement.setAttribute('mono-font', 'monospace');
        
        // Clear container and append the element
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(rapidocElement);
      }
    };

    loadRapidoc();
  }, [openApiUrl]);

  return <div ref={containerRef} style={{ height: "100vh", width: "100%" }} />;
}

export default ApiDoc;