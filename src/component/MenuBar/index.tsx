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
import { menuList } from './menuList';
import { Link } from 'react-router-dom';
import './style.scss';
const drawerWidth = 240;

export default function MenuBar({ open }) {
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
      variant="persistent"
      anchor="left"
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