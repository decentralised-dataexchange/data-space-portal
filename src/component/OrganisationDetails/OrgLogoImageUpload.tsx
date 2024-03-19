import React from 'react';
import { Avatar, Box } from "@mui/material";
import BannerCamera from "../../../public/img/camera_photo1.png";


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

  return (
    <Box>
      <Avatar
        src={
          !editMode
            ? `data:image/jpeg;charset=utf-8;base64,${logoImageBase64}`
            : BannerCamera
        }
        alt="logo"
        style={{
          opacity: editMode ? 0.75 : 1,
          marginTop: "-100px",
          width: "170px",
          height: "170px",
          border: "solid white 6px",
        }}
        className='logoContainer'
      />
      {editMode && (
        <Box style={{ position: "absolute", right: 20, top: 165 }}>
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
                // onChange={handleFile}
              />
            </form>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default OrgLogoImageUpload;
