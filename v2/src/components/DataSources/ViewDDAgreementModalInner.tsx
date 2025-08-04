"use client";
import "./style.scss";
import React from "react";

import { Typography, Box, Avatar, Button } from "@mui/material";

import { useTranslations } from "next-intl";
import { DataAttributeCardForDDA } from "./dataAttributeCardForDDA";
import { DDAPolicyCard } from "./dataPolicyCard";
import RightSidebar from "../common/RightSidebar";
import VerifiedBadge from "../common/VerifiedBadge";

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
}

export default function ViewDataAgreementModalInner(props: Props) {
  const { open, setOpen, mode, selectedData, dataSourceName, dataSourceLocation, dataSourceDescription, coverImage, logoImage } = props;
  const t = useTranslations();

  // Custom header content showing purpose and template ID
  const headerContent = (
    <Box sx={{ width: "100%" }}>
      <Typography className="dd-modal-header-text" noWrap sx={{ fontSize: '20px' }}>
        {selectedData?.purpose}
      </Typography>
      {mode !== "Create" && (
        <Typography color="#F3F3F6" variant="body2" noWrap>
          {selectedData?.templateId}
        </Typography>
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
      <Box sx={{ position: "relative", height: '65px' }}>
        <Avatar
          src={logoImage}
          style={{
            position: "absolute",
            left: 50,
            top: -65,
            width: "110px",
            height: "110px",
            border: "solid white 6px",
          }}
        />
      </Box>
    </>
  );

  // Footer content with action buttons
  const footerContent = (
    <>
      {mode === "public" && (
        <Button
          onClick={() => {
            navigator.clipboard.writeText(selectedData?.connection?.invitationUrl);
          }}
          sx={{
            marginRight: "auto",
            color: "black",
          }}
          variant="text"
        >
          {t("dataAgreements.copyConnection")}
        </Button>
      )}
      <Button
        onClick={() => {
          setOpen(false);
        }}
        className="delete-btn"
        sx={{
          color: "black",
          "&:hover": {
            backgroundColor: "black",
            color: "white",
          },
        }}
        variant="outlined"
      >
        {t("common.close")}
      </Button>
    </>
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
      width={594}
    >
      <Box sx={{ marginTop: '20px' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '20px' }}>
            {dataSourceName || 'Unknown Organization'}
          </Typography>
        </Box>
        <Typography color="black" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingTop: "3px" }}>
          Trusted Service Provider
          <VerifiedBadge trusted={true} />
        </Typography>
        <Typography variant="subtitle1" mt={2}>
          {"OVERVIEW"}
        </Typography>
        <Typography
          variant="subtitle2"
          color="black"
          mt={0.5}
          sx={{ wordWrap: "break-word" }}
        >
          {dataSourceDescription}
        </Typography>

        <Typography color="black" mt={2} variant="subtitle1">
          {"DATASET"}
        </Typography>

        <Box sx={{ marginTop: '16px' }}>
          <DataAttributeCardForDDA selectedData={selectedData} />
        </Box>

        {/* Embed the policy card directly instead of opening it as a separate modal */}
        <Box sx={{ marginTop: '16px', marginBottom: '16px' }}>
          <DDAPolicyCard
            selectedData={selectedData}
            handleCloseViewDDAModal={setOpen}
          />
        </Box>
      </Box>
    </RightSidebar>
  );
}
