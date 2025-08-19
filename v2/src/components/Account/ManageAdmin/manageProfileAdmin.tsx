"use client";

import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { defaultLogoImg } from "@/constants/defalultImages";
import { LocalStorageService } from "@/utils/localStorageService";
import { GenericImageUpload } from "@/components/common/ImageUpload";
import { useUpdateAdminAvatar } from "@/custom-hooks/manageAdmin";


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
    setFormDataForImageUpload,
    previewImage,
    setPreviewImage,
    logoImageBase64
  } = props;

  const updateAdminAvatarMutation = useUpdateAdminAvatar();

  // Image selection and upload are handled by GenericImageUpload

  const handleImageUpdate = async (file: File, imageBase64: string) => {
    const formData = new FormData();
    formData.append("avatarimage", file);
    await updateAdminAvatarMutation.mutateAsync(formData);
    setPreviewImage(imageBase64);
    LocalStorageService.updateProfilePic(imageBase64);
    setFormDataForImageUpload("");
  };

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
      <GenericImageUpload
        editMode={editMode}
        imageUrl={baseAvatar}
        defaultImage={defaultLogoImg}
        onImageUpdate={handleImageUpdate}
        aspectRatio={1}
        minWidth={256}
        minHeight={256}
        recommendedSize="Recommended size is 256x256px"
        outputWidth={256}
        outputHeight={256}
        outputQuality={0.82}
        modalSize="medium"
        containerStyle={{
          position: 'absolute',
          top: `${whiteRing}px`,
          left: `${whiteRing}px`,
          width: `${innerSize}px`,
          height: `${innerSize}px`,
          pointerEvents: editMode ? 'auto' : 'none'
        }}
        imageStyle={{ display: 'none' }}
        iconPosition={{ top: `${iconOffset}px`, right: `${iconOffset}px` }}
        acceptedFileTypes="image/jpeg,image/jpg,image/png"
      />
    </Box>
  );
};

export default ManageAdminProfilePicUpload;
