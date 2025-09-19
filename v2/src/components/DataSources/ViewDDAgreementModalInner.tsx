"use client";
import "./style.scss";
import React from "react";

import { Typography, Box, Avatar, Button, Tooltip, Link as MuiLink } from "@mui/material";

import { useTranslations } from "next-intl";
import { AttributeTable, AttributeRow } from "@/components/common/AttributeTable";
import { DDAPolicyCard } from "./dataPolicyCard";
import RightSidebar from "../common/RightSidebar";
import VerifiedBadge from "../common/VerifiedBadge";
import IssuedExpiryStrip from "../common/IssuedExpiryStrip";
import { isOrganisationVerified } from "@/utils/verification";
import { useAppSelector } from "@/custom-hooks/store";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: string;
  selectedData: any;
  dataSourceName: any;
  dataSourceLocation: any;
  dataSourceDescription: any;
  coverImage: any;
  logoImage: any;
  trusted?: boolean;
  accessPointEndpoint?: string;
  showAccessPointEndpoint?: boolean;
  drawerWidth?: number;
}

export default function ViewDataAgreementModalInner(props: Props) {
  const { open, setOpen, mode, selectedData, dataSourceName, dataSourceLocation, dataSourceDescription, coverImage, logoImage, accessPointEndpoint } = props;
  const t = useTranslations();
  const isVerified =
    typeof props.trusted === 'boolean'
      ? props.trusted
      : isOrganisationVerified(selectedData as any);
  // Custom header content showing purpose, template ID and Version
  const headerContent = (
    <Box sx={{ width: "100%" }}>
      <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px' }}>
        {t('dataAgreements.viewModal.title')}: {selectedData?.purpose}
      </Typography>
      {mode !== "Create" && (
        <>
          <Typography color="#F3F3F6" variant="body2" noWrap sx={{ fontSize: '12px' }}>
            {selectedData?.templateId}
          </Typography>
        </>
      )}
    </Box>
  );

  // Banner content with cover image and organization logo
  const bannerContent = (
    <>
      <Box
        style={{
          height: "194px",
          width: "100%",
          backgroundImage: coverImage ? `url(${coverImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: coverImage ? 'transparent' : '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px'
        }}
        component="div"
      />
      <Box sx={{ position: "relative", height: '65px', left: -25 }}>
        <Avatar
          src={logoImage}
          style={{
            position: "absolute",
            left: 50,
            top: -65,
            width: "110px",
            height: "110px",
            border: "solid white 6px",
            backgroundColor: "white",
          }}
        />
      </Box>
    </>
  );

  // Footer content with action buttons
  const footerContent = (
    <Box sx={{
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    }}>
      <Button
        onClick={() => {
          setOpen(false);
        }}
        className="delete-btn"
        variant="outlined"
      >
        {t("common.close")}
      </Button>
      {mode === "public" && (
        <Button
          onClick={() => {
            navigator.clipboard.writeText(selectedData?.connection?.invitationUrl);
          }}
          className="delete-btn"
          variant="outlined"
        >
          {t("dataAgreements.signWithBusinessWallet")}
        </Button>
      )}
    </Box>
  );

  return (
    <RightSidebar
      open={open}
      onClose={(_, reason) => setOpen(false)}
      headerContent={headerContent}
      bannerContent={bannerContent}
      showBanner={true}
      footerContent={footerContent}
      className="drawer-dda"
      width={props.drawerWidth ?? 580}
      maxWidth={props.drawerWidth ?? 580}
    >
      <Box sx={{ marginTop: '20px', paddingBottom: '70px' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
            {dataSourceName || t('unknownOrganization')}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingTop: "3px", color: isVerified ? '#2e7d32' : '#d32f2f' }}>
          {isVerified ? t('common.trustedServiceProvider') : t('common.untrustedServiceProvider')}
          <VerifiedBadge trusted={isVerified} />
        </Typography>
        {/* Access Point Endpoint row under trust/untrust label (single line, truncated with tooltip) */}
        {(props.showAccessPointEndpoint ?? true) && accessPointEndpoint && (
          <Box sx={{ mt: 0.5, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 1fr' }, alignItems: 'center', columnGap: 2 }}>
            <Typography variant="subtitle2" sx={{ lineHeight: '20px', height: '20px' }}>
              {t('developerAPIs.accessPointEndpointLabel')}
            </Typography>
            <Tooltip title={accessPointEndpoint} placement="top-start" arrow>
              <MuiLink
                href={accessPointEndpoint}
                target="_blank"
                rel="noreferrer"
                underline="hover"
                sx={{
                  color: '#0000FF',
                  display: 'block',
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {accessPointEndpoint}
              </MuiLink>
            </Tooltip>
          </Box>
        )}
        <Typography variant="subtitle1" mt={2} sx={{ fontSize: '16px' }}>
          {t('common.usagePurpose')}
        </Typography>
        <Typography
          variant="body2"
          mt={0.5}
          sx={{ wordWrap: "break-word", fontSize: '14px' }}
        >
          {dataSourceDescription}
        </Typography>

        <Typography mt={2} variant="subtitle1" sx={{ fontSize: '16px' }}>
          {t('common.dataset')}
        </Typography>

        <Box sx={{ marginTop: '16px' }}>
          {(() => {
            const attrs = Array.isArray((selectedData as any)?.dataAttributes)
              ? (selectedData as any).dataAttributes
              : ((selectedData as any)?.personalData ?? []);
            const rows: AttributeRow[] = (attrs || []).map((a: any) => ({ label: a?.name ?? a?.attributeName ?? '', value: '' }));
            return (
              <AttributeTable rows={rows} showValues={true} hideEmptyDash={true} labelMinWidth={200} labelMaxPercent={40} />
            );
          })()}
        </Box>

        {/* Embed the policy card directly instead of opening it as a separate modal */}
        <Box sx={{ marginTop: '16px', marginBottom: '16px' }}>
          <DDAPolicyCard
            selectedData={selectedData}
            handleCloseViewDDAModal={setOpen}
          />
        </Box>

        {/* Issued/Expiry footer strip below the last card */}
        <IssuedExpiryStrip issued={(selectedData as any)?.createdAt} expiry={(selectedData as any)?.updatedAt} />
      </Box>
    </RightSidebar>
  );
}
