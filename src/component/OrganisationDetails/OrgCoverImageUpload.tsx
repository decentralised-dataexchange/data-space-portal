import React, { useEffect, useState } from "react";
import BannerCamera from "../../../public/img/camera_photo1.png";
import DefaultBanner from "../../../public/img/OrganisationDefaultLogo.png";
import { defaultCoverImage } from '../../utils/defalultImages';
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "mui-image";
import { useAppDispatch, useAppSelector } from "../../customHooks";
import { doApiPutImage } from "../../utils/fetchWrapper";
import { ENDPOINTS } from "../../utils/apiEndpoints";
import { HttpService } from "../../service/HttpService";
import { adminAction } from "../../redux/actionCreators/login";

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
  handleEdit: () => void
};

const OrgCoverImageUpload = (props: Props) => {
  const { editMode, handleEdit, setCoverImageBase64, coverImageBase64 } = props;
  let coverImage = coverImageBase64 ? coverImageBase64 : localStorage.getItem('cachedCoverImage')

  const myFile: { file: string; imagePreviewUrl: any } = {
    file: "",
    imagePreviewUrl: "",
  };

  const handleFile = async (e: any) => {
    let reader = new FileReader();
    let file = e.target.files[0];
    let image = /image.jpeg/;
    reader.onloadend = () => {
      myFile.file = file;
      myFile.imagePreviewUrl = reader.result;
    };

    // if (file.type.match(image)) {
      reader.readAsDataURL(file);

      const formData = new FormData();
      file && formData.append('orgimage', file);
      const url = ENDPOINTS.getCoverImage();
      HttpService.updateOrganisationCoverImage(formData)
        .then((res) => {
          HttpService.getCoverImage().then((imageBase64) => {
            handleEdit();
            setCoverImageBase64(imageBase64);
            localStorage.setItem('cachedCoverImage', imageBase64)
          });
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        });
  };

  return (
    <BannerContainer>
      <Image
        height="100%"
        width="100%"
        alt="Banner"
        fit="cover"
        duration={0}
        style={{ opacity: editMode ? 0.25 : 1, transitionDuration: "0ms" }}
        src={
          !coverImage
            ? defaultCoverImage
            : coverImage
        }
      />

      {editMode && (
        <Box style={{ position: "absolute", right: 20, top: 10 }}>
          <div>
            <form>
              <label className="uptext" htmlFor="uploadCoverImage">
                <img
                  style={{
                    opacity: 0.45,
                  }}
                  src={BannerCamera}
                  alt="editcover"
                />
              </label>
              <input
                type="file"
                id="uploadCoverImage"
                name="uploadCoverImage"
                accept="image/jpeg,image/jpg"
                hidden={true}
                onChange={handleFile}
              />
            </form>
          </div>
        </Box>
      )}
    </BannerContainer>
  );
};

export default OrgCoverImageUpload;
