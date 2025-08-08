import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Modal, Box, Typography, Button, Tooltip, CircularProgress } from '@mui/material';
import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Styles
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '80%' },
  maxWidth: '800px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 0,
  outline: 'none',
};

const cropContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '400px',
  backgroundColor: '#000',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '16px',
  backgroundColor: '#fff',
  gap: 8,
  flexWrap: { xs: 'wrap', sm: 'nowrap' },
};

const buttonStyle = {
  borderRadius: 0,
  textTransform: 'uppercase',
  padding: '8px 16px',
  minWidth: { xs: 'auto', sm: '100px' },
};

const tooltipStyle = {
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  padding: '8px 16px',
  borderRadius: '4px',
  zIndex: 1000,
};

interface ImageCropModalProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  onCropComplete: (croppedImage: Blob) => Promise<void>;
  aspectRatio: number;
  minWidth: number;
  minHeight: number;
  recommendedSize: string;
  onFileSelect: (file: File) => void;
}

// Helper function to create an initial crop with the correct aspect ratio
function createInitialCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  // Calculate dimensions that maintain the aspect ratio
  // Always use the specified aspect ratio, regardless of image dimensions

  let width, height;

  // For square crops (avatars), ensure it's always square
  if (aspect === 1) {
    // For square crops (avatars), use the smaller dimension to ensure it fits
    const size = Math.min(mediaWidth, mediaHeight) * 0.8; // 80% of the smaller dimension
    width = size;
    height = size;
  } else {
    // For non-square crops (banners), calculate based on aspect ratio
    // For wide crops (e.g., 3:1 banners), start with height
    if (aspect > 1) {
      height = mediaHeight * 0.7; // 70% of image height
      width = height * aspect;

      // If width is too large, adjust both dimensions
      if (width > mediaWidth * 0.9) {
        width = mediaWidth * 0.9;
        height = width / aspect;
      }
    } else {
      // For tall crops, start with width
      width = mediaWidth * 0.7; // 70% of image width
      height = width / aspect;

      // If height is too large, adjust both dimensions
      if (height > mediaHeight * 0.9) {
        height = mediaHeight * 0.9;
        width = height * aspect;
      }
    }
  }

  // Center the crop
  const x = (mediaWidth - width) / 2;
  const y = (mediaHeight - height) / 2;

  return {
    unit: 'px',
    x,
    y,
    width,
    height
  };
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  image: HTMLImageElement,
  pixelCrop: PixelCrop
): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas dimensions to match the cropped image
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert canvas to blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Canvas is empty');
      }
      resolve(blob);
    }, 'image/webp', 0.95); // Convert to WebP with 95% quality
  });
};

