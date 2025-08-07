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
  logoImageBase64: string | undefined;
  setLogoImageBase64: React.Dispatch<React.SetStateAction<any>>;
  handleEdit: () => void
};

const OrgLogoImageUpload = (props: Props) => {
  const {editMode, handleEdit, setLogoImageBase64 } = props;
  const { data: logoImageBase64 = '' } = useGetLogoImage();
  const queryClient = useQueryClient();

  const myFile: { file: string; imagePreviewUrl: any } = {
    file: "",
    imagePreviewUrl: "",
  };

  const handleImageUpdate = async (file: File, imageBase64: string) => {
    try {
      // Update the logo image directly with the file
      await apiService.updateLogoImage(file);

      // Update the UI by invalidating the React Query cache
      // This will trigger a refetch of the logo image everywhere it's used
      handleEdit();
      queryClient.invalidateQueries({ queryKey: ['logoImage'] });
      
      // We also update the parent component's state for immediate feedback
      // while the query refetches in the background
      setLogoImageBase64(imageBase64);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  // No need for useEffect to load the logo - React Query handles this now

  return (
    <Box>
      <Box style={{ position: 'relative' }}>
        <Avatar
          src={!logoImageBase64 ? defaultLogoImg : logoImageBase64}
          alt="logo"
          style={{
            opacity: editMode ? 0.75 : 1,
            marginTop: "-100px",
            width: "170px",
            height: "170px",
            border: "solid white 6px",
          }}
        />
        {editMode && (
          <GenericImageUpload
            editMode={editMode}
            imageUrl={logoImageBase64 || ''}
            defaultImage={defaultLogoImg}
            onImageUpdate={handleImageUpdate}
            aspectRatio={1} // Square aspect ratio for logo
            minWidth={400}
            minHeight={400}
            recommendedSize="Recommended size is 400x400px"
            containerStyle={{ position: 'absolute', top: 0, left: 0, width: '170px', height: '170px' }}
            iconPosition={{ top: '45px', right: '45px' }}
            acceptedFileTypes="image/jpeg,image/jpg,image/png,image/webp"
          />
        )}
      </Box>
    </Box>
  );
};

export default OrgLogoImageUpload;
