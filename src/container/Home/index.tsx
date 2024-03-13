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
// icons
import { gridSpacing } from '../../constants/constant';
import DataSourceCard from './DataSource';
import './style.scss';
import Footer from "../../component/Footer";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
    const { t } = useTranslation("translation");
    const [selectedValue, setSelectedValue] = useState('option 1')

    const handleChange = (event) => {
        setSelectedValue(event.target.value)
    }
    const datasourceItems = [
        {
            id: 1,
            logoName: 'symbiome',
            url: '../../../public/img/dexcom.png',
            description: 'Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,cLorem ipsum dolor sit amet,oLorem ipsum dolor sit amet,nLorem ipsum dolor sit amet,svevctetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse'
        },
        {
            id: 2,
            logoName: 'dexcom',
            url: '../../../public/img/dexcom.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse '
        },
        {
            id: 3,
            logoName: 'medtronic',
            url: '../../../public/img/dexcom.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse '
        },
        {
            id: 4,
            logoName: 'glooko',
            url: '../../../public/img/dexcom.png',
            description: 'Lorem ipsum dolor sit amet, mnsbnsbvssbv bjhjhjanconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse '
        },
        {
            id: 5,
            logoName: 'onetwoDiabetes',
            url: '../../../public/img/dexcom.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse '
        },
        {
            id: 6,
            logoName: 'appleHealth',
            url: '../../../public/img/dexcom.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse '
        }
    ]
    return (
        <>
            <Box className="homeContainer">
                <Box component="div" className="breadCrumbContainer">
                    <Typography gutterBottom component="div">
                        {t('home.header')}
                    </Typography>
                </Box>
                <Box component="div" className='dataSourceSelectionContainer'>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Box className="title"><Typography gutterBottom component="div">{t('home.title')}</Typography></Box>
                        </Grid>
                        <Grid className='pt-0' item lg={6} md={6} sm={12} xs={12} container justifyContent={'flex-end'}>
                            <Box component="div">
                                <FormControl component="fieldset">
                                    <RadioGroup row value={selectedValue} onChange={handleChange}>
                                        <FormControlLabel value={1} control={<Radio />} label={t('home.check-box-all')} labelPlacement='end' />
                                        <FormControlLabel value={2} control={<Radio />} label={t('home.check-box-org')} labelPlacement='end' />
                                        <FormControlLabel value={3} control={<Radio />} label={t('home.check-box-devices')} labelPlacement='end' />
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
                                {datasourceItems.map((dataSource) => {
                                    return (
                                        <Grid item lg={4} md={6} sm={6} xs={12}>
                                            <DataSourceCard logo={dataSource.url} description={dataSource.description} />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box className="footerContainer">
                <Footer txt={t('home.footerTxt')} direction="row"/>
            </Box>
    </>
    )
}

export default LandingPage;