// Convert crop (percent or rendered px) to natural pixel crop
const toPixelCrop = (crop: Crop, img: HTMLImageElement): PixelCrop => {
  const scaleX = img.naturalWidth / img.width;
  const scaleY = img.naturalHeight / img.height;
  const conv = (val: number, unit: string, scale: number, total: number) =>
    unit === '%' ? (val / 100) * total : val * scale;

  return {
    unit: 'px',
    x: Math.round(conv(crop.x, crop.unit, scaleX, img.naturalWidth)),
    y: Math.round(conv(crop.y, crop.unit, scaleY, img.naturalHeight)),
    width: Math.round(conv(crop.width, crop.unit, scaleX, img.naturalWidth)),
    height: Math.round(conv(crop.height, crop.unit, scaleY, img.naturalHeight)),
  };
};

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  open,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio,
  minWidth,
  minHeight,
  recommendedSize,
  onFileSelect,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isCropValid, setIsCropValid] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);

  // Keep track of whether the crop has been initialized
  const cropInitializedRef = useRef(false);

  // Reset all state when modal is closed or opened
  useEffect(() => {

    return () => {
      setCrop(undefined);
      setCompletedCrop(null);
      setIsCropValid(false);
      setImgWidth(0);
      setImgHeight(0);
      cropInitializedRef.current = false;
      console.log('Modal closed - state reset');
    };
  }, []);

  const onImageLoaded = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;
    setImgWidth(img.naturalWidth);
    setImgHeight(img.naturalHeight);

    if (!cropInitializedRef.current) {
      const initial = createInitialCrop(img.naturalWidth, img.naturalHeight, aspectRatio);
      setCrop(initial);
      cropInitializedRef.current = true;
    }
    return false; // Return false to prevent auto setting crop by library
  }, [aspectRatio]);

  // When the image loads, set up the initial crop
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImgWidth(naturalWidth);
    setImgHeight(naturalHeight);

    // Only initialize the crop if it hasn't been set yet
    if (!cropInitializedRef.current) {
      // Create initial crop using the helper function
      const initialCrop = createInitialCrop(naturalWidth, naturalHeight, aspectRatio);

      // Convert to percentage-based crop for ReactCrop
      const percentCrop: Crop = {
        unit: '%' as '%',
        x: (initialCrop.x / naturalWidth) * 100,
        y: (initialCrop.y / naturalHeight) * 100,
        width: (initialCrop.width / naturalWidth) * 100,
        height: (initialCrop.height / naturalHeight) * 100
      };

      setCrop(percentCrop);

      // Also set the completed crop so it's ready even if user doesn't interact
      const pixelCrop: PixelCrop = {
        unit: 'px',
        x: Math.round(initialCrop.x),
        y: Math.round(initialCrop.y),
        width: Math.round(initialCrop.width),
        height: Math.round(initialCrop.height)
      };

      setCompletedCrop(pixelCrop);
      setIsCropValid(pixelCrop.width >= minWidth && pixelCrop.height >= minHeight);
      cropInitializedRef.current = true;
    }
  }, [aspectRatio, minWidth, minHeight]);

  // When crop completes, validate the size
  const onCropChangeComplete = useCallback(
    (pixelCrop: PixelCrop) => {
      setCompletedCrop(pixelCrop);

      // Check if the cropped area meets the minimum size requirements
      const isValid =
        pixelCrop.width >= minWidth &&
        pixelCrop.height >= minHeight;

      setIsCropValid(isValid);
    },
    [minWidth, minHeight]
  );

  const handleSave = async () => {
    if (!imageUrl || !imgRef.current) return;

    // If there's no completedCrop (user didn't interact), use the current crop
    if (!completedCrop && crop && imgRef.current) {
      const pixelCrop = toPixelCrop(crop, imgRef.current);
      setCompletedCrop(pixelCrop);
      setIsCropValid(pixelCrop.width >= minWidth && pixelCrop.height >= minHeight);
    }

    // Double-check validity after potentially setting completedCrop
    if (!completedCrop || !isCropValid) {
      console.log('Crop is invalid or not completed');
      return;
    }

    try {
      // Set uploading state to show loading indicator
      setIsUploading(true);
      console.log('Starting image crop and upload...');
      
      const pixelCrop = completedCrop;
      const croppedImage = await getCroppedImg(
        imgRef.current,
        pixelCrop
      );
      
      // Wait for the upload to complete before closing the modal
      await onCropComplete(croppedImage);
      console.log('Upload completed successfully');
      
      // Only close the modal after successful upload
      onClose();
    } catch (e) {
      console.error('Error during crop or upload:', e);
      // Keep modal open but disable loading state
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={cropContainerStyle}>
          {imageUrl ? (
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000'
            }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => {
                  // Reset cropInitializedRef to allow manual resizing
                  setCrop(c);
                }}
                onComplete={(c) => {
                  if (imgRef.current) {
                    const pixel = toPixelCrop(c, imgRef.current);
                    setIsCropValid(pixel.width >= minWidth && pixel.height >= minHeight);
                    setCompletedCrop(pixel);
                  }
                }}
                aspect={aspectRatio}
                ruleOfThirds
                circularCrop={false}
                keepSelection={true}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Crop me"
                  onLoad={onImageLoad}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain'
                  }}
                />
              </ReactCrop>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'white'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Select an image to crop
              </Typography>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                id="browse-image"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="browse-image">
                <Button
                  variant="contained"
                  component="span"
                  sx={{
                    ...buttonStyle,
                    backgroundColor: '#000',
                    '&:hover': {
                      backgroundColor: '#333',
                    }
                  }}
                >
                  BROWSE
                </Button>
              </label>
            </Box>
          )}
          <Box sx={tooltipStyle}>
            <Typography variant="body2">
              {recommendedSize}
            </Typography>
          </Box>
        </Box>
        <Box sx={buttonContainerStyle}>
          {/* Left side - Cancel button */}
          <Box>
            <Button
              onClick={onClose}
              sx={{
                ...buttonStyle,
                color: '#000',
                border: '1px solid #ccc',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              CANCEL
            </Button>
          </Box>

          {/* Right side - Browse and Save buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Always show Browse button */}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              id="browse-image-bottom"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="browse-image-bottom">
              <Button
                variant="contained"
                component="span"
                sx={{
                  ...buttonStyle,
                  backgroundColor: '#000',
                  '&:hover': {
                    backgroundColor: '#333',
                  }
                }}
              >
                BROWSE
              </Button>
            </label>

            {/* Show Save button only when image is loaded */}
            {imageUrl && (
              <Tooltip
                title={!isCropValid ? `Image must be at least ${minWidth}x${minHeight}px` : ''}
                arrow
                placement="top"
              >
                <span>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!isCropValid || isUploading}
                    sx={{
                      ...buttonStyle,
                      backgroundColor: '#000',
                      '&:hover': {
                        backgroundColor: '#333',
                      }
                    }}
                  >
                    {isUploading ? (
                      <>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                        UPLOADING...
                      </>
                    ) : 'SAVE'}
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageCropModal;
