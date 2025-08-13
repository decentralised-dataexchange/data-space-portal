import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { defaultLogoImg } from "@/constants/defalultImages";
import { LocalStorageService } from "@/utils/localStorageService";
import { PencilSimpleIcon } from "@phosphor-icons/react";


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

  const myFile: { file: string; imagePreviewUrl: any } = {
    file: "",
    imagePreviewUrl: "",
  };

  const handleChangeImage = async (e: any) => {
    const reader = new FileReader();
    const file = e.target.files[0];

    if (file && file.type && file.type.startsWith("image/")) {
      reader.onloadend = () => {
        myFile.file = file;
        myFile.imagePreviewUrl = reader.result;
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("avatarimage", file);
      setFormDataForImageUpload(formData);
    }
  };

  // Use MUI breakpoints instead of getDevice
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
      {editMode && (
        <Box sx={{ position: 'absolute', top: `${whiteRing}px`, left: `${whiteRing}px`, width: `${innerSize}px`, height: `${innerSize}px`, pointerEvents: 'none' }}>
          <Box
            sx={{
              position: 'absolute',
              top: `${iconOffset}px`,
              right: `${iconOffset}px`,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              pointerEvents: 'none',
              transform: 'translate(50%, -50%)'
            }}
          >
            <PencilSimpleIcon size={20} color="#fff" />
          </Box>
        </Box>
      )}
      {editMode && (
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeImage}
          aria-label="Upload profile picture"
          title="Upload profile picture"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${avatarSize}px`,
            height: `${avatarSize}px`,
            opacity: 0,
            cursor: "pointer",
            zIndex: 3
          }}
        />
      )}
    </Box>
  );
};

export default ManageAdminProfilePicUpload;
