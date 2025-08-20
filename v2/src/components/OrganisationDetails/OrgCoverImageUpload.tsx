import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useUpdateCoverImage } from "@/custom-hooks/gettingStarted";
import { defaultCoverImage } from "@/constants/defalultImages";
import { GenericImageUpload } from "@/components/common/ImageUpload";
import { useQueryClient } from "@tanstack/react-query";

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
  handleEdit: () => void
};

const OrgCoverImageUpload = (props: Props) => {
  const { editMode, handleEdit } = props;

  // Use the update cover image mutation hook
  const { mutateAsync: updateCoverImage } = useUpdateCoverImage();
  const queryClient = useQueryClient();

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
      
      // Upload first
      const result = await updateCoverImage(formData);
      // Optimistically set the new cover image so UI updates immediately
      queryClient.setQueryData(['coverImage'], imageBase64 || '');
      // Invalidate in background to ensure fresh image is fetched
      queryClient.invalidateQueries({ queryKey: ['coverImage'] });
      console.log('Banner upload successful:', result);
      
      // Toggle edit mode; React Query invalidates cover image and updates UI
      handleEdit();
      
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
        imageUrl={props.coverImageBase64 || ''}
        defaultImage={defaultCoverImage}
        onImageUpdate={handleImageUpdate}
        aspectRatio={3} // 1500/500 = 3
        minWidth={1500}
        minHeight={500}
        recommendedSize="Recommended size is 1500x500px"
        outputWidth={1500}
        outputHeight={500}
        outputQuality={0.82}
        containerStyle={{ width: '100%', height: '100%' }}
        // Keep banner fully opaque in edit mode; avoid washed-out look
        imageStyle={{ opacity: 1 }}
      />
    </BannerContainer>
  );
};

export default OrgCoverImageUpload;
