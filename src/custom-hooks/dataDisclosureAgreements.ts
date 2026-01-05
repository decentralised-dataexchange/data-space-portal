import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { DataDisclosureAgreement, DDAgreementsResponse } from '@/types/dataDisclosureAgreement';

export interface DDAError extends Error {
  status?: number;
  details?: string;
}

// Query keys for better type safety and reuse
export const DDA_QUERY_KEYS = {
  all: ['ddAgreements'] as const,
  lists: () => [...DDA_QUERY_KEYS.all, 'list'] as const,
  list: (filters: { status: string; limit: number; offset: number }) => 
    [...DDA_QUERY_KEYS.lists(), filters] as const,
  details: (id: string) => [...DDA_QUERY_KEYS.all, 'detail', id] as const
};

/**
 * Hook to fetch Data Disclosure Agreements with filtering and pagination
 * @param status Filter by status ("all", "listed", etc.)
 * @param limit Number of items per page
 * @param offset Pagination offset
 * @returns Query result with DDA list and pagination info
 */
export const useDDAgreements = (status: string, limit: number, offset: number) => {
  return useQuery<DDAgreementsResponse, DDAError>({
    queryKey: DDA_QUERY_KEYS.list({ status, limit, offset }),
    queryFn: async () => {
      try {
        const response = await apiService.listDataDisclosureAgreements(status, limit, offset);
        // Ensure minimal fallbacks if backend omits some fields
        const pg = response.pagination || ({} as DDAgreementsResponse['pagination']);
        return {
          dataDisclosureAgreements: response.dataDisclosureAgreements || [],
          pagination: {
            currentPage: pg.currentPage ?? Math.floor((pg.offset ?? offset) / (pg.limit ?? limit)) + 1,
            totalItems: pg.totalItems ?? 0,
            totalPages: pg.totalPages ?? Math.max(1, Math.ceil((pg.totalItems ?? 0) / (pg.limit ?? limit))),
            limit: pg.limit ?? limit,
            hasPrevious: pg.hasPrevious ?? ((pg.currentPage ?? 1) > 1),
            hasNext: pg.hasNext ?? ((pg.currentPage ?? 1) < (pg.totalPages ?? 1)),
            total: pg.total ?? pg.totalItems ?? 0,
            offset: pg.offset ?? (pg.currentPage ? (pg.currentPage - 1) * (pg.limit ?? limit) : offset),
          },
        } as DDAgreementsResponse;
      } catch (error) {
        const ddaError = error as DDAError;
        console.error('Error fetching DDA list:', ddaError);
        throw ddaError;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
  });
};

/**
 * Hook to delete a Data Disclosure Agreement
 * Implements optimistic updates and error handling
 * @returns Mutation function and state
 */
export const useDeleteDDA = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, DDAError, string>({
    mutationFn: async (id: string) => {
      try {
        await apiService.deleteDDA(id);
      } catch (error) {
        const ddaError = error as DDAError;
        console.error(`Error deleting DDA ${id}:`, ddaError);
        throw ddaError;
      }
    },
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: DDA_QUERY_KEYS.all });
      
      // Find all relevant queries in the cache
      const queries = queryClient.getQueriesData<DDAgreementsResponse>({ 
        queryKey: DDA_QUERY_KEYS.lists() 
      });
      
      // Store previous data for all affected queries
      const previousQueries: Record<string, DDAgreementsResponse> = {};
      
      // Update all affected queries optimistically
      queries.forEach(([queryKey, data]) => {
        if (data) {
          const queryKeyStr = JSON.stringify(queryKey);
          previousQueries[queryKeyStr] = data;
          
          queryClient.setQueryData<DDAgreementsResponse>(queryKey, {
            ...data,
            dataDisclosureAgreements: data.dataDisclosureAgreements.filter(
              (dda: DataDisclosureAgreement) => dda.templateId !== id
            ),
            pagination: {
              ...data.pagination,
              total: Math.max(0, data.pagination.total - 1),
              totalItems: Math.max(0, data.pagination.totalItems - 1),
            },
          });
        }
      });
      
      return { previousQueries };
    },
    onError: (err: DDAError, id: string, context: unknown) => {
      const typedContext = context as { previousQueries?: Record<string, DDAgreementsResponse> };
      // Rollback on error
      if (typedContext?.previousQueries) {
        Object.entries(typedContext.previousQueries).forEach(([queryKeyStr, data]) => {
          const queryKey = JSON.parse(queryKeyStr) as QueryKey;
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      // Log the error
      console.error(`Failed to delete DDA ${id}:`, err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: DDA_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook specifically for publishing a DDA to the marketplace
 * @returns Mutation function and state
 */
export const usePublishDDA = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, DDAError, string>({
    mutationFn: async (dataAgreementId: string) => {
      try {
        await apiService.updateDDAStatus(dataAgreementId, { status: 'listed' });
      } catch (error) {
        const ddaError = error as DDAError;
        console.error(`Error publishing DDA ${dataAgreementId}:`, ddaError);
        throw ddaError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DDA_QUERY_KEYS.all });
    },
    onError: (error, dataAgreementId) => {
      console.error(`Failed to publish DDA ${dataAgreementId}:`, error);
    }
  });
};

interface UpdateDDAStatusParams {
  id: string;
  status: string;
}

/**
 * Hook to update the status of a Data Disclosure Agreement
 * @returns Mutation function and state
 */
export const useUpdateDDAStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, DDAError, UpdateDDAStatusParams>({
    mutationFn: async ({ id, status }: UpdateDDAStatusParams) => {
      // Try the provided id first. If 404, attempt fallbacks derived from cached list item.
      const tried: Set<string> = new Set();
      const tryUpdate = async (candidateId: string) => {
        tried.add(candidateId);
        try {
          await apiService.updateDDAStatus(candidateId, { status });
          return true;
        } catch (e: any) {
          const httpStatus = e?.response?.status;
          if (httpStatus === 404) {
            return false; // allow trying next candidate
          }
          // non-404 -> surface error immediately
          throw e;
        }
      };

      // 1) primary attempt with incoming id
      if (await tryUpdate(id)) return;

      // 2) derive candidates from cached lists
      const queries = queryClient.getQueriesData<DDAgreementsResponse>({ queryKey: DDA_QUERY_KEYS.lists() });
      const candidates: string[] = [];
      for (const [, data] of queries) {
        const items = data?.dataDisclosureAgreements || [];
        const match = items.find((dda: any) => (
          dda?.templateId === id ||
          dda?.['@id'] === id ||
          dda?.dataAgreementId === id ||
          dda?.dataAgreementRevisionId === id
        ));
        if (match) {
          // Prefer templateId first, then other known identifiers
          const maybeIds = [
            match?.templateId,
            match?.['@id'],
            match?.dataAgreementId,
            match?.dataAgreementRevisionId,
          ].filter(Boolean) as string[];
          maybeIds.forEach((cid) => { if (!tried.has(cid)) candidates.push(cid); });
          break;
        }
      }

      // 3) attempt each unique candidate until one succeeds or all fail
      for (const cid of candidates) {
        if (await tryUpdate(cid)) return;
      }

      // If nothing worked, throw a 404-ish error with context
      const err: DDAError = new Error(`All candidate IDs 404 for status update. Tried: ${[id, ...candidates].join(', ')}`) as DDAError;
      err.status = 404;
      throw err;
    },
    onMutate: async ({ id, status }: UpdateDDAStatusParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: DDA_QUERY_KEYS.all });
      
      // Find all relevant queries in the cache
      const queries = queryClient.getQueriesData<DDAgreementsResponse>({ 
        queryKey: DDA_QUERY_KEYS.lists() 
      });
      
      // Store previous data for all affected queries
      const previousQueries: Record<string, DDAgreementsResponse> = {};
      
      // Update all affected queries optimistically
      queries.forEach(([queryKey, data]) => {
        if (data) {
          const queryKeyStr = JSON.stringify(queryKey);
          previousQueries[queryKeyStr] = data;
          
          queryClient.setQueryData<DDAgreementsResponse>(queryKey, {
            ...data,
            dataDisclosureAgreements: data.dataDisclosureAgreements.map(
              (dda: DataDisclosureAgreement) => dda.templateId === id ? { ...dda, status } : dda
            )
          });
        }
      });
      
      return { previousQueries };
    },
    onError: (err: DDAError, variables, context: unknown) => {
      const typedContext = context as { previousQueries?: Record<string, DDAgreementsResponse> };
      // Rollback on error
      if (typedContext?.previousQueries) {
        Object.entries(typedContext.previousQueries).forEach(([queryKeyStr, data]) => {
          const queryKey = JSON.parse(queryKeyStr) as QueryKey;
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error(`Failed to update DDA ${variables.id} status to ${variables.status}:`, err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DDA_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to match DDAs with their data sources to get images
 * @param dataAgreementId The ID of the DDA to find images for
 * @returns Query result with cover image and logo URLs
 */
export const useDDAImages = (dataAgreementId: string | null) => {
  const queryClient = useQueryClient();
  
  return useQuery<{ coverImage: string; logoImage: string }, DDAError>({
    queryKey: ['ddaImages', dataAgreementId],
    queryFn: async () => {
      if (!dataAgreementId) {
        return { coverImage: "", logoImage: "" };
      }
      
      // Try to get data sources from cache first
      const dataSources = queryClient.getQueryData<{ dataSources: any[] }>(['dataSources']);
      
      if (!dataSources) {
        // If not in cache, we'll return default values
        // The component should handle fetching data sources separately
        return { coverImage: "", logoImage: "" };
      }
      
      // Find the data source that contains this DDA
      const dataSourcesList = dataSources.dataSources || [];
      
      for (const item of dataSourcesList) {
        if (!item?.dataSource) continue;
        
        const agreements = item.dataDisclosureAgreements || [];
        
        // Find matching DDA by templateId
        const matchingDDA = agreements.find(
          (dda: any) => dda?.templateId === dataAgreementId
        );
        
        if (matchingDDA) {
          return {
            coverImage: item.dataSource.coverImageUrl || '',
            logoImage: item.dataSource.logoUrl || ''
          };
        }
      }
      
      return { coverImage: "", logoImage: "" };
    },
    enabled: !!dataAgreementId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
