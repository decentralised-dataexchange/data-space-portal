"use client";

import React from 'react';
import ScalarImpl from './ScalarImpl';
import SwaggerDoc from './SwaggerDoc';

export type ApiDocProps = {
  openApiUrl?: string;
  spec?: any;
};

// Select which renderer to use. Default to Swagger.
const ENGINE = (process.env.NEXT_PUBLIC_API_DOCS_ENGINE || 'swagger').toLowerCase();

export default function ApiDoc(props: ApiDocProps) {
  // If a spec object is provided, prefer Swagger renderer for robust spec injection support
  if (props?.spec) {
    return <SwaggerDoc openApiUrl={props.openApiUrl || ''} spec={props.spec} />;
  }
  if (ENGINE === 'scalar') {
    return <ScalarImpl openApiUrl={props.openApiUrl || ''} />;
  }
  return <SwaggerDoc openApiUrl={props.openApiUrl || ''} />;
}

// Keep a stable named export for potential external imports
export { SwaggerDoc, ScalarImpl as ScalarDoc };
