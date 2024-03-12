import { Box, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import BasicTable from '../../component/Table';
import React, { useState } from 'react';
import { TableData, TableHead } from './tableUtils'


const ConfirmComponent = ({ callRightSideDrawer }) => {
    const [credentialArray, setcredentialArray] = useState([]);

    return (
        <>
            <Box component="div" className='businessInfo'>
                <Typography gutterBottom component="div">Your business is currently unverified. Choose confirm to verify your business. </Typography>
                <Box className="certificateTxt">Certificate of registration </Box>
            </Box>
            <Box className='confirmTable'>
                <BasicTable 
                    isColumnWise={true} 
                    tableData={TableData} 
                    tableField={TableHead} 
                    customTableHeadClass={"mui-table-bordered"}
                    customTableBodyClass={"mui-table-bordered"}
                />
            </Box>

        </>
    );
}

export default ConfirmComponent;