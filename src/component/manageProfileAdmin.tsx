import React from "react";
import { Box } from "@mui/material";
import LogoCamera from "../../public/img/camera_photo2.png";
import { Dispatch, SetStateAction } from "react";
import { getDevice  } from "../utils/utils";
import { defaultLogoImg } from "../utils/defalultImages";


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
    setFormDataForImageUpload,
    previewImage,
    setPreviewImage,
    logoImageBase64
  } = props;

//   let Avatar = LocalStorageService.getUserProfilePic();

  const myFile: { file: string; imagePreviewUrl: any } = {
    file: "",
    imagePreviewUrl: "",
  };

  const handleChangeImage = async (e: any) => {
    let reader = new FileReader();
    let file = e.target.files[0];

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

  const { isMobile } = getDevice()

  return (
    <>
      {previewImage && (
        <img
          src={previewImage}
          style={{
            position: "absolute",
            opacity: props.editMode ? 1 : 0,
            width: isMobile ? '110px' : '130px',
            height: isMobile ? '110px' : '130px',
            border: "solid white 6px",
            borderRadius:"50%"
          }}
        />
      )}
      <img
        src={
          defaultLogoImg
        }
        style={{
          position: "absolute",
          opacity: props.editMode ? 0.75 : 1,
          width: isMobile ? '110px' : '130px',
            height: isMobile ? '110px' : '130px',
          border: "solid white 6px",
          borderRadius:"50%"
        }}
      />
    </>
  );
};

export default ManageAdminProfilePicUpload;
