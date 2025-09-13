import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { ServiceOrganisationResponse, ServiceOrganisationItem } from '@/types/serviceOrganisation';

/**
 * Fetch an organisation (public) by ID via unauthenticated service endpoint.
 * GET /service/organisation/?organisationId=<id>
 */
export const useGetServiceOrganisationById = (organisationId: string) => {
  return useQuery<ServiceOrganisationResponse, Error>({
    queryKey: ['serviceOrganisation', organisationId],
    queryFn: () => apiService.getServiceOrganisationById(organisationId),
    enabled: !!organisationId,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Convenience hook to get the first organisation item from response
 */
export const useGetServiceOrganisationItem = (organisationId: string) => {
  const { data, ...rest } = useGetServiceOrganisationById(organisationId);
  const item: ServiceOrganisationItem | undefined = data?.organisations?.[0];
  return { item, response: data, ...rest };
};

/**
 * Fetch all organisations (public) via unauthenticated service endpoint.
 * GET /service/organisation/
 */
export const useGetServiceOrganisations = () => {
  return useQuery<ServiceOrganisationResponse, Error>({
    queryKey: ['serviceOrganisations'],
    queryFn: () => apiService.getServiceOrganisations(),
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
