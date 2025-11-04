import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Modal, Box, Typography, Button, Tooltip, CircularProgress } from '@mui/material';
import ReactCrop, { type Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useAppDispatch } from '@/custom-hooks/store';
import { setMessage } from '@/store/reducers/authReducer';

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
  minWidth: number,
  minHeight: number,
): Crop {
  // Calculate dimensions that maintain the aspect ratio
  // Always use the specified aspect ratio, regardless of image dimensions

  let width, height;

  // For square crops (avatars), ensure it's always square
  if (aspect === 1) {
    // For square crops (avatars), ensure initial crop is at least min size when possible
    const maxSquare = Math.min(mediaWidth, mediaHeight);
    const desired = Math.max(minWidth, minHeight, Math.floor(maxSquare * 0.8));
    const size = Math.min(desired, maxSquare);
    width = size;
    height = size;
  } else {
    // For non-square crops, ensure both minWidth and minHeight are considered with the aspect
    if (aspect > 1) {
      const minHNeeded = Math.max(minHeight, Math.ceil(minWidth / aspect));
      const desiredH = Math.max(minHNeeded, Math.floor(mediaHeight * 0.7));
      height = Math.min(Math.max(desiredH, minHNeeded), mediaHeight);
      width = height * aspect;
      if (width > mediaWidth) {
        width = mediaWidth;
        height = width / aspect;
      }
    } else {
      const minWNeeded = Math.max(minWidth, Math.ceil(minHeight * aspect));
      const desiredW = Math.max(minWNeeded, Math.floor(mediaWidth * 0.7));
      width = Math.min(Math.max(desiredW, minWNeeded), mediaWidth);
      height = width / aspect;
      if (height > mediaHeight) {
        height = mediaHeight;
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
  // Live pixel crop to show dimensions during drag (independent from validation state)
  const [livePixelCrop, setLivePixelCrop] = useState<PixelCrop | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dispatch = useAppDispatch();

  const isValidCrop = useMemo(() => {
    const c = livePixelCrop ?? completedCrop;
    if (!c) return false;
    return c.width >= minWidth && c.height >= minHeight;
  }, [livePixelCrop, completedCrop, minWidth, minHeight]);

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
      setLivePixelCrop(null);
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
    }
  }, [imageUrl, aspectRatio]);

  useEffect(() => {
    setIsUploading(false);
  }, [open]);


  // When the image loads, set up the initial crop
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;

    // Only initialize the crop if it hasn't been set yet
    if (!cropInitializedRef.current) {
      // Create initial crop using the helper function
      const initialCrop = createInitialCrop(naturalWidth, naturalHeight, aspectRatio, minWidth, minHeight);

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
      cropInitializedRef.current = true;
    }
  }, [aspectRatio, minWidth, minHeight]);

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
      dispatch(setMessage(`Only ${label} images are supported`));
      return;
    }
    onFileSelect(file);
  }, [isUploading, onFileSelect, acceptedFileTypes, dispatch]);

  const handleSave = async () => {
    if (!imageUrl || !imgRef.current) return;
    const pixelCrop = completedCrop ?? (crop ? toPixelCrop(crop, imgRef.current) : null);
    if (!pixelCrop || pixelCrop.width < minWidth || pixelCrop.height < minHeight) {
      console.log('Crop is invalid or not completed');
      dispatch(setMessage(`Crop must be at least ${minWidth}x${minHeight}px`));
      return;
    }

    try {
      // Set uploading state to show loading indicator
      setIsUploading(true);
      console.log('Starting image crop and upload...');
      
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
      setIsUploading(false);
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
        dispatch(setMessage(`Only ${label} images are supported`));
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
            <Box ref={containerRef} sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              backgroundImage:
                'linear-gradient(45deg, #f0f0f0 25%, transparent 25%),\
                 linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),\
                 linear-gradient(45deg, transparent 75%, #f0f0f0 75%),\
                 linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              '& .ReactCrop__child-wrapper': {
                cursor: 'auto',
              }
            }}>
              <ReactCrop
                key={imageUrl || 'no-image'}
                crop={crop}
                onChange={(c) => {
                  setCrop(c);
                  // Compute a live pixel crop for display (do not change validation logic here)
                  if (imgRef.current) {
                    const pixel = toPixelCrop(c, imgRef.current);
                    setLivePixelCrop(pixel);
                  }
                }}
                onComplete={(c) => {
                  if (imgRef.current) {
                    const pixel = toPixelCrop(c, imgRef.current);
                    setCompletedCrop(pixel);
                    // Sync live crop to final on-complete value
                    setLivePixelCrop(pixel);
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
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    userSelect: 'none'
                  }}
                />
              </ReactCrop>
              {/* Dimension overlays rendered outside ReactCrop to avoid being unmounted during drag */}
              {(() => {
                const display = livePixelCrop || completedCrop;
                if (!display || !imgRef.current || !containerRef.current) return null;
                const imgEl = imgRef.current;
                const imgRect = imgEl.getBoundingClientRect();
                const contRect = containerRef.current.getBoundingClientRect();
                const offsetLeft = imgRect.left - contRect.left;
                const offsetTop = imgRect.top - contRect.top;
                // Map natural pixels to rendered CSS pixels
                const scaleX = imgRect.width / imgEl.naturalWidth;
                const scaleY = imgRect.height / imgEl.naturalHeight;
                const cropLeftPx = offsetLeft + display.x * scaleX;
                const cropTopPx = offsetTop + display.y * scaleY;
                const cropWidthPx = display.width * scaleX;
                const cropHeightPx = display.height * scaleY;
                const pad = 4;
                const maxX = contRect.width - pad;
                const maxY = contRect.height - pad;
                let widthLabelLeft = cropLeftPx + cropWidthPx / 2;
                let widthLabelTop = cropTopPx - 8;
                let heightLabelLeft = cropLeftPx + cropWidthPx + 8;
                let heightLabelTop = cropTopPx + cropHeightPx / 2;
                let widthTransform = 'translate(-50%, -100%)';
                let heightTransform = 'translate(0, -50%)';

                if (widthLabelTop < pad) {
                  widthLabelTop = cropTopPx + 8;
                  widthTransform = 'translate(-50%, 0)';
                }
                if (widthLabelTop > maxY) {
                  widthLabelTop = cropTopPx + cropHeightPx - 8;
                  widthTransform = 'translate(-50%, -100%)';
                }
                if (heightLabelLeft > maxX) {
                  heightLabelLeft = cropLeftPx + cropWidthPx - 8;
                  heightTransform = 'translate(-100%, -50%)';
                }
                if (heightLabelLeft < pad) {
                  heightLabelLeft = cropLeftPx + 8;
                  heightTransform = 'translate(0, -50%)';
                }

                widthLabelLeft = widthLabelLeft;
                widthLabelTop = Math.min(maxY, Math.max(pad, widthLabelTop));
                heightLabelLeft = Math.min(maxX, Math.max(pad, heightLabelLeft));
                heightLabelTop = Math.min(maxY, Math.max(pad, heightLabelTop));
                return (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${widthLabelLeft}px`,
                        top: `${widthLabelTop}px`,
                        transform: widthTransform,
                        pointerEvents: 'none',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        px: 1,
                        py: 0.25,
                        borderRadius: '2px',
                        fontSize: '12px',
                        lineHeight: 1,
                        zIndex: 3,
                      }}
                    >
                      {`${display.width}px`}
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${heightLabelLeft}px`,
                        top: `${heightLabelTop}px`,
                        transform: heightTransform,
                        pointerEvents: 'none',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        px: 1,
                        py: 0.25,
                        borderRadius: '2px',
                        fontSize: '12px',
                        lineHeight: 1,
                        zIndex: 3,
                        padding: 0.25
                      }}
                    >
                      {`${display.height}px`}
                    </Box>
                  </>
                );
              })()}
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
            <Tooltip title={recommendedSize} arrow placement="top">
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
            </Tooltip>
            {Boolean(imageUrl) && (
              <Tooltip
                title={!isValidCrop ? `Image must be at least ${minWidth}x${minHeight}px` : ''}
                arrow
                placement="top"
              >
                <span>
                  <Button
                    onClick={handleSave}
                    variant="outlined"
                    color="primary"
                    disabled={!isValidCrop || isUploading}
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
      </Box>
    </Modal>
  );
};

export default ImageCropModal;
