import React, { useEffect } from "react";
import { Avatar, Box } from "@mui/material";
import LogoCammera from "../../../public/img/camera_photo2.png";
import DefaultLogo from "../../../public/img/OrganisationDefaultLogo.png";
import { defaultLogoImg } from "../../utils/defalultImages";
import { useAppSelector } from "../../customHooks";
import { ENDPOINTS } from "../../utils/apiEndpoints";
import { doApiPutImage } from "../../utils/fetchWrapper";


type Props = {
  editMode: boolean;
  logoImageBase64: string | undefined;
  setLogoImageBase64: React.Dispatch<React.SetStateAction<any>>
};

const OrgLogoImageUpload = (props: Props) => {
  const {editMode, setLogoImageBase64 } = props;

  const imagesSet = useAppSelector(
    (state) => state?.gettingStart?.imageSet
  )

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
      const url = ENDPOINTS.getLogoImage();
      doApiPutImage(url, formData);
    // }
  };

  return (
    <Box>
      <Avatar
        src={
          !imagesSet?.logo
            ? defaultLogoImg
            : imagesSet?.logo
        }
        alt="logo"
        style={{
          // position: "absolute",
          opacity: editMode ? 0.75 : 1,
          marginTop: "-100px",
          width: "170px",
          height: "170px",
          border: "solid white 6px",
        }}
      />
      {editMode && (
        <Box
          style={{
            position: "relative",
            top: "-160px",
            marginLeft: "10px",
          }}
        >
          <div>
            <form>
              <label className="uptext" htmlFor="uploadLogoImage">
                <img
                  style={{
                    opacity: 0.45,
                  }}
                  src={LogoCammera}
                  alt="img"
                />
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                id="uploadLogoImage"
                name="uploadLogoImage"
                hidden={true}
                onChange={handleFile}
              />
            </form>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default OrgLogoImageUpload;
