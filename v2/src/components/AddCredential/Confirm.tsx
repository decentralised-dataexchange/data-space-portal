import { Box, Typography, Tooltip, Link as MuiLink } from '@mui/material';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/custom-hooks/store';
import { DataAttributeCardForDDA } from './dataAttributeCardCredentials';
import { PresentationRecord } from '@/types/verification';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import { AttributeTable } from '@/components/common/AttributeTable';

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
  // Access Point Endpoint intentionally not shown under avatar/trust label

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

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: '20px' }}>
        <Typography variant="h6" sx={{ fontSize: '16px' }}>
          {name}
        </Typography>
      </Box>
      <Typography color="black" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingTop: "3px", color: isVerified ? '#2e7d32' : '#d32f2f' }}>
        {isVerified ? t('common.trustedServiceProvider') : t('common.untrustedServiceProvider')}
        <VerifiedBadge trusted={isVerified} />
      </Typography>
      {/* Access Point Endpoint removed from below avatar section */}
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

      <Typography color="grey" mt={2} variant="subtitle1">
        {t('common.certificateOfRegistration')}
      </Typography>

      <Box sx={{ marginTop: '16px' }}>
        <DataAttributeCardForDDA selectedData={tableData} showValues={showValues} />
      </Box>
    </Box>
  );
};

export default ConfirmComponent;