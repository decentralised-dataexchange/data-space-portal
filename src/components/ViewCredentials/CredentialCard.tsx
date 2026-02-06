import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useTranslations } from 'next-intl';

interface Props {
  title: string;
  orgName: string;
  issuedBy?: string;
  logoUrl?: string;
  onClick: () => void;
}

const CredentialCard: React.FC<Props> = ({ title, orgName, issuedBy, logoUrl, onClick }) => {
  const t = useTranslations();

  return (
    <Box
      onClick={onClick}
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: '24px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: '#FFFFFF',
        '&:hover': {
          borderColor: "#cdc",
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography variant="body1" sx={{ fontSize: '20px', fontWeight: 400, lineHeight: 1.4, textTransform: "uppercase" }}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.4 }}>
          {orgName}
        </Typography>
        {issuedBy !== undefined && (
            <Typography variant="body2" sx={{ fontSize: '16px', marginTop: '4px', fontStyle: 'italic' }}>
                <span style={{ fontStyle: 'normal' }}>Issued by:</span> {issuedBy}
            </Typography>
        )}
      </Box>
      <Box display="flex" alignItems="flex-end" marginBottom="-40px">
        {/* Placeholder for the blue/yellow circles icon from the image, using Avatar for logo if provided */}
        {logoUrl ? (
          <Avatar src={logoUrl} sx={{ width: 48, height: 48 }} variant="circular" />
        ) : (
            // Fallback or specific icon if needed, for now just empty or generic
            <Box sx={{ width: 48, height: 48, backgroundColor: '#f0f0f0', borderRadius: '50%' }} />
        )}
      </Box>
    </Box>
  );
};

export default CredentialCard;
