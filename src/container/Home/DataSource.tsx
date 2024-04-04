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
    }
}

const DataSourceCard = ({ dataSource }: DataSourceCardProp) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { t } = useTranslation("translation");
    const [ moreOrLessTxt, setMoreOrLessTxt] = useState(`${t('home.readMore')}`)
    const readMore = (txt) => {
        setMoreOrLessTxt(txt === `${t('home.readMore')}` ? `${t('home.readLess')}` : `${t('home.readMore')}`);
    }

    const handleClick = (obj: DataSourceCardProp) => {
        dispatch(dataSourceEachList(obj));
        navigate('/data-source-list');
    }

    return (
        <>
            <Card className='cardContainer'>
                <Box component="div" className='card-header'>
                    <CardMedia
                        component="img"
                        image={dataSource?.logoUrl}
                        alt="symbiome"
                        className='logo'
                    />
                </Box>
                <CardContent>
                    <Typography gutterBottom component="div" className="card-body" sx={{ fontSize: "14px" }}>
                        {moreOrLessTxt === 'Read Less....' ? dataSource?.description : dataSource?.description.slice(0, 275)}
                        {dataSource?.description?.length > 275 &&
                            <Typography className="readmore" component="span" sx={{ fontSize: "14px" }}>
                                {/* <Box onClick={() => readMore(moreOrLessTxt)}>({moreOrLessTxt})</Box> */}
                            </Typography>
                        }
                    </Typography>
                    <Box className="actionBtn">
                        <Button size="small" sx={{fontSize: "14px"}} onClick={() => handleClick(dataSource)}>
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