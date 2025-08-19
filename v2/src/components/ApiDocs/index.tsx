"use client";

import React from 'react';
import ScalarImpl from './ScalarImpl';
import SwaggerDoc from './SwaggerDoc';

export type ApiDocProps = {
  openApiUrl: string;
};

// Select which renderer to use. Default to Swagger.
const ENGINE = (process.env.NEXT_PUBLIC_API_DOCS_ENGINE || 'swagger').toLowerCase();

export default function ApiDoc(props: ApiDocProps) {
  if (ENGINE === 'scalar') {
    return <ScalarImpl {...props} />;
  }
  return <SwaggerDoc {...props} />;
}

// Keep a stable named export for potential external imports
export { SwaggerDoc, ScalarImpl as ScalarDoc };
