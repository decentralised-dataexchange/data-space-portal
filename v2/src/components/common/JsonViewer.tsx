"use client";
import React from "react";
import Editor, { loader } from "@monaco-editor/react";
import type { editor as Monaco } from "monaco-editor";

type Props = {
  value?: unknown;
  height?: string | number;
  language?: string;
  readOnly?: boolean;
};

// Local alias to avoid React 19 type incompatibilities where props resolve to `never`.
// We only type the props that we actually use.
type MinimalMonacoEditorProps = {
  defaultLanguage?: string;
  language?: string;
  theme?: string;
  value?: string;
  options?: Monaco.IStandaloneEditorConstructionOptions;
};
const MonacoEditor = Editor as unknown as React.ComponentType<MinimalMonacoEditorProps>;

export default function JsonViewer({ value, height = "600px", language = "json", readOnly = true }: Props) {
  let text = "";
  if (typeof value === "string") {
    const v = value.trim();
    if (v.startsWith("{") || v.startsWith("[")) {
      try {
        const parsed = JSON.parse(v);
        text = JSON.stringify(parsed, null, 2);
      } catch {
        text = value;
      }
    } else {
      text = value;
    }
  } else if (typeof value === "object" && value !== null) {
    try {
      text = JSON.stringify(value as any, null, 2);
    } catch {
      text = String(value);
    }
  } else if (typeof value !== "undefined") {
    text = String(value);
  }

  return (
    <div
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        minHeight: 0,
      }}
    >
      <MonacoEditor
        defaultLanguage={language}
        language={language}
        theme="vs-light"
        value={text}
        options={{ readOnly, minimap: { enabled: false }, wordWrap: 'on', scrollBeyondLastLine: false }}
      />
    </div>
  );
}

export async function ensureMonacoReady(): Promise<void> {
  try {
    await loader.init();
  } catch {}
}
