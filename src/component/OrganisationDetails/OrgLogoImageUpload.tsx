import React from "react";
import { Avatar, Box } from "@mui/material";
import LogoCammera from "../../../public/img/camera_photo2.png";
import DefaultLogo from "../../../public/img/OrganisationDefaultLogo.png";
import { defaultLogoImg } from "../../utils/defalultImages";


type Props = {
  editMode: boolean;
  logoImageBase64: string | undefined;
  setLogoImageBase64: React.Dispatch<React.SetStateAction<any>>
};

const OrgLogoImageUpload = (props: Props) => {
  const {editMode, setLogoImageBase64 } = props
  let logoImageBase64 = localStorage.getItem('cachedLogoImage')

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
    <Box>
      <Avatar
        src={
          !logoImageBase64
            ? DefaultLogo
            : logoImageBase64
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
