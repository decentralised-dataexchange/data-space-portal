import React from 'react';
import {
    Typography,
    Box,
} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import './style.scss';
import ViewCredentialsController from '@/components/DataSources/ViewCredentialsController';
import type { SoftwareStatementRecord } from '@/types/softwareStatement';

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

interface DataSource {
    description: string,
    logoUrl: string,
    id: string
    coverImageUrl: string,
    name: string,
    sector: string,
    location: string,
    policyUrl: string,
    trusted?: boolean;
    accessPointEndpoint?: string | null;
}

interface DataSourceCardProp {
    dataSource: DataSource
    dataDisclosureAgreements: DataDisclosureAgreement[];
    overviewLabel: string;
    signDataLabel: string;
    organisationIdentity?: any;
    softwareStatement?: SoftwareStatementRecord | Record<string, never>;
}

const DataSourceCard = ({ dataSource, dataDisclosureAgreements, overviewLabel, signDataLabel, organisationIdentity, softwareStatement }: DataSourceCardProp) => {
    const t = useTranslations();
    const trusted = Boolean(
        (organisationIdentity as any)?.presentationRecord?.verified ??
        (organisationIdentity as any)?.isPresentationVerified ??
        dataSource?.trusted ?? false
    );
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
                    <Avatar
                        src={dataSource?.logoUrl}
                        alt={dataSource?.name || 'Data Source'}
                        sx={{
                            position: 'absolute',
                            top: '40px',
                            left: '10px',
                            width: '100px',
                            height: '100px',
                            backgroundColor: 'white',
                            boxShadow: '0 0 0 5px white'
                        }}
                        imgProps={{ style: { objectFit: 'cover', width: '100%', height: '100%', display: 'block' } }}
                    />
                </CardMedia>
                <CardContent sx={{ padding: "20px" }}>
                    <Typography variant="h6" fontWeight="bold" className="org-name" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {dataSource?.name}
                        {/* Public page shield: show credential if verified, otherwise not-allowed and no click */}
                        <ViewCredentialsController
                          organisation={{
                            id: dataSource?.id,
                            name: dataSource?.name,
                            description: dataSource?.description,
                            location: dataSource?.location,
                            sector: dataSource?.sector,
                            policyUrl: dataSource?.policyUrl,
                            logoUrl: dataSource?.logoUrl,
                            coverImageUrl: dataSource?.coverImageUrl,
                            verificationRequestURLPrefix: '',
                            openApiUrl: '',
                            softwareStatement: softwareStatement as any,
                          } as any}
                          organisationIdentity={organisationIdentity}
                          trustedOverride={trusted}
                        />
                    </Typography>
                    {/* Access Point Endpoint removed from below avatar section */}
                    {dataSource?.location && (
                        <Typography variant="body2" className="datasource-location" sx={{ mb: 1 }}>
                            {dataSource.location}
                        </Typography>
                    )}
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
                            <Link href={`/data-source/read/${dataSource.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}>{signDataLabel}</Link>
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