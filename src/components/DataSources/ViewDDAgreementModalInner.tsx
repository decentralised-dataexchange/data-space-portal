"use client";
import "./style.scss";
import React from "react";

import { Typography, Box, Avatar, Button, Tooltip, CircularProgress } from "@mui/material";

import { useTranslations } from "next-intl";
import { AttributeTable, AttributeRow } from "@/components/common/AttributeTable";
import { DDAPolicyCard } from "./dataPolicyCard";
import RightSidebar from "../common/RightSidebar";
import VerifiedBadge from "../common/VerifiedBadge";
import { useAppSelector } from "@/custom-hooks/store";
import JsonViewer from "@/components/common/JsonViewer";
import TagChips from "@/components/common/TagChips";

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
  drawerWidth?: number;
  signStatus?: 'sign' | 'unsign' | string;
  onSignClick?: () => void;
  signButtonLoading?: boolean;
  titleOverride?: string;
  showSignatureDecoded?: boolean;
}

export default function ViewDataAgreementModalInner(props: Props) {
  const { open, setOpen, mode, selectedData, dataSourceName, dataSourceLocation, dataSourceDescription, coverImage, logoImage, signStatus, onSignClick, signButtonLoading, showSignatureDecoded } = props;
  const t = useTranslations();
  const isVerified = Boolean(props.trusted);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  const tags = selectedData?.tags || [];

  const isUnsign = signStatus === 'unsign';
  const buttonLabel = isUnsign ? t('dataAgreements.unsignWithBusinessWallet') : t('dataAgreements.signWithBusinessWallet');
  const tooltipText = isAuthenticated
    ? buttonLabel
    : (isUnsign ? t('dataAgreements.loginToUnsignWithBusinessWallet') : t('dataAgreements.loginToSignWithBusinessWallet'));
  const handleSignButtonClick = () => {
    // Only trigger sign flow when authenticated; else keep disabled with tooltip
    if (!isAuthenticated) return;
    onSignClick && onSignClick();
  };
  const titleText = props.titleOverride ?? t('dataAgreements.viewModal.title');
  const usagePurposeDescription = selectedData?.purposeDescription?.trim()
    ? selectedData?.purposeDescription
    : dataSourceDescription;
  // Custom header content showing purpose, template ID and Version
  const headerContent = (
    <Box sx={{ width: "100%" }}>
      <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '16px' }}>
        {titleText}: {selectedData?.purpose}
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

  const openApiSpec = React.useMemo(() => {
    // 1) direct prop on selectedData
    const direct = (selectedData as any)?.openApiSpecification;
    if (direct) return direct;
    // 2) try parse selectedData.objectData as JSON and pick .openApiSpecification
    const objData = (selectedData as any)?.objectData;
    if (typeof objData === 'string') {
      try {
        const parsed = JSON.parse(objData);
        if (parsed && parsed.openApiSpecification) return parsed.openApiSpecification;
      } catch {}
    }
    // 3) try nested dataDisclosureAgreementTemplateRevision.objectData
    const rev = (selectedData as any)?.dataDisclosureAgreementTemplateRevision;
    const revObjData = rev?.objectData;
    if (typeof revObjData === 'string') {
      try {
        const parsed2 = JSON.parse(revObjData);
        if (parsed2 && parsed2.openApiSpecification) return parsed2.openApiSpecification;
      } catch {}
    }
    return undefined;
  }, [selectedData]);

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
        <Tooltip title={tooltipText} arrow>
          <span>
            <Button
              onClick={handleSignButtonClick}
              className="delete-btn"
              variant="outlined"
              sx={{
                textTransform: 'none',
                position: 'relative',
                '&.Mui-disabled': { opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'auto' }
              }}
              disabled={!isAuthenticated || Boolean(signButtonLoading)}
            >
              {signButtonLoading && (
                <CircularProgress
                  size={20}
                  sx={{
                    color: 'inherit',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-10px',
                    marginLeft: '-10px'
                  }}
                />
              )}
              <Box component="span" sx={{ visibility: signButtonLoading ? 'hidden' : 'visible' }}>
                {buttonLabel}
              </Box>
            </Button>
          </span>
        </Tooltip>
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
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: 1 }}>
            {dataSourceName || t('unknownOrganization')}
            <VerifiedBadge trusted={isVerified} />
          </Typography>
        </Box>
        {/* Access Point Endpoint removed from below avatar section */}
        <Typography variant="subtitle1" mt={2} sx={{ fontSize: '16px' }}>
          {t('common.usagePurpose')}
        </Typography>
        <Typography
          variant="body2"
          mt={0.5}
          sx={{ wordWrap: "break-word", fontSize: '14px' }}
        >
          {usagePurposeDescription}
        </Typography>

        {/* Tags section */}
        {tags.length > 0 && (
          <>
            <Typography mt={2} variant="subtitle1" sx={{ fontSize: '16px' }}>
              Tags
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TagChips tags={tags} />
            </Box>
          </>
        )}

        <Typography mt={2} variant="subtitle1" sx={{ fontSize: '16px' }}>
          {t('common.dataset')}
        </Typography>

        <Box sx={{ marginTop: '16px' }}>
          {(() => {
            const attrs = Array.isArray((selectedData as any)?.dataAttributes)
              ? (selectedData as any).dataAttributes
              : ((selectedData as any)?.personalData ?? []);
            const rows: AttributeRow[] = (attrs || []).map((a: any) => {
              const label = a?.name ?? a?.attributeName ?? '';
              const desc = a?.description ?? a?.attributeDescription ?? '';
              return { label, value: '', tooltip: null, description: desc } as AttributeRow;
            });
            return (
              <AttributeTable
                rows={rows}
                showValues={false}
                hideEmptyDash={true}
                labelMinWidth={200}
                labelMaxPercent={40}
                hideValueColumn={true}
                fullWidthLabel={true}
                renderLabelCell={(row) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5, minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ wordBreak: 'break-word', lineHeight: '20px', textWrap: 'nowrap' }}>
                      {row.label}
                    </Typography>
                    {row.description && (
                      <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '14px', lineHeight: '20px', wordBreak: 'break-word' }}>
                        {row.description}
                      </Typography>
                    )}
                  </Box>
                )}
              />
            );
          })()}
        </Box>

        {/* Embed the policy card directly instead of opening it as a separate modal */}

      {/* Open API Specification viewer */}
      {openApiSpec && (
        <>
          <Typography mt={2} variant="subtitle1" sx={{ fontSize: '16px' }}>
            {t('dataAgreements.openApiSpecification.title')}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <JsonViewer value={openApiSpec} height="600px" />
          </Box>
        </>
      )}

      <Box sx={{ marginTop: '16px', marginBottom: '16px' }}>
        <DDAPolicyCard
          selectedData={selectedData}
          handleCloseViewDDAModal={setOpen}
          dataSourceSignatureDecoded={showSignatureDecoded ? selectedData?.dataSourceSignatureDecoded : undefined}
          dataUsingServiceSignatureDecoded={showSignatureDecoded ? selectedData?.dataUsingServiceSignatureDecoded : undefined}
        />
      </Box>
    </Box>
  </RightSidebar>
);

}
