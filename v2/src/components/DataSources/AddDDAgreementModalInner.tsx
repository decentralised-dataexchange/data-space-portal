"use client";

import "./style.scss";
import React from "react";
import { Drawer, Typography, Box, Avatar } from "@mui/material";
import { XIcon } from "@phosphor-icons/react";
import { useTranslations } from 'next-intl';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  coverImage: string;
  logoImage: string;
  orgName: string;
  orgOverview: string;
}

export default function AddDDAgreementModalInner({ open, setOpen, coverImage, logoImage, orgName, orgOverview }: Props) {
  const t = useTranslations();
  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)} className="drawer-dda">
      <Box className="dd-modal-container">
        <Box className="dd-modal-header">
          <Box pl={2} style={{ width: "90%" }}>
            <Typography className="dd-modal-header-text">
              {t('addDataDisclosureAgreement')}
            </Typography>
          </Box>
          <XIcon
            size={24}
            onClick={() => setOpen(false)}
          />
        </Box>
        <Box className="dd-modal-banner-container">
          <Box
            sx={{
              height: "150px",
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
          >
            {!coverImage && 
              <Typography variant="body1" className="no-banner-text">
                {t('noBannerImageAvailable')}
              </Typography>
            }
          </Box>
        </Box>
        <Box sx={{ marginBottom: "60px" }}>
          <Avatar
            src={logoImage}
            sx={{
              position: "absolute",
              marginLeft: 50,
              marginTop: "-65px",
              width: "110px",
              height: "110px",
              border: "solid white 6px",
            }}
          />
        </Box>
        <Box className="dd-modal-details" sx={{ paddingBottom: "80px" }}>
          <Box p={1.5}>
            <Typography variant="h6" fontWeight="bold">
              {orgName}
            </Typography>
            <Typography color="#9F9F9F" sx={{ mt: 1 }}>
              {/* Optional location or subtitle */}
            </Typography>
            <Typography variant="subtitle1" mt={3}>
              {t('overview')}
            </Typography>
            <Typography
              variant="subtitle2"
              color="#9F9F9F"
              mt={1}
              sx={{ wordWrap: "break-word" }}
            >
              {orgOverview}
            </Typography>
          </Box>
          <Box className="modal-footer"></Box>
        </Box>
      </Box>
    </Drawer>
  );
}
