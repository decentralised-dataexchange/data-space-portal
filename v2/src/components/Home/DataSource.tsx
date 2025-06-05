import React from 'react';
import {
    Typography,
    Box,
} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';
import './style.scss';

export interface DataDisclosureAgreement {
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
    logoUrl?: string, // For backward compatibility
    description?: string, // For backward compatibility
    dataDisclosureAgreements: DataDisclosureAgreement[];
    overviewLabel: string;
    signDataLabel: string;
}

const DataSourceCard = ({ dataSource, dataDisclosureAgreements, overviewLabel, signDataLabel }: DataSourceCardProp) => {
    return (
        <>
            <Card className='cardContainer'>
                <CardMedia 
                    component="div" 
                    className='card-header' 
                    image={dataSource?.coverImageUrl}
                    sx={{
                        height: '100px',
                        position: 'relative',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <CardMedia
                        component="img"
                        image={dataSource?.logoUrl}
                        alt={dataSource?.name || 'Data Source'}
                        className='logo'
                        sx={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '40px',
                            left: '10px',
                            border: '5px solid white'
                        }}
                    />
                </CardMedia>
                <CardContent sx={{padding: "20px"}}>
                    <Typography variant="h6" fontWeight="bold">
                        {dataSource?.name}
                        <CheckCircleIcon className="verify" />
                    </Typography>
                    <Typography color="#9F9F9F" className='datasource-location'>
                        {dataSource?.location}
                    </Typography>
                    <Typography variant="subtitle1" className='datasource-overview-label'>
                        {overviewLabel}
                    </Typography>
                    <Typography gutterBottom component="div" className="card-body datasource-overview" sx={{ fontSize: "14px" }}>
                        {dataSource?.description.slice(0, 275)}
                        {dataSource?.description?.length > 275 &&
                            <Typography className="readmore" component="span" sx={{ fontSize: "14px" }}>
                                {/* <Box onClick={() => readMore(moreOrLessTxt)}>({moreOrLessTxt})</Box> */}
                            </Typography>
                        }
                    </Typography>
                    
                    <Box className="actionBtn">
                        {dataDisclosureAgreements.length > 0 ? (
                            <Link href={`/data-source/read/${dataSource.id}`}>{signDataLabel}</Link>
                        ) : (
                            <span className="disabled">{signDataLabel}</span>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </>
    )

}

export default DataSourceCard;