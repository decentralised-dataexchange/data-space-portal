import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { apiService } from "@/lib/apiService/apiService";
import { useGetCoverImage, useUpdateCoverImage } from "@/custom-hooks/gettingStarted";
import { defaultCoverImage } from "@/constants/defalultImages";
import BannerCamera from "@/assets/img/camera_photo1.png";

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
  const { editMode, handleEdit, setCoverImageBase64 } = props;
  let coverImage = props.coverImageBase64 ? props.coverImageBase64 : localStorage.getItem('cachedCoverImage');

  // Use the update cover image mutation hook
  const { mutateAsync: updateCoverImage } = useUpdateCoverImage();
  
  const myFile: { file: string; imagePreviewUrl: any } = {
    file: "",
    imagePreviewUrl: "",
  };

  const handleFile = async (e: any) => {
    let reader = new FileReader();
    let file = e.target.files[0];
    
    reader.onloadend = () => {
      myFile.file = file;
      myFile.imagePreviewUrl = reader.result;
    };

    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      if (file) {
        formData.append('orgimage', file);
        
        // Update the cover image using the mutation hook
        await updateCoverImage(formData);
        
        // Get the updated cover image
        const imageBase64 = await apiService.getCoverImage();
        
        // Update state and local storage
        handleEdit();
        setCoverImageBase64(imageBase64);
        localStorage.setItem('cachedCoverImage', imageBase64);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  return (
    <BannerContainer>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            opacity: editMode ? 0.25 : 1,
          }}
          alt="Banner"
          src={!coverImage ? defaultCoverImage : coverImage}
        />
      </div>

      {editMode && (
        <Box style={{ position: "absolute", right: 20, top: 10 }}>
          <div>
            <form>
              <label className="uptext" htmlFor="uploadCoverImage">
                <Image
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
