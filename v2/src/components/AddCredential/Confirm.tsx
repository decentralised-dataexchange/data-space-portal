"use client";

import { Avatar, Box, Button, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

// Local mock for store since we're focusing on UI parity
const useAppSelector = (selector: any) => {
  // Mock data that matches the expected structure
  return selector({
    gettingStart: {
      data: {
        dataSource: {
          name: 'Demo Organization',
          location: 'San Francisco, CA',
          description: 'This is a sample organization for demonstration purposes.',
          coverImageUrl: '/images/default-cover.jpg',
          logoUrl: '/images/default-logo.png'
        }
      },
      verifyConnection: {
        data: {
          verification: {
            presentationRecord: {
              id: 'verification-12345'
            }
          }
        }
      }
    }
  });
};

// Default images
const defaultCoverImage = '/images/default-cover.jpg';
const defaultLogoImg = '/images/default-logo.png';

interface ConfirmProps {
  onNext: () => void;
  onBack: () => void;
}

const ConfirmComponent = ({ onNext, onBack }: ConfirmProps) => {
  const t = useTranslations();
  const gettingStartData = useAppSelector((state: any) => state?.gettingStart?.data);
  const { coverImageUrl, logoUrl, location, description, name } = gettingStartData?.dataSource || {};
  const verifyConnectionObj = useAppSelector(
    (state: any) => state?.gettingStart?.verifyConnection.data?.verification?.presentationRecord
  );
  
  // Mock data for the verification details
  const verificationDetails = [
    { attribute: 'Organization', value: name || 'N/A' },
    { attribute: 'Location', value: location || 'N/A' },
    { attribute: 'Verification ID', value: verifyConnectionObj?.id || 'N/A' },
    { attribute: 'Status', value: 'Verified' },
  ];

  return (
    <Box className="dd-modal-container">
      <form>
        <Box className="dd-modal-banner-container">
          <Box
            style={{ height: "150px", width: "100%" }}
            component="img"
            alt="Banner"
            src={coverImageUrl || defaultCoverImage}
          />
        </Box>
        
        <Box sx={{ marginBottom: "60px" }}>
          <Avatar
            src={logoUrl || defaultLogoImg}
            style={{
              position: "absolute",
              marginLeft: 50,
              marginTop: "-65px",
              width: "110px",
              height: "110px",
              border: "solid white 6px",
            }}
          />
        </Box>

        <Box className="dd-modal-details" style={{ paddingBottom: "80px" }}>
          <Box p={1.5}>
            <Typography variant="h6" fontWeight="bold">
              {name || 'Organization Name'}
            </Typography>
            <Typography color="#9F9F9F">
              {location || 'Location'}
            </Typography>
            
            <Typography variant="subtitle1" mt={3}>
              {t("common.overView")}
            </Typography>
            
            <Typography
              variant="subtitle2"
              color="#9F9F9F"
              mt={1}
              sx={{ wordWrap: "breakWord" }}
            >
              {description || 'Organization description'}
            </Typography>

            <Typography color="grey" mt={3} variant="subtitle1">
              {t('common.certificateOfRegistration')}
            </Typography>

            {/* Verification details */}
            <Box mt={2}>
              {verificationDetails.map((item, index) => (
                <Box key={index} display="flex" mb={1}>
                  <Typography variant="body2" fontWeight="bold" sx={{ minWidth: '120px' }}>
                    {item.attribute}:
                  </Typography>
                  <Typography variant="body2" ml={1}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="space-between" mt={4} p={2}>
          <Button 
            onClick={onBack}
            variant="outlined"
            size="large"
          >
            {t('common.back')}
          </Button>
          <Button
            variant="contained"
            onClick={onNext}
            size="large"
            sx={{ minWidth: '150px' }}
          >
            {t('common.continue')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ConfirmComponent;