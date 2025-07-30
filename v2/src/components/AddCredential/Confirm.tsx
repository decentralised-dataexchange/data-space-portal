import { Avatar, Box, Typography, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/custom-hooks/store';
import { defaultCoverImage, defaultLogoImg } from '@/constants/defalultImages';
import { DataAttributeCardForDDA } from './dataAttributeCardCredentials';
import { PresentationRecord } from '@/types/verification';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import { Eye, EyeClosed } from '@phosphor-icons/react';

interface ConfirmComponentProps {
  showValues?: boolean;
  setShowValues?: (showValues: boolean) => void;
}

const ConfirmComponent: React.FC<ConfirmComponentProps> = ({ showValues: propShowValues, setShowValues: propSetShowValues }) => {
  const t = useTranslations();
  const [internalShowValues, setInternalShowValues] = useState(true);
  
  // Use props if provided, otherwise use internal state
  const showValues = propShowValues !== undefined ? propShowValues : internalShowValues;
  const setShowValues = propSetShowValues !== undefined ? propSetShowValues : setInternalShowValues;

  // Data source metadata
  const gettingStartData = useAppSelector((state: any) => state.gettingStart.data);
  const { coverImageUrl, logoUrl, location, description, name } = gettingStartData?.dataSource || {};

  // Get verification status and data
  const { isVerified = false, verifyConnectionObj } = useAppSelector((state: any) => {
    const verification = state.gettingStart.verification?.data?.verification || {};
    const record = verification.presentationRecord || 
                  (verification as any).presentation_record || {};
    
    return {
      isVerified: record.state === 'verified',
      verifyConnectionObj: record as PresentationRecord
    };
  });

  // Extract revealed attribute values and definitions
  const values = verifyConnectionObj.presentation?.requested_proof?.revealed_attrs || {};
  // requested attribute definitions (snake_case or camelCase)
  const requested: Record<string, any> =
    (verifyConnectionObj as any).presentation_request?.requested_attributes ||
    (verifyConnectionObj as any).presentationRequest?.requestedAttributes || {};

  // Build tableData for display
  const tableData: Array<{ attribute: string; value: string }> = Object.entries(requested).map(
    ([key, attr]: [string, any]) => ({
      attribute: attr.name || key,
      value: values[key]?.raw ?? ''
    })
  );

  // Define banner content
  const bannerContent = (
    <>
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={() => setShowValues(!showValues)}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            }
          }}
        >
          {showValues ? <EyeClosed size={20} /> : <Eye size={20} />}
        </IconButton>
      </Box>
    </>
  );

  return (
    <Box>
      {bannerContent}
      <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: '20px' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
          {name}
        </Typography>
      </Box>
      <Typography color="black" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingTop: "3px" }}>
        {isVerified ? t('common.trustedServiceProvider') : t('common.untrustedServiceProvider')}
        <VerifiedBadge trusted={isVerified} size="small" />
      </Typography>
      <Typography variant="subtitle1" mt={2}>
        {t('common.overView')}
      </Typography>
      <Typography
        variant="subtitle2"
        color="black"
        mt={0.5}
        sx={{ wordWrap: "break-word" }}
      >
        {description}
      </Typography>

      <Typography color="black" mt={2} variant="subtitle1">
        {t('common.certificateOfRegistration')}
      </Typography>

      <Box sx={{ marginTop: '16px' }}>
        <DataAttributeCardForDDA selectedData={tableData} showValues={showValues} />
      </Box>
    </Box>
  );
};

export default ConfirmComponent;