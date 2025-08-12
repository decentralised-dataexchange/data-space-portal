import React, { ReactNode } from 'react';
import { Drawer, DrawerProps, IconButton, Box, Typography, styled, BoxProps } from '@mui/material';
import { XIcon } from '@phosphor-icons/react';
import './style.scss';

export interface RightSidebarProps extends Omit<DrawerProps, 'onClose' | 'anchor' | 'title'> {
  // Core props
  open: boolean;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
  children: ReactNode;
  
  // Header props
  title?: string | ReactNode;
  headerContent?: ReactNode;
  showHeader?: boolean;
  headerProps?: BoxProps;
  customCloseButton?: ReactNode;
  hideCloseButton?: boolean;
  
  // Banner props (used in some designs)
  bannerContent?: ReactNode;
  showBanner?: boolean;
  bannerProps?: BoxProps;
  
  // Footer props
  footerContent?: ReactNode;
  showFooter?: boolean;
  footerProps?: BoxProps;
  
  // Content props
  contentProps?: BoxProps;
  
  // Styling props
  width?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  
  // Behavior props
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  keepMounted?: boolean;
  
  // Other props
  className?: string;
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => 
    prop !== 'width' && 
    prop !== 'maxWidth' &&
    prop !== 'height' &&
    prop !== 'disableBackdropClick' && 
    prop !== 'disableEscapeKeyDown'
})<{ 
  width?: number | string;
  maxWidth?: number | string;
  height?: number | string;
}>(({ theme, width = 480, maxWidth = 594, height = '100%' }) => ({
  zIndex: theme.zIndex.modal,
  '& .MuiDrawer-paper': {
    width: typeof width === 'number' ? `${width}px` : width,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    height: typeof height === 'number' ? `${height}px` : height,
    overflow: 'hidden',
    borderRadius: 0,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  backgroundColor: '#03182b',
  color: '#F3F3F6',
  minHeight: 64,
  flexShrink: 0,
  borderRadius: 0,
}));

const Content = styled('div')(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  backgroundColor: '#F7F6F6',
}));

const Footer = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderTop: '1px solid #E9ECEF',
  backgroundColor: '#FFFFFF',
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
}));

// Banner component for organization details or other info that appears under the header
const Banner = styled('div')(({ theme }) => ({
  backgroundColor: '#E6E6E6',
  padding: 0,
  flexShrink: 0,
  height: '194px',
  borderRadius: '0 0 7px 7px',
}));

const RightSidebar = ({
  open,
  onClose,
  title,
  headerContent,
  showHeader = true,
  headerProps,
  customCloseButton,
  hideCloseButton = false,
  bannerContent,
  showBanner = false,
  bannerProps,
  footerContent,
  showFooter = true,
  footerProps,
  contentProps,
  children,
  width = 480,
  maxWidth,
  height,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  className,
  ...props
}: RightSidebarProps) => {
  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if ((reason === 'backdropClick' && disableBackdropClick) || 
        (reason === 'escapeKeyDown' && disableEscapeKeyDown)) {
      return;
    }
    onClose(event, reason);
  };

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={handleClose}
      width={width}
      maxWidth={maxWidth}
      height={height}
      className={`right-sidebar ${className || ''}`}
      {...props}
    >
      {/* Header */}
      {showHeader && (
        <Header className="right-sidebar-header" style={headerProps?.style} sx={{ ...headerProps?.sx, height: "80px" }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {headerContent || (typeof title === 'string' ? (
              <Typography 
                variant="h6" 
                noWrap 
                sx={{ 
                  fontWeight: 600,
                  color: 'inherit'
                }}
              >
                {title}
              </Typography>
            ) : (
              title
            ))}
          </Box>
          {!hideCloseButton && (
            customCloseButton || (
              <IconButton
                onClick={(e) => onClose(e, 'escapeKeyDown')}
                size="small"
                sx={{ 
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
                aria-label="close"
              >
              <XIcon size={20} />
              </IconButton>
            )
          )}
        </Header>
      )}
      
      {/* Banner - Optional section for organization details or other info */}
      {showBanner && bannerContent && (
        <Banner className="right-sidebar-banner" style={bannerProps?.style} sx={bannerProps?.sx}>
          {bannerContent}
        </Banner>
      )}

      {/* Content */}
      <Content className="right-sidebar-content" style={contentProps?.style} sx={contentProps?.sx}>
        {children}
      </Content>

      {/* Footer */}
      {showFooter && footerContent && (
        <Footer className="right-sidebar-footer" style={footerProps?.style} sx={footerProps?.sx}>
          {footerContent}
        </Footer>
      )}
    </StyledDrawer>
  );
};

export default RightSidebar;
