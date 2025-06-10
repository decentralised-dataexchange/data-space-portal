import React from 'react';

import { Drawer } from "@mui/material";
import './style.scss';

interface DrawerProps {
    openRightSideDrawer: boolean;
    onCloseRightSideDrawer: () => void;
    children: React.ReactNode;
}

const DrawerComponent = (props: DrawerProps) => {
    const { openRightSideDrawer, onCloseRightSideDrawer, children } = props;

    return (
        <Drawer
            anchor={"right"}
            open={openRightSideDrawer}
            onClose={onCloseRightSideDrawer}
            className='drawerContainer'
        >
            {children}
        </Drawer>
    );
}

export default DrawerComponent;