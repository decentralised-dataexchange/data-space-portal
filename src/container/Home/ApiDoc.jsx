import React from 'react';
import {useLocation} from 'react-router-dom';
import 'rapidoc';


const ApiDoc = () => {
  const location = useLocation();
    return(
        <rapi-doc
          spec-url = {location?.state}
          render-style = "view"
          style = {{ height: "100vh", width: "100%" }}
          theme="light"
          persist-auth="true"
          show-info="true"
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
        >
        </rapi-doc>
    )
}

export default ApiDoc;