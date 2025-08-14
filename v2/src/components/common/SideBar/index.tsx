"use client";

import React, { useState } from 'react';
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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { sidebarMenuItems, SidebarMenuItem, SubMenuItem } from '@/constants/sidebar';
import './style.scss';

const drawerWidth = 260;
interface SideBarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

// Colors for active/inactive states
const activeTextColor = '#000000';
const inactiveTextColor = '#757575';

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

  // Apply translations to the imported sidebar menu items using translation keys
  const menuList = sidebarMenuItems.map(item => ({
    name: t(`sideBar.${item.translationKey}`, { fallback: item.name }),
    translationKey: item.translationKey, // Include translationKey to match SidebarMenuItem interface
    icon: item.icon,
    link: item.link,
    subMenu: item.subMenu.map(subItem => ({
      name: t(`sideBar.${subItem.translationKey}`, { fallback: subItem.name }),
      translationKey: subItem.translationKey, // Include translationKey for submenu items
      link: subItem.link
    }))
  }))

  const handleToggle = (menuName: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  }

  interface SubMenuComponentProps {
    list: SidebarMenuItem;
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
          <ListItemIcon sx={{ color: active ? activeTextColor : inactiveTextColor }}>
            <list.icon size={22} weight={active ? "fill" : "regular"} />
          </ListItemIcon>
          <ListItemText sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ lineHeight: 'normal' }}>{list.name}</Typography>
          </ListItemText>
        </MenuItem>
        {isOpen && (
          <Box sx={{ ml: 8 }}>
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
                    display: 'flex', width: '100%', py: 1
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
        },
        '& .MuiBackdrop-root': {
          display: 'none'
        }
      }}
      ModalProps={{
        keepMounted: true,
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
          <Box key={list.name} sx={{ px: 1, py: 0 }}>
            {!list.subMenu.length ? (
              <MenuItem
                component={Link}
                href={list.link}
                sx={{ color: active ? activeTextColor : inactiveTextColor, fontWeight: active ? 'bold' : 'normal', display: 'flex', width: '100%', alignItems: 'center', py: 1 }}
              >
                <ListItemIcon sx={{ color: active ? activeTextColor : inactiveTextColor }}>
                  <list.icon size={22} weight={active ? "fill" : "regular"} />
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