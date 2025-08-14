'use client';

import * as React from 'react';
import { ReactNode, useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/theme';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  // Create one Emotion cache for the client that persists across renders
  const [cache] = useState(() => {
    const cache = createCache({ key: 'mui', prepend: true });
    // Enable compatibility mode for MUI v5
    (cache as any).compat = true;
    return cache;
  });

  // Inject Emotion CSS generated on the server into the HTML during SSR
  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys((cache as any).inserted).join(' ')}`}
      dangerouslySetInnerHTML={{ __html: Object.values((cache as any).inserted).join(' ') }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
