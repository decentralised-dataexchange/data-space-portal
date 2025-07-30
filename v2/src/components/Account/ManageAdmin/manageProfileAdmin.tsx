import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { defaultLogoImg } from "@/constants/defalultImages";


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

  return (
    <Box position="relative">
      {previewImage && (
        <img
          src={previewImage}
          alt="Admin profile preview"
          style={{
            position: "absolute",
            opacity: editMode ? 1 : 0,
            width: isMobile ? '110px' : '130px',
            height: isMobile ? '110px' : '130px',
            border: "solid white 6px",
            borderRadius:"50%",
            objectFit: "cover"
          }}
        />
      )}
      <img
        src={defaultLogoImg}
        alt="Admin profile"
        style={{
          position: "absolute",
          opacity: editMode ? 0.75 : 1,
          width: isMobile ? '110px' : '130px',
          height: isMobile ? '110px' : '130px',
          border: "solid white 6px",
          borderRadius:"50%",
          objectFit: "cover"
        }}
      />
      {editMode && (
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeImage}
          style={{
            position: "absolute",
            width: isMobile ? '110px' : '130px',
            height: isMobile ? '110px' : '130px',
            opacity: 0,
            cursor: "pointer",
            zIndex: 1
          }}
        />
      )}
    </Box>
  );
};

export default ManageAdminProfilePicUpload;
