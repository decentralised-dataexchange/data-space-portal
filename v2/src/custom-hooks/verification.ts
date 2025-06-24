import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/apiService/apiService';
import { useAppDispatch } from './store';
import { setVerification, setVerificationError } from '@/store/reducers/gettingStartReducers';
import { 
  Verification, 
  VerificationTemplate
} from '@/types/verification';

export const useVerificationTemplates = (restrictTemplate = false) => {
  return useQuery<VerificationTemplate[], Error>({
    queryKey: ['verificationTemplates', { restrictTemplate }],
    queryFn: async (): Promise<VerificationTemplate[]> => {
      try {
        const data = await apiService.getVerificationTemplates(restrictTemplate);
        return Array.isArray(data) ? data : data?.verificationTemplates || [];
      } catch (error) {
        console.error('Error fetching verification templates:', error);
        throw new Error('Failed to load verification templates. Please try again later.');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCreateVerification = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<Verification, Error, string>({
    mutationFn: async (templateId: string): Promise<Verification> => {
      try {
        if (process.env.NODE_ENV === 'development') {
          // Mock response for development
          return {
            id: `mock-verification-${Date.now()}`,
            templateId,
            status: 'pending',
            organizationId: 'org-123',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            metadata: {},
          };
        }
        return await apiService.createVerification(templateId);
      } catch (error) {
        console.error('Error creating verification:', error);
        throw new Error('Failed to start verification. Please try again.');
      }
    },
    onSuccess: (verification) => {
      dispatch(setVerification({ verification }));
      queryClient.invalidateQueries({ queryKey: ['verification'] });
      queryClient.prefetchQuery({
        queryKey: ['verification', verification.id],
        queryFn: () => apiService.getVerification(verification.id)
      });
    },
    onError: (error: Error) => {
      dispatch(setVerificationError(error.message));
      console.error('Verification creation error:', error);
    },
    retry: 2,
    retryDelay: 1000,
  });
};

export const useReadVerificationWithPolling = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation<Verification, Error, string>({
    mutationFn: async (verificationId: string): Promise<Verification> => {
      if (process.env.NODE_ENV === 'development') {
        // Mock response for development
        return {
          id: verificationId,
          templateId: 'mock-template',
          status: 'verified',
          organizationId: 'org-123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          metadata: {},
        };
      }
      return await apiService.getVerification(verificationId);
    },
    onSuccess: (verification) => {
      dispatch(setVerification({ verification }));
      queryClient.invalidateQueries({ queryKey: ['verification'] });
    },
    onError: (error: Error) => {
      dispatch(setVerificationError(error.message));
      console.error('Verification read error:', error);
    },
    retry: 2,
    retryDelay: 1000,
  });
};

export const useGetVerification = (verificationId?: string) => {
  return useQuery<Verification, Error>({
    queryKey: ['verification', verificationId],
    queryFn: async (): Promise<Verification> => {
      if (!verificationId) {
        throw new Error('No verification ID provided');
      }
      return await apiService.getVerification(verificationId);
    },
    enabled: !!verificationId,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const usePollVerification = (verificationId?: string) => {
  return useQuery<Verification, Error>({
    queryKey: ['verification', verificationId],
    queryFn: async (): Promise<Verification> => {
      if (!verificationId) {
        throw new Error('No verification ID provided');
      }

      // In development, simulate API call with mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('Polling verification status for:', verificationId);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate verification process (70% success rate for demo)
        const shouldSucceed = Math.random() > 0.3;
        const status = shouldSucceed ? 'verified' : 'failed';
        
        if (!shouldSucceed) {
          throw new Error('Verification failed. Please try again.');
        }

        return {
          id: verificationId,
          status,
          templateId: 'mock-template',
          organizationId: 'org-123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          metadata: {},
        };
      }

      // In production, make the actual API call
      try {
        return await apiService.getVerification(verificationId);
      } catch (error) {
        console.error('Error fetching verification:', error);
        throw new Error('Failed to fetch verification status. Please try again.');
      }
    },
    enabled: !!verificationId,
    refetchInterval: (query) => {
      // Only poll if verification is not complete
      const status = query.state.data?.status;
      return status === 'pending' ? 3000 : false;
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

interface OrganizationVerificationResponse {
  verified: boolean;
  status: string;
  // Add other properties as needed
}

export const useOrganizationVerification = () => {
  return useQuery<OrganizationVerificationResponse, Error>({
    queryKey: ['organizationVerification'],
    queryFn: async (): Promise<OrganizationVerificationResponse> => {
      try {
        const response = await apiService.getOrganizationVerification();
        // Ensure the response matches the expected type
        if (typeof response === 'object' && response !== null && 'verified' in response && 'status' in response) {
          return response as OrganizationVerificationResponse;
        }
        throw new Error('Invalid organization verification response');
      } catch (error) {
        console.error('Error fetching organization verification:', error);
        throw new Error('Failed to load organization verification status');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
