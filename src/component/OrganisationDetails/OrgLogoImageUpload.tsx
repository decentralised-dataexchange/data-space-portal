import React from 'react';
import { Avatar, Box } from "@mui/material";


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
          logoImageBase64
            ? `data:image/jpeg;charset=utf-8;base64,${logoImageBase64}`
            : ''
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
                  src={''}
                  alt="img"
                />
              </label>
              <input
                type="file"
                accept="image/jpeg,image/jpg"
                id="uploadLogoImage"
                name="uploadLogoImage"
                hidden={true}
                onChange={() => {}}
              />
            </form>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default OrgLogoImageUpload;
