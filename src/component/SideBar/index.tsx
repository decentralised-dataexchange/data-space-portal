import React, { useState } from 'react';
import {
    Drawer, 
    ListItemIcon, 
    ListItemText,
    MenuItem,
    Typography,
    Box
} from '@mui/material';
import { HouseOutlined, InsertDriveFileOutlined, LockOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getDevice } from '../../utils/utils';
import './style.scss';
import { useTranslation } from 'react-i18next';
import SubMenu from './SubMenu';

const drawerWidth = 260;
export default function MenuBar({ open, handleDrawerClose }) {
  const { t } = useTranslation('translation');
  const [ isSubMenuOpen, setSubMenuOpen ] = useState(false);
  const { isMobile, isTablet } = getDevice();

  const renderIcon = (icon) => {
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

  const menuList = [
    {
        'name': `${t('sideBar.gettingStarted')}`,
        'icon': 'HouseOutlined',
        'link': 'start',
        'subMenu': []

    },
    {
        'name': `${t('sideBar.dataAgreements')}`,
        'icon': 'InsertDriveFileOutlined',
        'link': 'dd-agreements',
        'subMenu': []

    },
    {
      'name': `${t('sideBar.account')}`,
      'icon': 'LockOutlined',
      'link': 'account',
      'subMenu': [
        {
          'name': `${t('sideBar.manageAdmin')}`,
          'link': `${t("route.manageAdmin")}`,
        },
        {
          'name': `${t('sideBar.developerApis')}`,
          'link': `${t("route.developerApis")}`,
        },
        {
          'name': `${t('sideBar.dispConnections')}`,
          'link': `${t("route.dispConnections")}`,
        }
      ]
    }
  ]

  const handleToggle = () => {
    setSubMenuOpen(!isSubMenuOpen);
  }
  const isDesktop = (!isMobile && !isTablet);
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
        position: "absolute",
        borderRight: "1px solid rgb(225, 225, 225)",
      }}
      ModalProps={{
        keepMounted: true,
      }}
      variant={isMobile || isTablet ? 'temporary' : 'persistent'}
      anchor="left"
      onClose={handleDrawerClose}
      open={open}
    >
      {menuList.map((list, i) => {
        return(
          <> 
          <Box className="sideBarContainer">
            {!list?.subMenu.length ? 
              <MenuItem className={`p-15 ${!isDesktop && i==0 ? "smTabOpen" : ''}`} key={list?.name}>
                <Link className='link d-flex' to={list?.link} key={list?.name}>
                    <ListItemIcon>
                      {renderIcon(list?.icon)}
                    </ListItemIcon>
                    <Typography variant="inherit" ml={.5} color="textSecondary" >
                      {list?.name}
                    </Typography>
                </Link>
              </MenuItem> 
              : 
              <SubMenu
                handleToggle={() => handleToggle()}
                isOpen={isSubMenuOpen}
                name={t('sideBar.account')}
                icon={renderIcon(list?.icon)}
                dense={true}
              >
                {list.subMenu.map((menu) => (
                  <MenuItem key={menu?.name} className='p-15' >
                    <Link className="link" to={menu?.link} key={menu?.name}>
                      <ListItemText primary={menu?.name} />
                    </Link>
                  </MenuItem> 
                ))
                }
              </SubMenu>
            }
            </Box>
          </>
        )
      })}
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