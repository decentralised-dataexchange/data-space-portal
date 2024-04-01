import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React from 'react';
import { gridSpacing } from '../../constants/constant';
import { useTranslation } from "react-i18next";
import dexcom from '../../../public/img/dexcom.png';

const datasourceItems = [
    {
        id: 1,
        logoName: 'symbiome',
        url: 'symbiome',
        description: 'Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,cLorem ipsum dolor sit amet,oLorem ipsum dolor sit amet,nLorem ipsum dolor sit amet,svevctetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse'
    },
]

const DataSourceListing = () => {
    const { t } = useTranslation("translation");
    return (
        <Box className="dataListContainer">
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={4} md={12} sm={12} xs={12} className='leftContainer'>
                            <Card className='cardContainerList leftSection'>
                                <Box component="div" className='card-header'>
                                    <CardMedia
                                        component="img"
                                        image={dexcom}
                                        alt="symbiome"
                                        className='logo'
                                    />
                                </Box>
                                <Box className='policyUrl'>
                                    Policy URL
                                </Box>
                                <CardContent>
                                    <Typography gutterBottom component="div" className="card-body" sx={{ fontSize: "14px" }}>
                                    Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet,cLorem ipsum dolor sit amet,oLorem ipsum dolor sit amet,nLorem ipsum dolor sit amet,svevctetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item lg={8} md={12} sm={12} xs={12} className='rightContainer'>
                            <Card className='cardContainerList'>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px" }}>
                                            Data Disclosure Agreement: Diabetes Patient Data Summary and Stastics
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                            Data Disclosure Agreement Description
                                        </Typography>
                                    <Box className="actionListingBtn d-flex" sx={{ justifyContent: 'flex-end'}}>
                                        <Button size="small"  sx={{fontSize: "14px"}}>
                                            {t('home.btn-viewMetadata')}
                                        </Button>
                                        <Button size="small" sx={{fontSize: "14px"}} >
                                            {t('home.btn-signData')}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Card className='cardContainerList'>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px" }}>
                                            Data Disclosure Agreement: Diabetes Patient Data Summary and Stastics
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                            Data Disclosure Agreement Description
                                        </Typography>
                                    <Box className="actionListingBtn d-flex" sx={{ justifyContent: 'flex-end'}}>
                                        <Button size="small"  sx={{fontSize: "14px"}}>
                                            {t('home.btn-viewMetadata')}
                                        </Button>
                                        <Button size="small" sx={{fontSize: "14px"}} >
                                            {t('home.btn-signData')}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Card className='cardContainerList'>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px" }}>
                                            Data Disclosure Agreement: Diabetes Patient Data Summary and Stastics
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                            Data Disclosure Agreement Description
                                        </Typography>
                                    <Box className="actionListingBtn d-flex" sx={{ justifyContent: 'flex-end'}}>
                                        <Button size="small"  sx={{fontSize: "14px"}}>
                                            {t('home.btn-viewMetadata')}
                                        </Button>
                                        <Button size="small" sx={{fontSize: "14px"}} >
                                            {t('home.btn-signData')}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Card className='cardContainerList'>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px" }}>
                                            Data Disclosure Agreement: Diabetes Patient Data Summary and Stastics
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                            Data Disclosure Agreement Description
                                        </Typography>
                                    <Box className="actionListingBtn d-flex" sx={{ justifyContent: 'flex-end'}}>
                                        <Button size="small"  sx={{fontSize: "14px"}}>
                                            {t('home.btn-viewMetadata')}
                                        </Button>
                                        <Button size="small" sx={{fontSize: "14px"}} >
                                            {t('home.btn-signData')}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                            <Card className='cardContainerList'>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px" }}>
                                            Data Disclosure Agreement: Diabetes Patient Data Summary and Stastics
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                            Data Disclosure Agreement Description
                                        </Typography>
                                    <Box className="actionListingBtn d-flex" sx={{ justifyContent: 'flex-end'}}>
                                        <Button size="small"  sx={{fontSize: "14px"}}>
                                            {t('home.btn-viewMetadata')}
                                        </Button>
                                        <Button size="small" sx={{fontSize: "14px"}} >
                                            {t('home.btn-signData')}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default DataSourceListing;