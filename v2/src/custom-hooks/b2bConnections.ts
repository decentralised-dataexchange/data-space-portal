import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { B2BConnectionsListResponse, B2BConnectionDetailResponse } from '@/types/b2bConnection';

export const B2B_QUERY_KEYS = {
  all: ['b2bConnections'] as const,
  list: (params: { limit: number; offset: number }) => [...B2B_QUERY_KEYS.all, 'list', params] as const,
  detail: (id: string) => [...B2B_QUERY_KEYS.all, 'detail', id] as const,
};

export const useB2BConnections = (limit: number, offset: number) => {
  return useQuery<B2BConnectionsListResponse, Error>({
    queryKey: B2B_QUERY_KEYS.list({ limit, offset }),
    queryFn: async () => {
      const res = await apiService.listB2BConnections(limit, offset) as any;
      const top = res || {};
      const list = top?.b2bConnection || top?.items || top?.results || top?.data || [];
      const pgSrc = top?.pagination || top?.page || {};
      const pg = pgSrc || {} as any;
      return {
        b2bConnection: Array.isArray(list) ? list : [],
        pagination: {
          currentPage: pg.currentPage ?? pg.current_page ?? Math.floor(((pg.offset ?? pg.offset_value ?? offset) / (pg.limit ?? pg.page_size ?? limit))) + 1,
          totalItems: pg.totalItems ?? pg.total_items ?? pg.total ?? pg.count ?? (Array.isArray(list) ? list.length : 0),
          totalPages: pg.totalPages ?? pg.total_pages ?? Math.max(1, Math.ceil(((pg.totalItems ?? pg.total_items ?? 0) / (pg.limit ?? pg.page_size ?? limit)))),
          limit: pg.limit ?? pg.page_size ?? limit,
          hasPrevious: pg.hasPrevious ?? pg.has_previous ?? ((pg.currentPage ?? pg.current_page ?? 1) > 1),
          hasNext: pg.hasNext ?? pg.has_next ?? ((pg.currentPage ?? pg.current_page ?? 1) < (pg.totalPages ?? pg.total_pages ?? 1)),
          total: pg.total ?? pg.totalItems ?? pg.total_items ?? pg.count ?? 0,
          offset: pg.offset ?? pg.offset_value ?? ((pg.currentPage ?? pg.current_page) ? ((pg.currentPage ?? pg.current_page) - 1) * (pg.limit ?? pg.page_size ?? limit) : offset),
        },
      } as B2BConnectionsListResponse;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useB2BConnection = (id: string, enabled: boolean = true) => {
  return useQuery<B2BConnectionDetailResponse, Error>({
    queryKey: B2B_QUERY_KEYS.detail(id),
    queryFn: async () => apiService.readB2BConnection(id),
    enabled: Boolean(enabled && id),
    staleTime: 5 * 60 * 1000,
  });
};
