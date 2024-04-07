import React from 'react';
import {useLocation} from 'react-router-dom';
import 'rapidoc';


const ApiDoc = () => {
  const location = useLocation();
    return(
        <rapi-doc
          spec-url = {location?.state}
          render-style = "read"
          style = {{ height: "100vh", width: "100%" }}
        >
        </rapi-doc>
    )
}

export default ApiDoc;