"use client";

import React, { useEffect, useState } from 'react';
import {
    Drawer, 
    ListItemIcon, 
    ListItemText,
    MenuItem,
    Typography,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { CaretRight, CaretDown } from '@phosphor-icons/react';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { sidebarMenuItems, SidebarMenuItem, SubMenuItem } from '@/constants/sidebar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './style.scss';

const drawerWidth = 260;
interface SideBarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

// Colors for active/inactive states
const activeTextColor = '#000000';
const inactiveTextColor = '#757575';

type RenderedSubMenuItem = {
  name: string;
  translationKey: string;
  link: string;
};

type RenderedMenuItem = {
  name: string;
  translationKey: string;
  icon: React.ReactNode;
  link: string;
  subMenu: RenderedSubMenuItem[];
};

export default function SideBar({ open, handleDrawerClose }: SideBarProps) {
  const t = useTranslations();
  // Track open state for each submenu by name
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  
  // Use current path to determine active menu item
  const pathname = usePathname();
  
  // Use MUI breakpoints instead of getDevice
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Check if a menu item is active based on the current path
  // Account for locale prefix in the URL (e.g., /en/dd-agreements)
  const isActive = (itemPath: string) => {
    if (!pathname) return false;
    
    // Extract path after locale
    const pathParts = pathname.split('/');
    if (pathParts.length >= 3) {
      // pathParts[0] is empty (before first slash), pathParts[1] is locale
      const pathAfterLocale = '/' + pathParts.slice(2).join('/');
      return pathAfterLocale === itemPath || pathAfterLocale.startsWith(itemPath + '/');
    }
    
    return pathname.endsWith(itemPath);
  };

  const resolveIcon = (iconId: 'home' | 'market' | 'signed' | 'b2b' | 'account') => {
    switch (iconId) {
      case 'home':
        return <HomeOutlinedIcon fontSize="small" />;
      case 'market':
        return <DescriptionOutlinedIcon fontSize="small" />;
      case 'signed':
        return <AssignmentTurnedInOutlinedIcon fontSize="small" />;
      case 'b2b':
        return <HubOutlinedIcon fontSize="small" />;
      case 'account':
      default:
        return <LockOutlinedIcon fontSize="small" />;
    }
  };

  // Apply translations to the imported sidebar menu items using translation keys
  const menuList: RenderedMenuItem[] = sidebarMenuItems.map(item => ({
    name: t(`sideBar.${item.translationKey}`, { fallback: item.name }),
    translationKey: item.translationKey,
    icon: resolveIcon(item.iconId),
    link: item.link,
    subMenu: item.subMenu.map(subItem => ({
      name: t(`sideBar.${subItem.translationKey}`, { fallback: subItem.name }),
      translationKey: subItem.translationKey,
      link: subItem.link
    }))
  }))

  const handleToggle = (menuName: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  }

  // When route changes, keep only the submenu whose parent matches the current path open; collapse others
  useEffect(() => {
    const nextOpen: Record<string, boolean> = {};
    sidebarMenuItems.forEach((item) => {
      if (isActive(item.link)) {
        // Use translated name key since we store state by displayed name
        const translatedName = t(`sideBar.${item.translationKey}`, { fallback: item.name });
        nextOpen[translatedName] = true;
      }
    });
    setOpenSubMenus(nextOpen);
  }, [pathname]);

  interface SubMenuComponentProps {
    list: RenderedMenuItem;
    isOpen: boolean;
    handleToggle: (menuName: string) => void;
  }

  const SubMenuComponent = ({ list, isOpen, handleToggle }: SubMenuComponentProps) => {
    const active = isActive(list.link);
    
    return (
      <Box>
        <MenuItem 
          onClick={() => handleToggle(list.name)}
          sx={{
            color: active ? activeTextColor : inactiveTextColor,
            fontWeight: active ? 'bold' : 'normal',
            display: 'flex',
            width: '100%',
            py: 1,
          }}
        >
          <ListItemIcon sx={{ color: inactiveTextColor }}>
            {list.icon}
          </ListItemIcon>
          <ListItemText sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ lineHeight: 'normal' }}>{list.name}</Typography>
          </ListItemText>
          <Box sx={{ ml: 'auto', color: inactiveTextColor }}>
            {isOpen ? <CaretDown size={18} /> : <CaretRight size={18} />}
          </Box>
        </MenuItem>
        {isOpen && (
          <Box>
            {list.subMenu.map((subItem) => {
              const subItemActive = pathname.includes(subItem.link);
              return (
                <MenuItem
                  key={subItem.name}
                  component={Link}
                  href={`${list.link}/${subItem.link}`}
                  sx={{
                    color: subItemActive ? activeTextColor : inactiveTextColor,
                    fontWeight: subItemActive ? 'bold' : 'normal',
                    display: 'flex',
                    width: '100%',
                    py: 1,
                    pl: 8, // indent inside the item so hover covers full width
                    mx: 0
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 'normal' }}>{subItem.name}</Typography>
                </MenuItem>
              );
            })}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '80px',
          paddingTop: "15px",
          backgroundColor: 'rgb(247, 246, 246)',
          '@media (max-width: 900px)': {
            position: 'absolute',
            height: 'calc(100% - 80px)',
            zIndex: 1200,
            '&.MuiDrawer-paperAnchorLeft': {
              backgroundColor: 'rgb(247, 246, 246) !important'
            }
          }
        }
      }}
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          sx: { 
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            top: '80px',
            height: 'calc(100% - 80px)'
          }
        }
      }}
      variant={isMobile || isTablet ? 'temporary' : 'persistent'}
      anchor="left"
      onClose={handleDrawerClose}
      open={open}
      className="sideBarContainer"
    >
      {menuList.map((list, i) => {
        const active = isActive(list.link);
        
        return (
          <Box key={list.name}>
            {!list.subMenu.length ? (
              <MenuItem
                component={Link}
                href={list.link}
                sx={{ color: active ? activeTextColor : inactiveTextColor, fontWeight: active ? 'bold' : 'normal', display: 'flex', width: '100%', alignItems: 'center', gap: 0.5}}
              >
                <ListItemIcon sx={{ color: inactiveTextColor }}>
                  {list.icon}
                </ListItemIcon>
                <ListItemText sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ lineHeight: 'normal' }}>{list.name}</Typography>
                </ListItemText>
              </MenuItem>
            ) : (
              <SubMenuComponent 
                list={list} 
                isOpen={!!openSubMenus[list.name]} 
                handleToggle={handleToggle}
              />
            )}
          </Box>
        );
      })}
      <Box
          sx={{
            marginTop: "auto",
            // paddingBottom: 15,
            textAlign: "center",
          }}
        >
        </Box>
    </Drawer>
  );
}