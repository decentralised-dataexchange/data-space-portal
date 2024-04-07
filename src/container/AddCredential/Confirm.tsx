import { Box, Typography } from '@mui/material';
import BasicTable from '../../component/Table';
import React, { useState } from 'react';
import { TableHead } from './tableUtils';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../customHooks';


const ConfirmComponent = ({ callRightSideDrawer }) => {
    const { t } = useTranslation('translation');

    const verifyConnectionObj = useAppSelector(
        (state) => state?.gettingStart?.verifyConnection.data?.verification?.presentationRecord
    );
    const values = verifyConnectionObj?.presentation?.requested_proof?.revealed_attrs;

    const keys = Object.keys(verifyConnectionObj?.presentation_request?.requested_attributes)
    let tableObj = {};

    keys.map((i) => {
        tableObj[verifyConnectionObj?.presentation_request?.requested_attributes[i]?.name] = values[i]?.raw  
    });

    const tableData = []
    Object.keys(tableObj).map((key) => {
        tableData.push({ attribute: key, value: tableObj[key] })
    });
    return (
        <>
            <Box component="div" className='businessInfo'>
                <Typography gutterBottom component="div">{t('gettingStarted.confirmWalletDescription')}</Typography>
                <Box className="certificateTxt">{t('common.certificateOfRegistration')}</Box>
            </Box>
            <Box className='confirmTable'>
                <BasicTable 
                    isColumnWise={true} 
                    tableData={tableData} 
                    tableField={TableHead} 
                    customTableHeadClass={"mui-table-bordered"}
                    customTableBodyClass={"mui-table-bordered"}
                />
            </Box>

        </>
    );
}

export default ConfirmComponent;