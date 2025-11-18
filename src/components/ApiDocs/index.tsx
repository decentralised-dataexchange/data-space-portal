"use client";

import React from 'react';
import SwaggerDoc from './SwaggerDoc';

export type ApiDocProps = {
  openApiUrl?: string;
  spec?: any;
};

// Note: Scalar implementation removed per request. Keeping commented reference below.
// import ScalarImpl from './ScalarImpl';
// const ENGINE = (process.env.NEXT_PUBLIC_API_DOCS_ENGINE || 'swagger').toLowerCase();

export default function ApiDoc(props: ApiDocProps) {
  // If a spec object is provided, prefer Swagger renderer for robust spec injection support
  if (props?.spec) {
    return <SwaggerDoc openApiUrl={props.openApiUrl || ''} spec={props.spec} />;
  }
  return <SwaggerDoc openApiUrl={props.openApiUrl || ''} />;
}

// Legacy: to re-enable Scalar renderer, uncomment imports above and this export.
// export { SwaggerDoc, ScalarImpl as ScalarDoc };
export { SwaggerDoc };
