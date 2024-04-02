import React from "react";
import BannerCamera from "../../../public/img/camera_photo1.png";
import DefaultBanner from "../../../public/img/OrganisationDefaultLogo.png";
import { defaultCoverImage } from '../../utils/defalultImages';
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "mui-image";

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

  const handleFile = async (e: any) => {
    let reader = new FileReader();
    let file = e.target.files[0];
    let image = /image.jpeg/;

    reader.onloadend = () => {
      myFile.file = file;
      myFile.imagePreviewUrl = reader.result;
    };
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
          !coverImageBase64
            ? defaultCoverImage
            : DefaultBanner
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
