import {
    Box,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography,
    FormControl
} from "@mui/material";
import React from 'react';
import DataSourceCard from './DataSource';
import { apiService } from '@/lib/apiService/apiService';
import { useTranslations } from "next-intl";
import Loader from '@/components/common/Loader';
import './style.scss';

const LandingPage = async () => {
    const t = useTranslations("home");
    const dataSourceItems = await apiService.listDataDisclosureAgreements("listed", 10, 0)
    console.log("dataSourceItems", dataSourceItems.data.dataSources)
    return (
        <>
         {
            dataSourceItems?.length > 0 ? 
            <Box className="homeContainer">
                <Box component="div" className='dataSourceSelectionContainer'>
                    <Grid container spacing={3}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Typography gutterBottom component="div" className="title">{t('home.title')}</Typography>
                        </Grid>
                        <Grid className='pt-0' item lg={6} md={6} sm={12} xs={12} container justifyContent={'flex-end'}>
                            <Box component="div">
                                <FormControl component="fieldset">
                                    <RadioGroup row value={1} >
                                        <FormControlLabel value={1} control={<Radio  size='small' />} label={t('home.check-box-all')} labelPlacement='end' />
                                        <FormControlLabel value={2} className="data-source-filter" control={<Radio size='small'  />} disabled label={t('home.check-box-org')} labelPlacement='end' />
                                        <FormControlLabel value={3} className="data-source-filter" control={<Radio size='small'  />} disabled label={t('home.check-box-devices')} labelPlacement='end' />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box className="landingPageContainer">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
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