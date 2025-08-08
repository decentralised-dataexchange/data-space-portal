import React, { useState, useRef } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import ImageCropModal from './ImageCropModal';
import { useDispatch, useSelector } from 'react-redux';
import { setError, setMessage } from '@/store/reducers/authReducer';

interface GenericImageUploadProps {
  editMode: boolean;
  imageUrl: string;
  defaultImage: string;
  onImageUpdate: (file: File, imageBase64: string) => Promise<void>;
  aspectRatio: number;
  minWidth: number;
  minHeight: number;
  recommendedSize: string;
  // Optional explicit output dimensions and quality for the optimized upload
  outputWidth?: number;
  outputHeight?: number;
  outputQuality?: number; // 0-1 (default handled in modal)
  // Optional modal size variant
  modalSize?: 'small' | 'medium' | 'large' | 'full';
  containerStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  iconPosition?: {
    top: string;
    right: string;
  };
  acceptedFileTypes?: string;
}

const GenericImageUpload: React.FC<GenericImageUploadProps> = ({
  editMode,
  imageUrl,
  defaultImage,
  onImageUpdate,
  aspectRatio,
  minWidth,
  minHeight,
  recommendedSize,
  outputWidth,
  outputHeight,
  outputQuality,
  containerStyle,
  imageStyle,
  iconPosition = { top: '24px', right: '24px' },
  modalSize,
  acceptedFileTypes = 'image/jpeg,image/jpg,image/png'
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  
  // Get error state from Redux for toast display
  const error = useSelector((state: any) => state.auth.error);
  const message = useSelector((state: any) => state.auth.message);

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Open the modal directly instead of clicking the file input
    // Reset any previously selected image so the modal starts clean
    setSelectedImage(null);
    setModalOpen(true);
  };

  // Handle file selection from the modal's browse button
  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Check image dimensions before proceeding with cropping
      const img = new Image();
      img.onload = () => {
        if (img.width < minWidth || img.height < minHeight) {
          // Show toast for invalid size
          dispatch(setError(true));
          dispatch(setMessage(`Image must be at least ${minWidth}x${minHeight}px`));
          return;
        }
        
        setSelectedImage(reader.result as string);
      };
      
      img.src = reader.result as string;
    };
    
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      // Always convert cropped blob to JPEG File for backend compatibility
      const file = new File([croppedBlob], 'cropped-image.jpg', {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      
      // Convert to base64 for preview
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(croppedBlob);
        
        reader.onloadend = async () => {
          try {
            const base64data = reader.result as string;
            
            // Call the update function provided by parent
            await onImageUpdate(file, base64data);
            
            // Show success message
            dispatch(setError(false));
            dispatch(setMessage('Image updated successfully'));
            
            // Close modal, clear previous selection, and resolve promise
            setModalOpen(false);
            setSelectedImage(null);
            resolve();
          } catch (error) {
            console.error('Error updating image:', error);
            dispatch(setError(true));
            dispatch(setMessage('Error updating image. Please try again.'));
            reject(error);
          }
        };
        
        reader.onerror = () => {
          dispatch(setError(true));
          dispatch(setMessage('Error reading image data'));
          reject(new Error('Error reading image data'));
        };
      });
    } catch (error) {
      console.error('Error processing cropped image:', error);
      dispatch(setError(true));
      dispatch(setMessage('Error processing cropped image'));
      throw error;
    }
  };
  
  const handleCloseToast = () => {
    dispatch(setError(false));
    dispatch(setMessage(''));
  };

  return (
    <Box style={{ position: 'relative', ...containerStyle }}>
      <img
        src={imageUrl || defaultImage}
        alt="Image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: editMode ? 0.75 : 1,
          ...imageStyle
        }}
      />
      
      {editMode && (
        <>
          <label
            onClick={handleIconClick}
            style={{
              position: 'absolute',
              top: iconPosition.top,
              right: iconPosition.right,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transform: 'translate(50%, -50%)'
            }}
          >
            <PencilSimpleIcon size={20} color="white" />
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            hidden
          />
          
          <ImageCropModal
            open={modalOpen}
            onClose={() => {
              // Reset state on close so reopening the modal doesn't show previous image
              setModalOpen(false);
              setSelectedImage(null);
            }}
            imageUrl={selectedImage}
            onCropComplete={handleCropComplete}
            aspectRatio={aspectRatio}
            minWidth={minWidth}
            minHeight={minHeight}
            recommendedSize={recommendedSize}
            onFileSelect={handleFileSelect}
            outputWidth={outputWidth}
            outputHeight={outputHeight}
            outputQuality={outputQuality}
            modalSize={modalSize ?? (aspectRatio === 1 ? 'medium' : 'large')}
          />
        </>
      )}
      
      {/* Toast notification for validation errors */}
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GenericImageUpload;
