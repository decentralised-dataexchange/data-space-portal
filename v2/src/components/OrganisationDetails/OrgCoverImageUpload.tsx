import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { apiService } from "@/lib/apiService/apiService";
import { useGetCoverImage, useUpdateCoverImage } from "@/custom-hooks/gettingStarted";
import { defaultCoverImage } from "@/constants/defalultImages";
import { GenericImageUpload } from "@/components/common/ImageUpload";

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

  const handleImageUpdate = async (file: File, imageBase64: string): Promise<void> => {
    try {
      console.log('Starting banner image upload...');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      const formData = new FormData();
      formData.append('orgimage', file);
      
      console.log('Form data prepared successfully');
      console.log('Using endpoint:', '/config/data-source/coverimage/');
      
      // Simple approach - just call the mutation directly
      const result = await updateCoverImage(formData);
      console.log('Banner upload successful:', result);
      
      // Update state and local storage
      handleEdit();
      setCoverImageBase64(imageBase64);
      localStorage.setItem('cachedCoverImage', imageBase64);
      
      console.log('Banner image update completed successfully');
      // Don't return the result, just complete the Promise<void>
    } catch (error) {
      console.error('Error updating cover image:', error);
      throw error; // Re-throw to allow modal to handle the error
    }
  };

  return (
    <BannerContainer>
      <GenericImageUpload
        editMode={editMode}
        imageUrl={coverImage || ''}
        defaultImage={defaultCoverImage}
        onImageUpdate={handleImageUpdate}
        aspectRatio={3} // 1500/500 = 3
        minWidth={1500}
        minHeight={500}
        recommendedSize="Recommended size is 1500x500px"
        containerStyle={{ width: '100%', height: '100%' }}
      />
    </BannerContainer>
  );
};

export default OrgCoverImageUpload;
