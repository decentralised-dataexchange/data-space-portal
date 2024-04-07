import React, { useState } from 'react';
import {
    Typography,
    Button,
    Box,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useTranslation } from "react-i18next";
import { dataSourceEachList } from '../../redux/actionCreators/dataSource'
import { useAppDispatch, useAppSelector } from "../../customHooks";

interface DataDisclosureAgreement {
    purpose: string
    version: string
    language: string
    connection: Connection
    templateId: string
    lawfulBasis: string
    personalData: PersonalDaum[]
    codeOfConduct: string
    dataController: DataController
    agreementPeriod: number
    purposeDescription: string
    dataSharingRestrictions: DataSharingRestrictions
    status: string
    isLatestVersion: boolean
}

interface Connection {
    invitationUrl: string
}

interface PersonalDaum {
    attributeId: string
    attributeName: string
    attributeDescription: string
}

interface DataController {
    did: string
    url: string
    name: string
    legalId: string
    industrySector: string
}

interface DataSharingRestrictions {
    policyUrl: string
    jurisdiction: string
    industrySector: string
    storageLocation: string
    dataRetentionPeriod: number
    geographicRestriction: string
}

interface DataSourceCardProp {
    dataSource: {
        description: string,
        logoUrl: string,
        id: string
        coverImageUrl: string,
        name: string,
        sector: string,
        location: string,
        policyUrl: string,
    },
    dataDisclosureAgreements: DataDisclosureAgreement[]
}

const DataSourceCard = ({ dataSource, dataDisclosureAgreements }: DataSourceCardProp) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation("translation");
    const [ moreOrLessTxt, setMoreOrLessTxt] = useState(`${t('home.readMore')}`)
    const readMore = (txt) => {
        setMoreOrLessTxt(txt === `${t('home.readMore')}` ? `${t('home.readLess')}` : `${t('home.readMore')}`);
    }

    const handleClick = (obj: DataSourceCardProp) => {
        dispatch(dataSourceEachList(obj));
        navigate('/data-source/read');
    }

    return (
        <>
            <Card className='cardContainer'>
                <CardMedia component="div" className='card-header' image={dataSource?.coverImageUrl}>
                    <CardMedia
                        component="img"
                        image={dataSource?.logoUrl}
                        alt="symbiome"
                        className='logo'
                    />
                </CardMedia>
                <CardContent sx={{padding: "20px"}}>
                    <Typography variant="h6" fontWeight="bold">
                        {dataSource?.name}
                    </Typography>
                    <Typography color="#9F9F9F" className='datasource-location'>
                        {dataSource?.location}
                    </Typography>
                    <Typography variant="subtitle1" className='datasource-overview-label'>
                        {t("common.overView")}
                    </Typography>
                    <Typography gutterBottom component="div" className="card-body datasource-overview" sx={{ fontSize: "14px" }}>
                        {moreOrLessTxt === 'Read Less....' ? dataSource?.description : dataSource?.description.slice(0, 275)}
                        {dataSource?.description?.length > 275 &&
                            <Typography className="readmore" component="span" sx={{ fontSize: "14px" }}>
                                {/* <Box onClick={() => readMore(moreOrLessTxt)}>({moreOrLessTxt})</Box> */}
                            </Typography>
                        }
                    </Typography>
                    
                    <Box className="actionBtn">
                        <Button size="small" sx={{fontSize: "14px"}} onClick={() => handleClick({dataSource, dataDisclosureAgreements})}>
                            {t('home.btn-signData')}
                        </Button>
                        {/* <Button size="small"  sx={{fontSize: "14px"}}>
                            {t('home.btn-viewMetadata')}
                        </Button> */}
                    </Box>
                </CardContent>
            </Card>
        </>
    )

}

export default DataSourceCard;