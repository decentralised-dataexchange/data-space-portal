import * as React from 'react';
import { 
    List,
    Drawer, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    ListItem
} from '@mui/material';
import { CottageOutlined, InsertDriveFileOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getDevice } from '../../utils/utils';
import './style.scss';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

export default function MenuBar({ open, handleDrawerClose }) {
  const { t } = useTranslation('translation');
  const { isMobile } = getDevice();
  const renderIcon = (icon) => {
    switch (icon) {
      case "CottageOutlined":
        return <CottageOutlined />
      case "InsertDriveFileOutlined":
        return <InsertDriveFileOutlined />
      default:
        return "";
    }
  }

  const menuList = [
    {
        'name': `${t('sideBar.gettingStarted')}`,
        'icon': 'CottageOutlined',
        'link': 'start'

    },
    {
        'name': `${t('sideBar.dataAgreements')}`,
        'icon': 'InsertDriveFileOutlined',
        'link': 'dd-agreements'

    }
]

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      ModalProps={{
        keepMounted: true,
      }}
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      onClose={handleDrawerClose}
      open={open}
    >
      <List>
        {menuList.map((list) => (
          <ListItem key={list?.name} disablePadding>
            <Link className="link" to={list?.link}>
            <ListItemButton>
              <ListItemIcon>
               {renderIcon(list?.icon)}
              </ListItemIcon>
              <ListItemText primary={list?.name} />
            </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}