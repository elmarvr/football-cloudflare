import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@football/api";
import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import Constants from "expo-constants";

export const api = createTRPCReact<AppRouter>();

function apiUrl() {
  const host = Constants.expoConfig?.hostUri;
  const localhost = host?.split(":")[0];

  if (!localhost) {
    throw new Error(
      "Failed to get localhost. Please point to your production server."
    );
  }

  return `http://${localhost}:8787`;
}

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${apiUrl()}/trpc`,
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  );
};
