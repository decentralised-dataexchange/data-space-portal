"use client";

import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ConnectProps {
  onNext: () => void;
  onBack?: () => void;
}

const ConnectComponent = ({ onNext, onBack }: ConnectProps) => {
  const t = useTranslations();
  const router = useRouter();
  const [justification, setJustification] = useState('');

  const handleConnect = () => {
    // In a real implementation, this would initiate the wallet connection
    // For now, we'll just proceed to the next step
    onNext();
  };

  const handleJustificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJustification(event.target.value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {t('verification.connect.title')}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('verification.connect.description')}
      </Typography>

      <Box className="walletContainer" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          {t('verification.connect.walletTitle')}
        </Typography>
        
        <Box className="walletInfo" sx={{ 
          bgcolor: '#f5f5f5', 
          p: 3, 
          borderRadius: 1,
          mt: 2
        }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('verification.connect.walletDescription')}
            </Typography>
            <TextField
              className="businessJustifiation"
              label={t('verification.connect.justification')}
              fullWidth
              multiline
              rows={4}
              value={justification}
              onChange={handleJustificationChange}
              margin="normal"
              variant="standard"
              InputProps={{
                disableUnderline: false,
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        {onBack && (
          <Button 
            onClick={onBack}
            variant="outlined"
            size="large"
          >
            {t('common.back')}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleConnect}
          size="large"
          disabled={!justification.trim()}
        >
          {t('common.continue')}
        </Button>
      </Box>
    </Box>
  );
};

export default ConnectComponent;
