"use client";

import React from 'react';
import SwaggerDoc from './SwaggerDoc';

export type ApiDocProps = {
  openApiUrl?: string;
  spec?: unknown;
};

export default function ApiDoc(props: ApiDocProps) {
  if (props?.spec) {
    return <SwaggerDoc openApiUrl={props.openApiUrl || ''} spec={props.spec} />;
  }
  return <SwaggerDoc openApiUrl={props.openApiUrl || ''} />;
}

export { SwaggerDoc };
