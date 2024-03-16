import React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
    List,
    MenuItem,
    ListItemIcon,
    Typography,
    Collapse,
} from '@mui/material';
interface Props {
    dense: boolean;
    handleToggle: () => void;
    icon: ReactElement;
    isOpen: boolean;
    name: string;
    children: ReactNode;
}

const SubMenu = (props: Props) => {
    const { handleToggle, isOpen, name, icon, children, dense } = props;
    const header = (
        <MenuItem onClick={handleToggle}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <Typography variant="inherit" ml={.5} color="textSecondary" >
                {name}
            </Typography>
        </MenuItem>
    );

    return (
        <>
            {header}
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List
                    dense={dense}
                    component="div"
                    disablePadding
                    sx={{
                        '& a': {
                            transition:
                                'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                            paddingLeft: 9,
                        },
                    }}
                >
                    {children}
                </List>
            </Collapse>
        </>
    );
};

export default SubMenu;