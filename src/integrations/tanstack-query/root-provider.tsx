import { QueryClient } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        retry: 1,
        staleTime: 0,
        gcTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  })

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {}
