import React, { useEffect } from "react";
import { Avatar, Box } from "@mui/material";
import { apiService } from "@/lib/apiService/apiService";

// Import camera icon as string path
const LogoCammera = "/img/camera_photo2.png";

// Temporary default logo image
const defaultLogoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";


type Props = {
  editMode: boolean;
  logoImageBase64: string | undefined;
  setLogoImageBase64: React.Dispatch<React.SetStateAction<any>>;
  handleEdit: () => void
};

const OrgLogoImageUpload = (props: Props) => {
  const {editMode, handleEdit, setLogoImageBase64, logoImageBase64: propLogoImage } = props;
  const logoImageBase64 = propLogoImage || localStorage.getItem('cachedLogoImage');

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
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      file && formData.append('orgimage', file);
      
      // Update the logo image
      await apiService.updateOrganisationLogoImage(formData);
      
      // Get the newly uploaded image from the server
      const imageBase64 = await apiService.getLogoImage();
      
      handleEdit();
      setLogoImageBase64(imageBase64);
      localStorage.setItem('cachedLogoImage', imageBase64);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  useEffect(() => {
    const cachedImage = localStorage.getItem('cachedLogoImage');
    if (cachedImage) {
      setLogoImageBase64(cachedImage);
    } else {
      const fetchLogoImage = async () => {
        try {
          const imageBase64 = await apiService.getLogoImage();
          setLogoImageBase64(imageBase64);
          localStorage.setItem('cachedLogoImage', imageBase64);
        } catch (error) {
          console.log(`Error fetching logo image: ${error}`);
        }
      };
      fetchLogoImage();
    }
  }, []);

  return (
    <Box>
      <Avatar
        src={
          !logoImageBase64
            ? defaultLogoImg
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
