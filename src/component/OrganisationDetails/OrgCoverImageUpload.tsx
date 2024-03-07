import React from 'react';
import { styled } from "@mui/material/styles";

const BannerContainer = styled("div")({
  height: 200,
  width: "100%",
  borderRadius: 2,
  backgroundColor: "#E6E6E6",
  marginTop: "1em",
  position: "relative",
  top: 0,
  left: 0,
});

type Props = {
  editMode: boolean;
  coverImageBase64: string | undefined;
  setCoverImageBase64: React.Dispatch<React.SetStateAction<any>>;
};

const OrgCoverImageUpload = (props: Props) => {
  const { editMode, setCoverImageBase64 } = props;

  let coverImageBase64 = localStorage.getItem('cachedCoverImage')
  const myFile: { file: string; imagePreviewUrl: any } = {
    file: "",
    imagePreviewUrl: "",
  };


  return (
    <BannerContainer>
      <img
        height="100%"
        width="100%"
        alt="Banner"
        fit="cover"
        duration={0}
        style={{ opacity: editMode ? 0.25 : 1, transitionDuration: "0ms" }}
        src={
          coverImageBase64
            ? `data:image/jpeg;charset=utf-8;base64,${coverImageBase64}`
            : ''
        }
      />
    </BannerContainer>
  );
};

export default OrgCoverImageUpload;
