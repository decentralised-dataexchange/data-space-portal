"use client";

import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { defaultLogoImg } from "@/constants/defalultImages";
import { LocalStorageService } from "@/utils/localStorageService";


type Props = {
  editMode: boolean;
  logoImageBase64: string;
  setLogoImageBase64: Dispatch<SetStateAction<string>>;
  setFormDataForImageUpload: any;
  previewImage: any;
  setPreviewImage: any;
};

const ManageAdminProfilePicUpload = (props: Props) => {
  const {
    editMode,
    previewImage,
    logoImageBase64
  } = props;

  // Use MUI breakpoints instead of getDevice
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const avatarSize = isMobile ? 110 : 130;
  const whiteRing = 6; // matches border width used below
  const innerSize = avatarSize - whiteRing * 2;
  const iconRatioFromEdges = 45 / 158; // exact ratio from OrgLogoImageUpload (45px of 158px)
  // Use exact tuned offsets for our two sizes to match visual parity
  const tunedOffset = innerSize === 98 ? 28 : (innerSize === 118 ? 34 : Math.round(innerSize * iconRatioFromEdges));
  const iconOffset = tunedOffset;
  const baseAvatar = previewImage || logoImageBase64 || LocalStorageService.getUserProfilePic() || defaultLogoImg;

  return (
    <Box position="relative" sx={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}>
      {previewImage && (
        <img
          src={previewImage}
          alt="Admin profile preview"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: editMode ? 1 : 0,
            width: `${avatarSize}px`,
            height: `${avatarSize}px`,
            boxShadow: `0 0 0 ${whiteRing}px #fff`,
            borderRadius:"50%",
            objectFit: "cover",
            backgroundColor: "#fff",
          }}
        />
      )}
      <img
        src={baseAvatar}
        alt="Admin profile"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: editMode ? 0.75 : 1,
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          boxShadow: `0 0 0 ${whiteRing}px #fff`,
          borderRadius:"50%",
          objectFit: "cover",
          backgroundColor: "#fff",
        }}
      />
      {/* Avatar image upload is disabled - pencil icon hidden */}
    </Box>
  );
};

export default ManageAdminProfilePicUpload;
