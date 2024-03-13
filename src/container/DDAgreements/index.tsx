import React from 'react';
import BasicTable from '../../component/Table';
import { TableData, TableHead } from './tableUtils'
import { Box, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import './style.scss';
import { useTranslation } from 'react-i18next';

const DDAgreements = () => {
    const { t } = useTranslation('translation');
    return(
        <Box sx={{ margin: '15px 10px'}} className="dd-container">
            <Box className="d-flex space-between">
                <span className="dd-titleTxt">{t('dataAgreements.title')}</span>
                <Box component="div">
                    <FormControl component="fieldset">
                        <RadioGroup row value=''>
                            <FormControlLabel value={1} control={<Radio />} label={t('dataAgreements.all')} labelPlacement='end' />
                            <FormControlLabel value={2} control={<Radio />} label={t('dataAgreements.list')} labelPlacement='end' />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Box>
            <Box sx={{ marginTop: '15px'}}>
                <BasicTable tableData={TableData} tableField={TableHead}/>
            </Box>
        </Box>
    )
}

export default DDAgreements;