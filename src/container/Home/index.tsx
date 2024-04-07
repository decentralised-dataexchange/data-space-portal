import {
    Box,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography,
    FormControl
} from "@mui/material";
import React, { useState } from 'react';
import { gridSpacing } from '../../constants/constant';
import DataSourceCard from './DataSource';
import './style.scss';
import { useAppSelector } from "../../customHooks";
import { useTranslation } from "react-i18next";
import Loader from "../../component/Loader";

const LandingPage = () => {
    const { t } = useTranslation("translation");
    const [selectedValue, setSelectedValue] = useState('option 1')

    const dataSourceItems = useAppSelector(
        (state) => state?.dataSourceList?.data?.dataSources
      );

    const handleChange = (event) => {
        setSelectedValue(event.target.value)
    }
    return (
        <>
         {
            dataSourceItems?.length > 0 ? 
            <Box className="homeContainer">
                {/* <Box component="div" className="breadCrumbContainer">
                    <Typography gutterBottom component="div">
                        {t('home.header')}
                    </Typography>
                </Box> */}
                
                <Box component="div" className='dataSourceSelectionContainer'>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Typography gutterBottom component="div" className="title">{t('home.title')}</Typography>
                        </Grid>
                        <Grid className='pt-0' item lg={6} md={6} sm={12} xs={12} container justifyContent={'flex-end'}>
                            <Box component="div">
                                <FormControl component="fieldset">
                                    <RadioGroup row value={selectedValue} onChange={handleChange}>
                                        <FormControlLabel value={selectedValue} control={<Radio  size='small' />} label={t('home.check-box-all')} labelPlacement='end' />
                                        <FormControlLabel value={2} className="data-source-filter" control={<Radio size='small'  />} disabled label={t('home.check-box-org')} labelPlacement='end' />
                                        <FormControlLabel value={3} className="data-source-filter" control={<Radio size='small'  />} disabled label={t('home.check-box-devices')} labelPlacement='end' />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box className="landingPageContainer">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                {dataSourceItems?.map((dataSourceItem, index) => {
                                    return (
                                        <Grid item lg={3} md={6} sm={6} xs={12} key={index}>
                                            <DataSourceCard
                                                dataSource={dataSourceItem.dataSource}
                                                logoUrl={dataSourceItem.dataSource.logoUrl}
                                                description={dataSourceItem.dataSource.description}
                                                dataDisclosureAgreements={dataSourceItem.dataDisclosureAgreements}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            : 
            <Loader />
         }
    </>
    )
}

export default LandingPage;