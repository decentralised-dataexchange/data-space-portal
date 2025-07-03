import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/custom-hooks/store';
import { defaultCoverImage, defaultLogoImg } from '@/constants/defalultImages';
import { DataAttributeCardForDDA } from './dataAttributeCardCredentials';
import { PresentationRecord } from '@/types/verification';

const ConfirmComponent: React.FC = () => {
  const t = useTranslations();

  // Data source metadata
  const gettingStartData = useAppSelector((state: any) => state.gettingStart.data);
  const { coverImageUrl, logoUrl, location, description, name } = gettingStartData?.dataSource || {};

  // Live presentationRecord from verification slice
  const verifyConnectionObj = useAppSelector((state: any) =>
    state.gettingStart.verification.data?.verification.presentationRecord ||
    (state.gettingStart.verification.data?.verification as any).presentation_record || {}
  ) as PresentationRecord;

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
    <Box className="dd-modal-container">
      <form>
        <Box className="dd-modal-banner-container">
          <Box
            component="img"
            alt="Banner"
            src={coverImageUrl || defaultCoverImage}
            sx={{ height: 150, width: '100%' }}
          />
        </Box>
        <Box sx={{ mb: 8, position: 'relative' }}>
          <Avatar
            src={logoUrl || defaultLogoImg}
            sx={{
              position: 'absolute',
              marginLeft: '50px',
              marginTop: '-65px',
              width: 110,
              height: 110,
              border: '6px solid white'
            }}
          />
        </Box>
        <Box className="dd-modal-details" pb={10}>
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>
          <Typography color="#9F9F9F">
            {location}
          </Typography>
          <Typography variant="subtitle1" mt={3}>
            {t('common.overView')}
          </Typography>
          <Typography variant="subtitle2" color="#9F9F9F" mt={1} sx={{ wordWrap: 'break-word' }}>
            {description}
          </Typography>
          <Typography color="grey" mt={3} variant="subtitle1">
            {t('common.certificateOfRegistration')}
          </Typography>
          <DataAttributeCardForDDA selectedData={tableData} />
        </Box>
      </form>
    </Box>
  );
};

export default ConfirmComponent;