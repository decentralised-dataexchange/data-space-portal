import React, { useEffect, useState } from "react";
import { Avatar, Box } from "@mui/material";
import LogoCammera from "../../../public/img/camera_photo2.png";
import DefaultLogo from "../../../public/img/OrganisationDefaultLogo.png";
import { defaultLogoImg } from "../../utils/defalultImages";
import { useAppSelector } from "../../customHooks";
import { ENDPOINTS } from "../../utils/apiEndpoints";
import { doApiPutImage } from "../../utils/fetchWrapper";
import { HttpService } from "../../service/HttpService";


type Props = {
  editMode: boolean;
  logoImageBase64: string | undefined;
  setLogoImageBase64: React.Dispatch<React.SetStateAction<any>>
};

const OrgLogoImageUpload = (props: Props) => {
  const {editMode } = props;
  const [ imageBase64, setLogoImageBase64] = useState('')

  const imagesSet = useAppSelector(
    (state) => state?.gettingStart?.imageSet
  )

  useEffect(() => {
    setLogoImageBase64(imagesSet?.logo)
  }, [imagesSet]);

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

      const formData = new FormData();
      file && formData.append('orgimage', file);
      HttpService.updateOrganisationLogoImage(formData)
        .then((res) => {
          console.log(res, "res")
          // Get the newly uploaded image from the server
          HttpService.getLogoImage().then((imageBase64) => {
            localStorage.getItem('cachedLogoImage');
            setLogoImageBase64(imageBase64);
            localStorage.getItem('cachedLogoImage');
          });
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        });
  };

  return (
    <Box>
      <Avatar
        src={
          !imageBase64
            ? defaultLogoImg
            : imageBase64
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
