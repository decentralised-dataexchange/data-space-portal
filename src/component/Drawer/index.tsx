import React from 'react';

import { Drawer } from "@mui/material";
import './style.scss';
const DrawerComponent = (props) => {
    const { openRightSideDrawer, callRightSideDrawer, children } = props;

    return (
        <Drawer
            anchor={"right"}
            open={openRightSideDrawer}
            onClose={callRightSideDrawer}
            className='drawerContainer'
            BackdropProps={{ invisible: true }}
        >
            {children}
        </Drawer>
    );
}

export default DrawerComponent;



