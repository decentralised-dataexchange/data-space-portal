import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { gridSpacing } from '../../constants/constant';
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../customHooks";
import { Link, useNavigate } from 'react-router-dom';
import ViewDataAgreementModalInner from '../../container/DDAgreements/ViewDDAgreementModalInner';
import "rapidoc";
import { openApiUrlAction } from '../../redux/actionCreators/dataSource';

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
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const dataSourceItems = useAppSelector(
        (state) => state?.dataSourceList?.list
    );
    const [isOpenViewDDA, setIsOpenViewDDA] = useState(false);
    const [selectedDDA, setSelectedDDA] = useState<any>();
    const [ moreOrLessTxt, setMoreOrLessTxt] = useState(`${t('home.readMore')}`)
    const readMore = (txt) => {
        setMoreOrLessTxt(txt === `${t('home.readMore')}` ? `${t('home.readLess')}` : `${t('home.readMore')}`);
    }

    const handleClick = (item) => {
        setSelectedDDA(item);
        setIsOpenViewDDA(true);
      };

    const handleViewApiClick = () => {
        const openApiUrl = dataSourceItems?.dataSource?.openApiUrl;
        if (openApiUrl.length > 0){
            dispatch(openApiUrlAction(openApiUrl));
            navigate(t('route.apiDoc'));
        }
    }

    useEffect(() => {
        !dataSourceItems?.dataSource && navigate('/');
    }, []);

    const { openApiUrl } = dataSourceItems && dataSourceItems?.dataSource || '';

    return (
        <Box className="dataListContainer">
            <ViewDataAgreementModalInner
                open={isOpenViewDDA}
                setOpen={setIsOpenViewDDA}
                mode={"public"}
                selectedData={selectedDDA}
                dataSourceName={dataSourceItems?.dataSource?.name}
                dataSourceLocation={dataSourceItems?.dataSource?.location}
                dataSourceDescription={dataSourceItems?.dataSource?.description}
                coverImage={dataSourceItems?.dataSource?.coverImageUrl}
                logoImage={dataSourceItems?.dataSource?.logoUrl}
            />

            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={4} md={12} sm={12} xs={12} className='leftContainer'>
                            <Card className='leftSection'>
                                <CardMedia component="div" className='card-header'  image={dataSourceItems?.dataSource?.coverImageUrl}>
                                    <CardMedia
                                        component="img"
                                        image={dataSourceItems?.dataSource?.logoUrl}
                                        alt="symbiome"
                                        className='logo'
                                    />
                                </CardMedia>
                                {/* <Box className='policyUrl'>
                                    {dataSourceItems?.policyUrl}
                                </Box> */}
                                <CardContent>
                                <Typography variant="h6" fontWeight="bold">
                                    {dataSourceItems?.dataSource?.name}
                                </Typography>
                                <Typography color="#9F9F9F" className='datasource-location'>
                                    {dataSourceItems?.dataSource?.location}
                                </Typography>
                                <Typography variant="subtitle1" className='datasource-overview-label'>
                                    {t("common.overView")}
                                </Typography>
                                <Typography gutterBottom component="div" className="card-body datasource-overview" sx={{ fontSize: "14px" }}>
                                    {moreOrLessTxt === 'Read Less....' ? dataSourceItems?.dataSource?.description : dataSourceItems?.dataSource?.description.slice(0, 275)}
                                    {dataSourceItems?.dataSource?.description?.length > 275 &&
                                        <Typography className="readmore" component="span" sx={{ fontSize: "14px" }}>
                                            {/* <Box onClick={() => readMore(moreOrLessTxt)}>({moreOrLessTxt})</Box> */}
                                        </Typography>
                                    }
                                </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item lg={8} md={12} sm={12} xs={12} className='rightContainer'>
                            {dataSourceItems?.dataDisclosureAgreements?.map((dataDisclosureAgreement, index) => {
                                        return (
                                            <Card key={index} className='cardContainerList'>
                                                <CardContent>
                                                    <Typography variant="h6" sx={{ fontSize: "20px", paddingBottom: "20px" }}>
                                                        {dataDisclosureAgreement?.purpose}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "14px" }}>
                                                        {dataDisclosureAgreement?.purposeDescription}
                                                    </Typography>
                                                    <Box className="actionListingBtn d-flex" sx={{ justifyContent: 'flex-end'}}>
                                                        {/* <Link to={t('route.apiDoc')}  state={openApiUrl}> */}
                                                            <Button size="small"  sx={{fontSize: "14px"}} onClick={() => handleViewApiClick()} disabled={!openApiUrl}>
                                                                {t('home.btn-viewMetadata')}
                                                            </Button>
                                                        {/* </Link> */}
                                                        <Button size="small" sx={{fontSize: "14px"}} onClick={() => handleClick(dataDisclosureAgreement)} >
                                                            {t('home.btn-signData')}
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default DataSourceListing;