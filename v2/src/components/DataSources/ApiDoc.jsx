"use client"
import React from 'react';
import 'rapidoc';

const ApiDoc = ({openApiUrl}) => {

  return (  
    <rapi-doc
      spec-url={openApiUrl}
      render-style="focus"
      style={{ height: "100vh", width: "100%" }}
      theme="light"
      persist-auth="true"
      show-info="false"
      show-header="false"
      nav-bg-color="#00182C"
      nav-text-color="#fff"
      primary-color="#00182C"
      show-method-in-nav-bar="as-colored-block"
      show-components="false"
      allow-spec-file-download="false"
      show-curl-before-try="false"
      schema-style="table"
      font-size="large"
      schema-expand-level="1"
      default-schema-tab="schema"
      load-fonts="false"
      regular-font="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif"
      mono-font="monospace"
    >
    </rapi-doc>
  )
}

export default ApiDoc;