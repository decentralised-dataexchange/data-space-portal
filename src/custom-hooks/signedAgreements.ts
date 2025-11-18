import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { SignedAgreementsListResponse, SignedAgreementRecordResponse } from '@/types/signedAgreement';

export const SIGNED_AGREEMENTS_QUERY_KEYS = {
  all: ['signedAgreements'] as const,
  list: (params: { limit: number; offset: number }) => [...SIGNED_AGREEMENTS_QUERY_KEYS.all, 'list', params] as const,
  detail: (id: string) => [...SIGNED_AGREEMENTS_QUERY_KEYS.all, 'detail', id] as const,
};

export const useSignedAgreements = (limit: number, offset: number) => {
  return useQuery<SignedAgreementsListResponse, Error>({
    queryKey: SIGNED_AGREEMENTS_QUERY_KEYS.list({ limit, offset }),
    queryFn: async () => {
      const res = await apiService.listSignedAgreements(limit, offset) as any;
      const top = res || {};
      const list = top?.dataDisclosureAgreementRecord
        ?? top?.dataDisclosureAgreementRecords
        ?? top?.records
        ?? top?.items
        ?? top?.data
        ?? top?.data_disclosure_agreement_record
        ?? top?.data_disclosure_agreement_records
        ?? top?.dataDisclosureAgreementRecord?.items
        ?? top?.dataDisclosureAgreementRecords?.items
        ?? top?.data_disclosure_agreement_record?.items
        ?? top?.data_disclosure_agreement_records?.items
        ?? [];
      const pgSrc = top?.pagination
        ?? top?.page
        ?? top?.dataDisclosureAgreementRecord?.pagination
        ?? top?.dataDisclosureAgreementRecords?.pagination
        ?? top?.data_disclosure_agreement_record?.pagination
        ?? top?.data_disclosure_agreement_records?.pagination
        ?? {};
      const pg = pgSrc || ({} as any);
      return {
        dataDisclosureAgreementRecord: Array.isArray(list) ? list : [],
        pagination: {
          currentPage: pg.currentPage ?? pg.current_page ?? Math.floor(((pg.offset ?? pg.offset_value ?? offset) / (pg.limit ?? pg.page_size ?? limit))) + 1,
          totalItems: pg.totalItems ?? pg.total_items ?? pg.total ?? pg.count ?? (Array.isArray(list) ? list.length : 0),
          totalPages: pg.totalPages ?? pg.total_pages ?? Math.max(1, Math.ceil(((pg.totalItems ?? pg.total_items ?? 0) / (pg.limit ?? pg.page_size ?? limit)))),
          limit: pg.limit ?? pg.page_size ?? limit,
          hasPrevious: pg.hasPrevious ?? pg.has_previous ?? ((pg.currentPage ?? pg.current_page ?? 1) > 1),
          hasNext: pg.hasNext ?? pg.has_next ?? ((pg.currentPage ?? pg.current_page ?? 1) < (pg.totalPages ?? pg.total_pages ?? 1)),
          // optional fields from backend; keep for compatibility
          total: pg.total ?? pg.totalItems ?? pg.total_items ?? pg.count ?? 0,
          offset: pg.offset ?? pg.offset_value ?? ((pg.currentPage ?? pg.current_page) ? ((pg.currentPage ?? pg.current_page) - 1) * (pg.limit ?? pg.page_size ?? limit) : offset),
        },
      } as SignedAgreementsListResponse;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

export const useSignedAgreement = (id: string, enabled: boolean = true) => {
  return useQuery<SignedAgreementRecordResponse, Error>({
    queryKey: SIGNED_AGREEMENTS_QUERY_KEYS.detail(id),
    queryFn: async () => apiService.readSignedAgreement(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
