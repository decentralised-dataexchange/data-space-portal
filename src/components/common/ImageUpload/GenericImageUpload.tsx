import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ImageCropModal from './ImageCropModal';
import { useAppDispatch } from '@/custom-hooks/store';
import { setMessage } from '@/store/reducers/authReducer';
import { useTranslations } from 'next-intl';

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
  // When true, the edit (pencil) icon is shown even if editMode is false
  alwaysShowIcon?: boolean;
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
  acceptedFileTypes = 'image/jpeg,image/jpg,image/png,image/webp',
  alwaysShowIcon = false,
}) => {
  const t = useTranslations();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Open the modal and ensure an image is shown immediately
    setSelectedImage((prev) => prev || imageUrl || defaultImage || null);
    setModalOpen(true);
  };

  // When modal opens, if there is no selected image yet, preload the current or default one
  useEffect(() => {
    if (modalOpen && !selectedImage) {
      setSelectedImage(imageUrl || defaultImage || null);
    }
  }, [modalOpen, imageUrl, defaultImage]);

  // Handle file selection from the modal's browse button
  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Immediately preview the selected image in the modal.
      // Validation will be handled inside the modal by disabling Save when crop is invalid.
      setSelectedImage(reader.result as string);
    };
    
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      // Preserve the cropped blob's MIME type (do not force JPEG)
      const mime = croppedBlob.type || 'image/jpeg';
      const ext = mime === 'image/png' ? '.png' : (mime === 'image/jpeg' ? '.jpg' : '');
      const file = new File([croppedBlob], `cropped-image${ext}`, {
        type: mime,
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
            
            // Success toasts are suppressed globally; do not show a success toast here
            
            // Close modal, clear previous selection, and resolve promise
            setModalOpen(false);
            setSelectedImage(null);
            resolve();
          } catch (error) {
            console.error('Error updating image:', error);
            dispatch(setMessage(t('errors.imageUpdate')));
            reject(error);
          }
        };
        
        reader.onerror = () => {
          dispatch(setMessage(t('errors.imageRead')));
          reject(new Error('Error reading image data'));
        };
      });
    } catch (error) {
      console.error('Error processing cropped image:', error);
      dispatch(setMessage(t('errors.imageProcess'))); 
      throw error;
    }
  };
  
  return (
    <Box style={{ position: 'relative', ...containerStyle }}>
      <img
        src={imageUrl || defaultImage}
        alt={t('common.imageAlt')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: editMode ? 0.75 : 1,
          ...imageStyle
        }}
      />
      
      {(editMode || alwaysShowIcon) && (
        <>
          <label
            onClick={handleIconClick}
            style={{
              position: 'absolute',
              top: iconPosition.top,
              right: iconPosition.right,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transform: 'translate(50%, -50%)'
            }}
          >
            <CreateOutlinedIcon sx={{ fontSize: 24, color: 'white' }} />
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
            acceptedFileTypes={acceptedFileTypes}
          />
        </>
      )}
      
    </Box>
  );
};

export default GenericImageUpload;
