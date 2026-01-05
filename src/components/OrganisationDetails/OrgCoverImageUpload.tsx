import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useUpdateCoverImage } from "@/custom-hooks/gettingStarted";
import { defaultCoverImage } from "@/constants/defalultImages";
import { GenericImageUpload } from "@/components/common/ImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  // Use the update cover image mutation hook
  const { mutateAsync: updateCoverImage } = useUpdateCoverImage();
  const queryClient = useQueryClient();

  const handleImageUpdate = async (file: File, imageBase64: string): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('orgimage', file);

      await updateCoverImage(formData);
      // Optimistically set the new cover image so UI updates immediately
      queryClient.setQueryData(['coverImage'], imageBase64 || '');
      // Invalidate in background to ensure fresh image is fetched
      queryClient.invalidateQueries({ queryKey: ['coverImage'] });

      // Toggle edit mode; React Query invalidates cover image and updates UI
      if (editMode) {
        handleEdit();
      }
    } catch (error) {
      console.error('Error updating cover image:', error);
      throw error;
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
        recommendedSize={t('imageUpload.recommendedCoverSize')}
        outputWidth={1500}
        outputHeight={500}
        outputQuality={0.82}
        containerStyle={{ width: '100%', height: '100%' }}
        // Keep banner fully opaque in edit mode; avoid washed-out look
        imageStyle={{ opacity: 1 }}
        alwaysShowIcon
      />
    </BannerContainer>
  );
};

export default OrgCoverImageUpload;
