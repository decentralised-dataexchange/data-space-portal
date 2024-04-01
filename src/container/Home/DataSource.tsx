import React, { useState } from 'react';
import {
    Typography,
    Button,
    Box
} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import dexcom from '../../../public/img/dexcom.png';
import symbiome from '../../../public/img/symbiome.png';
import medtronic from '../../../public/img/medtronic.png';
import glooko from '../../../public/img/glooko.png';
import oneTwo from '../../../public/img/oneTwo.svg';
import appleHealth from '../../../public/img/appleHealth.png';
import { useTranslation } from "react-i18next";

interface DataSourceCardProp {
    description: string,
    logoName: string
}

const DataSourceCard = ({ logoName, description }: DataSourceCardProp) => {
    const { t } = useTranslation("translation");
    const [ moreOrLessTxt, setMoreOrLessTxt] = useState(`${t('home.readMore')}`)
    const readMore = (txt) => {
        setMoreOrLessTxt(txt === `${t('home.readMore')}` ? `${t('home.readLess')}` : `${t('home.readMore')}`);
    }

    const renderImage = (img) => {
        switch (img) {
            case "dexcom":
                return dexcom
            case "medtronic":
                return medtronic
            case "symbiome":
                return symbiome;
            case "glooko":
                return glooko;
            case "oneTwo":
                return oneTwo;
            case "appleHealth":
                return appleHealth;
        }
    }

    return (
        <>
            <Card className='cardContainer'>
                <Box component="div" className='card-header'>
                    <CardMedia
                        component="img"
                        image={renderImage(logoName)}
                        alt="symbiome"
                        className='logo'
                    />
                </Box>
                <CardContent>
                    <Typography gutterBottom component="div" className="card-body" sx={{ fontSize: "14px" }}>
                        {moreOrLessTxt === 'Read Less....' ? description : description.slice(0, 275)}
                        {description?.length > 275 &&
                            <Typography className="readmore" component="span" sx={{ fontSize: "14px" }}>
                                {/* <Box onClick={() => readMore(moreOrLessTxt)}>({moreOrLessTxt})</Box> */}
                            </Typography>
                        }
                    </Typography>
                    <Box className="actionBtn">
                        <Button size="small" sx={{fontSize: "14px"}} >
                            {t('home.btn-signData')}
                        </Button>
                        <Button size="small"  sx={{fontSize: "14px"}}>
                            {t('home.btn-viewMetadata')}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </>
    )

}

export default DataSourceCard;