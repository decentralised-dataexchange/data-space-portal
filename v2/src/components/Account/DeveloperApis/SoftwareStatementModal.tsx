"use client";

import React from "react";
import { Box, Button, Typography, Avatar, IconButton } from "@mui/material";
import RightSidebar from "@/components/common/RightSidebar";
import { AttributeTable, AttributeRow } from "@/components/common/AttributeTable";
import { defaultCoverImage, defaultLogoImg } from "@/constants/defalultImages";
import IssuedExpiryStrip from "@/components/common/IssuedExpiryStrip";
import { Eye as EyeIcon, EyeSlash as EyeSlashIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import VerifiedBadge from "@/components/common/VerifiedBadge";

export type SoftwareStatementModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  rows: AttributeRow[];
  organisationName?: string;
  overview?: string;
  coverImageBase64?: string;
  logoImageBase64?: string;
  showValues: boolean;
  setShowValues: (v: boolean) => void;
  statusLabel?: string; // localized status string (optional)
  onDelete?: () => void; // optional delete handler
  isDeleteEnabled?: boolean; // defaults false
  isRequesting?: boolean; // for potential loading states
  enableToggle?: boolean; // show/hide eye toggle, default true
  trusted?: boolean; // whether the organisation is trusted
  drawerWidth?: number; // optional override for right sidebar width
  showTrustedBadge?: boolean; // whether to show the trusted/untrusted indicator
};

const formatDateTime = (epochOrIso?: number | string) => {
  if (!epochOrIso) return '';
  const d = typeof epochOrIso === 'number' ? new Date(epochOrIso) : new Date(epochOrIso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
};

const SoftwareStatementModal: React.FC<SoftwareStatementModalProps> = ({
  open,
  onClose,
  title,
  rows,
  organisationName,
  overview,
  showValues,
  setShowValues,
  statusLabel,
  onDelete,
  isDeleteEnabled = false,
  enableToggle = true,
  trusted = false,
  drawerWidth = 580,
  coverImageBase64,
  logoImageBase64,
  showTrustedBadge = true,
}) => {
  const t = useTranslations();

  // Pull issued/expiry from rows meta if present via reserved keys
  // Caller can append hidden rows with keys '__issued' and '__expiry' in the value field
  const metaIssued = rows.find((r: AttributeRow & { key?: string }) => (r as any).key === '__issued') as any;
  const metaExpiry = rows.find((r: AttributeRow & { key?: string }) => (r as any).key === '__expiry') as any;

  // Prepare display rows (exclude meta rows)
  const displayRows = rows
    .filter((r: any) => r.key !== '__issued' && r.key !== '__expiry')
    // remove copy buttons from Software Statement rows (client_uri etc.) as per spec
    .map((r) => ({ ...r, copy: false }));

  return (
    <RightSidebar
      open={open}
      onClose={onClose}
      width={drawerWidth}
      maxWidth={drawerWidth}
      height="100%"
      bannerContent={(
        <>
          <Box sx={{ position: 'relative' }}>
            <Box component="img" alt="Banner" src={coverImageBase64 || defaultCoverImage} sx={{ height: 194, width: '100%', objectFit: 'cover' }} />
            {enableToggle && (
              <IconButton
                onClick={() => setShowValues(!showValues)}
                sx={{ position: 'absolute', right: 10, top: 10, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 10, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.9)' } }}
              >
                {showValues ? <EyeSlashIcon size={20} color="white" /> : <EyeIcon size={20} color="white" />}
              </IconButton>
            )}
            <Box sx={{ position: 'relative', height: '85px', left: -25 }}>
              <Avatar src={logoImageBase64 || defaultLogoImg} sx={{ position: 'absolute', left: 50, top: -65, width: 110, height: 110, border: '6px solid white', backgroundColor: 'white' }} />
            </Box>
          </Box>
        </>
      )}
      showBanner
      footerProps={{ sx: { justifyContent: 'flex-end', alignItems: 'center', gap: 1.5 } }}
      headerContent={(
        <Box sx={{ width: '100%' }}>
          <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px', color: '#F3F3F6' }}>
            {t('developerAPIs.softwareStatementTitle')}
          </Typography>
        </Box>
      )}
      footerContent={(
        <Box sx={{ display: 'flex', justifyContent: isDeleteEnabled ? 'space-between' : 'flex-end', alignItems: 'center', gap: 1.5, width: '100%' }}>
          <Button className="delete-btn" variant="outlined" onClick={onClose} sx={{ minWidth: 120, textTransform: 'none' }}>
            {t('common.close')}
          </Button>
          {isDeleteEnabled && (
            <span>
              <Button className="delete-btn" variant="outlined" onClick={() => onDelete?.()} sx={{ minWidth: 120, textTransform: 'none' }}>
                {t('common.delete')}
              </Button>
            </span>
          )}
        </Box>
      )}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: '40px' }}>
        {organisationName && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" sx={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
              {organisationName}
              <VerifiedBadge trusted={trusted} />
            </Typography>
          </Box>
        )}
        {overview && (
          <>
            <Typography variant="subtitle1" mt={2}>
              {t('common.overView')}
            </Typography>
            <Typography variant="subtitle2" color="black" mt={0.5} sx={{ wordWrap: 'break-word' }}>
              {overview}
            </Typography>
          </>
        )}
        <Typography color="grey" mt={1} variant="subtitle1">
          {title}
        </Typography>
        <AttributeTable rows={displayRows} showValues={showValues} labelMinWidth={200} labelMaxPercent={40} />

        <IssuedExpiryStrip issued={metaIssued?.value} expiry={metaExpiry?.value} />
      </Box>
    </RightSidebar>
  );
};

export default SoftwareStatementModal;
