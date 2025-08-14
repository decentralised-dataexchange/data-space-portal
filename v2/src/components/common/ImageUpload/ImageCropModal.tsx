import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Modal, Box, Typography, Button, Tooltip, CircularProgress } from '@mui/material';
import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Toast from '@/components/common/Toast';

// Styles

const buttonContainerStyle = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'column', md: 'row' },
  justifyContent: { xs: 'flex-start', sm: 'flex-start', md: 'space-between' },
  alignItems: { xs: 'stretch', sm: 'stretch', md: 'center' },
  padding: '16px',
  backgroundColor: '#fff',
  borderTop: '1px solid #E9ECEF',
  gap: { xs: 1, sm: 1.5, md: 2 },
  rowGap: { xs: 1, sm: 1.5, md: 1 },
  // Allow wrapping on xs and sm to prevent overflow when Save shows up
  flexWrap: { xs: 'nowrap', sm: 'nowrap', md: 'nowrap' },
  width: '100%',
  boxSizing: 'border-box' as const,
  position: 'relative' as const,
  zIndex: 2 as const,
  isolation: 'isolate' as const,
};

const buttonStyle = {
  borderRadius: 0,
  textTransform: 'unset',
  padding: '6px 16px',
  minWidth: '120px',
  fontSize: '14px',
  backgroundColor: 'white',
  color: '#000',
  border: '1px solid rgb(223, 223, 223)'
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
  // Optional output size and quality for the final cropped image
  outputWidth?: number;
  outputHeight?: number;
  outputQuality?: number; // 0-1, default 0.82
  // Optional modal size variant
  modalSize?: 'small' | 'medium' | 'large' | 'full';
  // Accepted MIME types for browse and drag/drop validation
  acceptedFileTypes?: string;
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
  pixelCrop: PixelCrop,
  targetW?: number,
  targetH?: number,
  quality: number = 0.82
): Promise<Blob> => {
  const outW = targetW ?? pixelCrop.width;
  const outH = targetH ?? pixelCrop.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas to desired output size
  canvas.width = outW;
  canvas.height = outH;

  // Fill background with white to avoid black background when exporting JPEG
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, outW, outH);

  // Then draw the cropped area scaled to fit on top of the white background
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outW,
    outH
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Canvas is empty');
      }
      resolve(blob);
    }, 'image/jpeg', quality);
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
  outputWidth,
  outputHeight,
  outputQuality,
  modalSize = 'large',
  acceptedFileTypes,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isCropValid, setIsCropValid] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const showToast = useCallback((message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  }, []);

  // Compute modal and crop container sizing variants (inside component)
  const modalSx = useMemo(() => {
    switch (modalSize) {
      case 'small':
        return {
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '60%', md: '50%' },
          maxWidth: '520px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 0,
          borderRadius: 0,
          outline: 'none',
        };
      case 'medium':
        return {
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          // Shrink avatar modal to ~70% of previous size
          width: { xs: '90%', sm: '50%', md: '42%' },
          maxWidth: '504px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 0,
          borderRadius: 0,
          outline: 'none',
        };
      case 'full':
        return {
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '96%', sm: '96%', md: '96%' },
          maxWidth: 'none',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 0,
          borderRadius: 0,
          outline: 'none',
        };
      case 'large':
      default:
        return {
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '80%' },
          maxWidth: '900px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 0,
          borderRadius: 0,
          outline: 'none',
        };
    }
  }, [modalSize]);

  const cropContainerSx = useMemo(() => {
    // Square presentation for avatar (aspectRatio === 1)
    if (aspectRatio === 1) {
      return {
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        maxHeight: '75vh',
        backgroundColor: '#000',
        overflow: 'hidden',
      } as const;
    }
    // Non-square (e.g., banners): vary height by modal size
    const base = {
      position: 'relative',
      width: '100%',
      backgroundColor: '#000',
      maxHeight: '75vh',
      overflow: 'hidden',
    } as const;
    switch (modalSize) {
      case 'small':
        return { ...base, height: 320 } as const;
      case 'medium':
        return { ...base, height: 400 } as const;
      case 'full':
        return { ...base, height: '70vh' } as const;
      case 'large':
      default:
        return { ...base, height: 460 } as const;
    }
  }, [aspectRatio, modalSize]);

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

  // IMPORTANT: When a new image is selected while the modal stays open,
  // reinitialize the crop so the aspect always matches the recommended ratio
  useEffect(() => {
    if (imageUrl) {
      cropInitializedRef.current = false;
      setCrop(undefined);
      setCompletedCrop(null);
      setIsCropValid(false);
    }
  }, [imageUrl, aspectRatio]);

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
        unit: '%' as const,
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUploading) return;
    setIsDragOver(true);
  }, [isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (isUploading) return;
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const types = (acceptedFileTypes || 'image/jpeg,image/jpg,image/png')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const label = (() => {
      const labels = types.map((t) =>
        t.includes('png') ? 'PNG' : (t.includes('jpeg') || t.includes('jpg')) ? 'JPEG' : (t.split('/').pop()?.toUpperCase() || t.toUpperCase())
      );
      return Array.from(new Set(labels)).join('/');
    })();
    if (!types.includes(file.type)) {
      showToast(`Only ${label} images are supported`, 'warning');
      return;
    }
    onFileSelect(file);
  }, [isUploading, onFileSelect, showToast, acceptedFileTypes]);

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
      showToast(`Crop must be at least ${minWidth}x${minHeight}px`, 'warning');
      return;
    }

    try {
      // Set uploading state to show loading indicator
      setIsUploading(true);
      console.log('Starting image crop and upload...');
      
      const pixelCrop = completedCrop;
      const targetW = outputWidth ?? pixelCrop.width;
      const targetH = outputHeight ?? pixelCrop.height;
      const quality = outputQuality ?? 0.82;
      let croppedImage = await getCroppedImg(
        imgRef.current,
        pixelCrop,
        targetW,
        targetH,
        quality
      );
      // Fallback: if still too large (>1.5MB), re-encode at a lower quality
      const MAX_BYTES = 1.5 * 1024 * 1024;
      if (croppedImage.size > MAX_BYTES) {
        const fallbackQuality = Math.max(0.6, quality - 0.2);
        console.warn(`Cropped image size ${croppedImage.size} > ${MAX_BYTES}. Retrying with quality=${fallbackQuality}`);
        croppedImage = await getCroppedImg(
          imgRef.current,
          pixelCrop,
          targetW,
          targetH,
          fallbackQuality
        );
      }
      
      // Wait for the upload to complete before closing the modal
      await onCropComplete(croppedImage);
      console.log('Upload completed successfully');
      // Do not close here; parent will close the modal after it finishes refetching
    } catch (e) {
      console.error('Error during crop or upload:', e);
      // Keep modal open but disable loading state
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const types = (acceptedFileTypes || 'image/jpeg,image/jpg,image/png')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const label = (() => {
        const labels = types.map((t) =>
          t.includes('png') ? 'PNG' : (t.includes('jpeg') || t.includes('jpg')) ? 'JPEG' : (t.split('/').pop()?.toUpperCase() || t.toUpperCase())
        );
        return Array.from(new Set(labels)).join('/');
      })();
      if (!types.includes(file.type)) {
        showToast(`Only ${label} images are supported`, 'warning');
        return;
      }
      onFileSelect(file);
    }
  };


  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        // Prevent closing while uploading to avoid premature modal closure
        if (!isUploading) {
          onClose();
        }
      }}
      disableEscapeKeyDown={isUploading}
    >
      <Box sx={modalSx}>
        <Box
        sx={{
          ...cropContainerSx,
          outline: isDragOver ? '2px dashed #1976d2' : 'none',
          outlineOffset: -6,
          transition: 'outline 0.15s ease',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
          {imageUrl ? (
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // Checkerboard background to indicate transparency and avoid black bleed
              backgroundColor: '#fff',
              backgroundImage:
                'linear-gradient(45deg, #f0f0f0 25%, transparent 25%),\
                 linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),\
                 linear-gradient(45deg, transparent 75%, #f0f0f0 75%),\
                 linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
            }}>
              <ReactCrop
                key={imageUrl || 'no-image'}
                crop={crop}
                onChange={(c) => {
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
                    maxHeight: '100%',
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
              color: 'white',
              textAlign: 'center',
              px: 2,
            }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Select an image
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9, maxWidth: '100%' }}>
                {`Use Browse below, or drag & drop here (${(() => {
                  const types = (acceptedFileTypes || 'image/jpeg,image/jpg,image/png')
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean);
                  const labels = types.map((t) =>
                    t.includes('png') ? 'PNG' : (t.includes('jpeg') || t.includes('jpg')) ? 'JPEG' : (t.split('/').pop()?.toUpperCase() || t.toUpperCase())
                  );
                  return Array.from(new Set(labels)).join('/');
                })()}).`}
              </Typography>
            </Box>
          )}
          <Box sx={tooltipStyle}>
            <Typography variant="body2" sx={{ whiteSpace: 'normal', textAlign: 'center' }}>
              {recommendedSize}
            </Typography>
          </Box>
        </Box>
        <Box sx={buttonContainerStyle}>
          {/* Left side - Cancel button */}
          <Box sx={{ width: { xs: '100%', sm: '100%', md: 'auto' } }}>
            <Button
              onClick={onClose}
              variant="outlined"
              disabled={isUploading}
              sx={{
                ...buttonStyle,
                minWidth: { xs: 88, sm: 104, md: 120 },
                px: { xs: 1.25, sm: 1.75, md: 2 },
                width: { xs: '100%', sm: '100%', md: 'auto' },
                '&:hover': {
                  backgroundColor: '#000',
                  color: '#fff',
                  borderColor: '#000',
                }
              }}
              size="small"
            >
              CANCEL
            </Button>
          </Box>

          {/* Right side - Browse and Save buttons */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            gap: { xs: 1, sm: 1.5, md: 2 },
            justifyContent: { xs: 'flex-start', sm: 'flex-start', md: 'flex-end' },
            alignItems: { xs: 'stretch', sm: 'stretch', md: 'center' },
            flex: 1,
            flexBasis: { xs: '100%', sm: '100%', md: 'auto' },
            width: { xs: '100%', sm: '100%', md: 'auto' },
          }}>
            {/* Always show Browse button */}
            <input
              type="file"
              accept={(acceptedFileTypes || 'image/jpeg,image/jpg,image/png')}
              id="browse-image-bottom"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="browse-image-bottom">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                disabled={isUploading}
                sx={{
                  ...buttonStyle,
                  minWidth: { xs: 88, sm: 104, md: 120 },
                  px: { xs: 1.25, sm: 1.75, md: 2 },
                  width: { xs: '100%', sm: '100%', md: 'auto' },
                  '&:hover': {
                    backgroundColor: '#000',
                    color: '#fff',
                    borderColor: '#000',
                  }
                }}
                size="small"
              >
                BROWSE
              </Button>
            </label>

            {/* Show Save button when image is selected; disabled until crop is valid */}
            {Boolean(imageUrl) && (
              <Tooltip
                title={!isCropValid ? `Image must be at least ${minWidth}x${minHeight}px` : ''}
                arrow
                placement="top"
              >
                <span>
                  <Button
                    onClick={handleSave}
                    variant="outlined"
                    color="primary"
                    disabled={!isCropValid || isUploading}
                    sx={{
                      ...buttonStyle,
                      minWidth: { xs: 88, sm: 104, md: 120 },
                      px: { xs: 1.25, sm: 1.75, md: 2 },
                      width: { xs: '100%', sm: '100%', md: 'auto' },
                      '&:hover': {
                        backgroundColor: '#000',
                        color: '#fff',
                        borderColor: '#000',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)'
                      }
                    }}
                    size="small"
                  >
                    {isUploading ? (
                      <>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                        SAVING...
                      </>
                    ) : 'SAVE'}
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        </Box>
        {/* Standardized top-right toast */}
        <Toast
          open={toastOpen}
          message={toastMessage}
          severity={toastSeverity}
          onClose={() => setToastOpen(false)}
        />
      </Box>
    </Modal>
  );
};

export default ImageCropModal;
