import { Box, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import BasicTable from '../../component/Table';
import React, { useState } from 'react';
import { TableData, TableHead } from './tableUtils';
import { useTranslation } from 'react-i18next';


const ConfirmComponent = ({ callRightSideDrawer }) => {
    const { t } = useTranslation('translation');
    const [credentialArray, setcredentialArray] = useState([]);

    return (
        <>
            <Box component="div" className='businessInfo'>
                <Typography gutterBottom component="div">{t('gettingStarted.confirmWalletDescription')}</Typography>
                <Box className="certificateTxt">{t('common.certificateOfRegistration')}</Box>
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