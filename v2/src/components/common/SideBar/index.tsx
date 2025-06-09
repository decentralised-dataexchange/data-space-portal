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
import { HouseOutlined, InsertDriveFileOutlined, LockOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { sidebarMenuItems, SidebarMenuItem, SubMenuItem } from '@/constants/sidebar';

const drawerWidth = 260;
interface SideBarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

export default function SideBar({ open, handleDrawerClose }: SideBarProps) {
  const t = useTranslations();
  // Track open state for each submenu by name
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  
  // Use MUI breakpoints instead of getDevice
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "HouseOutlined":
        return <HouseOutlined />
      case "InsertDriveFileOutlined":
        return <InsertDriveFileOutlined />
      case "LockOutlined":
        return <LockOutlined />
      default:
        return <></>;
    }
  }

  // Apply translations to the imported sidebar menu items using translation keys
  const menuList = sidebarMenuItems.map(item => ({
    name: t(`sideBar.${item.translationKey}`, { fallback: item.name }),
    icon: item.icon,
    link: item.link,
    subMenu: item.subMenu.map(subItem => ({
      name: t(`sideBar.${subItem.translationKey}`, { fallback: subItem.name }),
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
    return (
      <Box>
        <MenuItem onClick={() => handleToggle(list.name)}>
          <ListItemIcon>
            {renderIcon(list.icon)}
          </ListItemIcon>
          <Typography variant="inherit" color="textSecondary">
            {list.name}
          </Typography>
        </MenuItem>
        {isOpen && (
          <Box sx={{ ml: 2 }}>
            {list.subMenu.map((subItem) => (
              <MenuItem key={subItem.name}>
                <Link href={subItem.link} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
                  <Typography variant="body2">{subItem.name}</Typography>
                </Link>
              </MenuItem>
            ))}
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
        },
        position: "absolute"
      }}
      ModalProps={{
        keepMounted: true,
      }}
      variant={isMobile || isTablet ? 'temporary' : 'persistent'}
      anchor="left"
      onClose={handleDrawerClose}
      open={open}
    >
      {menuList.map((list, i) => (
        <Box key={list.name} sx={{ p: 1 }}>
          {!list.subMenu.length ? (
            <MenuItem>
              <Link href={list.link} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', width: '100%' }}>
                <ListItemIcon>
                  {renderIcon(list.icon)}
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="body2">{list.name}</Typography>
                </ListItemText>
              </Link>
            </MenuItem>
          ) : (
            <SubMenuComponent 
              list={list} 
              isOpen={!!openSubMenus[list.name]} 
              handleToggle={handleToggle}
            />
          )}
        </Box>
      ))}
      <Box
          sx={{
            marginTop: "auto",
            paddingBottom: 15,
            textAlign: "center",
          }}
        >
        </Box>
    </Drawer>
  );
}