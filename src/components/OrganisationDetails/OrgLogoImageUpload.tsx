import React from 'react';
import { Box, Avatar } from '@mui/material';
import { apiService } from '@/lib/apiService/apiService';
import { GenericImageUpload } from '@/components/common/ImageUpload';
import { useQueryClient } from '@tanstack/react-query';
import { useGetLogoImage } from '@/custom-hooks/gettingStarted';

// Temporary default logo image
const defaultLogoImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

type Props = {
  editMode: boolean;
  handleEdit: () => void
};

const OrgLogoImageUpload = (props: Props) => {
  const {editMode, handleEdit } = props;
  const { data: logoImageBase64 = '' } = useGetLogoImage();
  const queryClient = useQueryClient();

  const myFile: { file: string; imagePreviewUrl: any } = {
    file: "",
    imagePreviewUrl: "",
  };

  const handleImageUpdate = async (file: File, _imageBase64: string) => {
    try {
      // Update the logo image directly with the file
      await apiService.updateLogoImage(file);

      // Update the UI by invalidating the React Query cache
      // This will trigger a refetch of the logo image everywhere it's used
      handleEdit();
      queryClient.invalidateQueries({ queryKey: ['logoImage'] });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  // No need for useEffect to load the logo - React Query handles this now

  return (
    <Box>
      <Box sx={{ position: 'relative', mt: { xs: '-85px', sm: '-100px' } }}>
        <Avatar
          variant="circular"
          src={!logoImageBase64 ? defaultLogoImg : logoImageBase64}
          alt="logo"
          sx={{
            width: '158px',
            height: '158px',
            // Use an outer ring via box-shadow to eliminate inner seam artifacts from CSS borders
            boxShadow: '0 0 0 6px #fff',
            bgcolor: '#fff',
          }}
        />
        <GenericImageUpload
          editMode={editMode}
          imageUrl={logoImageBase64 || ''}
          defaultImage={defaultLogoImg}
          onImageUpdate={handleImageUpdate}
          aspectRatio={1} // Square aspect ratio for logo
          minWidth={400}
          minHeight={400}
          recommendedSize="Recommended size is 400x400px"
          outputWidth={400}
          outputHeight={400}
          outputQuality={0.82}
          modalSize="medium"
          // Place overlay over the inner image area (exclude the white ring)
          containerStyle={{
            position: 'absolute',
            top: 6,
            left: 6,
            width: '146px',
            height: '146px',
            // Keep mounted at all times so Toast remains visible; disable interactions when not editing
            pointerEvents: editMode ? 'auto' : 'none'
          }}
          // Fully hide the overlay image to avoid any visual seams over the white border
          imageStyle={{ display: 'none' }}
          iconPosition={{ top: '45px', right: '45px' }}
          acceptedFileTypes="image/jpeg,image/jpg,image/png"
        />
      </Box>
    </Box>
  );
};

export default OrgLogoImageUpload;
