"use client";

import React, { ReactNode, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./AuthProvider";

interface ProvidersProps {
  children: ReactNode;
}

// Create a client
const getQueryClient = (() => {
  let client: QueryClient | null = null;
  return () => {
    if (!client) {
      client = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false
          },
        },
      });
    }
    return client;
  };
})();

export default function ClientProviders({ children }: ProvidersProps) {
  // Use state to ensure consistent rendering between server and client
  const [queryClient] = useState(() => getQueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}
