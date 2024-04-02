import React, { useState } from 'react';
import BasicTable from '../../component/Table';
import { TableData, TableHead } from './tableUtils'
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import './style.scss';
import { useTranslation } from 'react-i18next';
import ViewDataAgreementModal from './ViewDDAgreementModal';

const DDAgreements = () => {
    const [selectedValue, setSelectedValue] = useState(true)
   
    const { t } = useTranslation('translation');

    return(
        <>
            <Box sx={{ margin: '15px 10px' }} className="dd-container">
                <Box className="d-flex space-between">
                    <span className="dd-titleTxt">{t('dataAgreements.title')}</span>
                    <Box component="div">
                        <FormControl component="fieldset">
                            <RadioGroup row value={selectedValue}>
                                <FormControlLabel value={selectedValue} control={<Radio size='small' />} label={t('dataAgreements.all')} labelPlacement='end' />
                                <FormControlLabel value={2} control={<Radio size='small' />} label={t('dataAgreements.list')} labelPlacement='end' />
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{ marginTop: "16px" }}>
                    {t("dataAgreements.pageDescription")}
                </Typography>
                <Box sx={{ marginTop: '16px' }}>
                    <BasicTable tableData={TableData} tableField={TableHead} />
                </Box>
            </Box>
        </>
    )
}

export default DDAgreements;