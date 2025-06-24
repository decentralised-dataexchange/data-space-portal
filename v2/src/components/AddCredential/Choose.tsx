"use client";

import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Checkbox,
  CircularProgress, 
  FormControl, 
  FormHelperText,
  Grid,
  InputLabel, 
  ListItem,
  ListItemText,
  MenuItem, 
  Select, 
  SelectChangeEvent,
  Typography, 
  Alert,
  AlertTitle,
  Skeleton,
  Avatar
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useVerificationTemplates } from '@/custom-hooks/verification';
import { useAppDispatch, useAppSelector } from '@/custom-hooks/store';
import { setSelectedTemplate } from '@/store/reducers/gettingStartReducers';
import { useState, useEffect, useCallback } from 'react';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

interface ChooseProps {
  onNext: () => void;
  onBack?: () => void;
}

const ChooseComponent = ({ onNext, onBack }: ChooseProps) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { 
    data: templates, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useVerificationTemplates();
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Get organization data from Redux
  const gettingStartData = useAppSelector((state) => state?.gettingStart?.data);
  const { name, logoUrl } = gettingStartData?.dataSource || {};

  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplateId(templateId);
      // Dispatch the entire template object as expected by the Redux action
      dispatch(setSelectedTemplate(template));
      setFormError(null);
    }
  }, [templates, dispatch]);

  // Reset form errors when data changes
  useEffect(() => {
    if (templates && templates.length > 0) {
      setFormError(null);
      // Auto-select the first template if available
      if (!selectedTemplateId && templates[0]?.id) {
        handleTemplateSelect(templates[0].id);
      }
    }
  }, [templates, selectedTemplateId, handleTemplateSelect]);
  
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplateId) {
      setFormError('verification.choose.errors.selectTemplate');
      return;
    }
    
    onNext();
  };

  // Loading state with skeleton loaders
  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 4 }} />
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
        
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3 }}>
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
              <Skeleton variant="rectangular" width={20} height={20} sx={{ mt: 1 }} />
              <Box sx={{ flex: 1, bgcolor: 'white', p: 2, borderRadius: 1 }}>
                <Skeleton variant="text" width="40%" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            </Box>
          ))}
        </Box>
        
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Skeleton variant="rectangular" width={100} height={36} />
          <Skeleton variant="rectangular" width={120} height={36} />
        </Box>
      </Box>
    );
  }

  // Error state with retry option
  if (isError) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => refetch()}
              aria-label={t('common.retry')}
            >
              {t('common.retry')}
            </Button>
          }
        >
          <AlertTitle>{t('verification.choose.errors.loadingFailed')}</AlertTitle>
          {error instanceof Error ? error.message : t('verification.choose.errors.unknown')}
        </Alert>
        
        {onBack && (
          <Button 
            onClick={onBack}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            {t('common.back')}
          </Button>
        )}
      </Box>
    );
  }

  // Empty state
  if (!templates || templates.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6" gutterBottom>
          {t('verification.choose.noTemplatesTitle')}
        </Typography>
        <Typography color="text.secondary" paragraph>
          {t('verification.choose.noTemplatesDescription')}
        </Typography>
        
        {onBack && (
          <Button 
            onClick={onBack}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            {t('common.back')}
          </Button>
        )}
      </Box>
    );
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplateId);

  return (
    <Box component="form" onSubmit={handleSubmit} className="businessInfo" sx={{ p: 3 }}>
      <Typography className='mdc-typography--body2' gutterBottom component="div">
        {t('verification.choose.description')}
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2, mt: 2, mb: 3, alignItems: 'center' }}>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
            <AccountBalanceWalletOutlinedIcon fontSize='small' sx={{ mr: 0.5 }} />
            {t('verification.choose.walletInfo', { 
              walletName: templates?.[0]?.walletName || 'Wallet', 
              walletLocation: templates?.[0]?.walletLocation || '' 
            })}
          </Typography>
        </Box>
      </Box>
      
      {/* Wallet Information */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AccountBalanceWalletOutlinedIcon color="action" />
        <Typography variant="body1">
          {t('verification.choose.walletInfo', { 
            walletName: templates?.[0]?.walletName || 'Wallet', 
            walletLocation: templates?.[0]?.walletLocation || '' 
          })}
        </Typography>
      </Box>

      {/* Verification Templates */}
      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 3 }}>
        {templates?.map((template) => (
          <Box 
            key={template.id} 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 2, 
              alignItems: 'flex-start',
              bgcolor: selectedTemplateId === template.id ? 'white' : 'transparent',
              p: 2,
              borderRadius: 1,
              border: selectedTemplateId === template.id ? '1px solid #ccc' : '1px solid transparent',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'white',
                border: '1px solid #ccc',
              },
            }}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <Checkbox
              checked={selectedTemplateId === template.id}
              onChange={handleCheckboxChange}
              sx={{ mt: 1 }}
            />
            <Box sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" width="100%">
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {template.verificationTemplateName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {template.walletName}, {template.walletLocation}
                  </Typography>
                  <Typography variant="body2" fontStyle="italic" color="text.secondary">
                    {t('verification.choose.issuedBy')} {template.issuerName}, {template.issuerLocation}
                  </Typography>
                </Box>
                <Box sx={{ ml: 2 }}>
                  {template.issuerLogoUrl ? (
                    <Avatar 
                      src={template.issuerLogoUrl} 
                      alt={template.issuerName}
                      sx={{ width: 50, height: 50 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 50, height: 50 }}>
                      {template.issuerName?.charAt(0) || 'I'}
                    </Avatar>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {selectedTemplateData && (
        <Box mt={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {selectedTemplateData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTemplateData.description}
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" fontWeight="medium">
                  {t('verification.choose.issuer')}:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTemplateData.issuerName}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {formError && !formError.includes('select') && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          role="alert"
          aria-live="assertive"
        >
          {t(formError)}
        </Alert>
      )}
      
      <Box 
        mt={4} 
        display="flex" 
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        {onBack ? (
          <Button 
            onClick={onBack}
            variant="outlined"
            sx={{ minWidth: 120 }}
            aria-label={t('common.back')}
          >
            {t('common.back')}
          </Button>
        ) : <div />} {/* Empty div to push next button to right when no back button */}
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={!selectedTemplateId || isLoading}
          sx={{ 
            minWidth: 120, 
            ml: { xs: 'auto', sm: 0 },
            '&.Mui-disabled': {
              pointerEvents: 'auto',
              cursor: 'not-allowed',
            }
          }}
          aria-busy={isLoading}
          aria-disabled={!selectedTemplateId || isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              {t('common.loading')}
            </>
          ) : (
            t('common.next')
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ChooseComponent;
