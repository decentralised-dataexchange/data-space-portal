import React, { useState } from 'react';
import {
    Typography,
    Button,
    Box,
    CardActionArea,
    CardActions
} from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import companyLogo from '../../../public/img/dexcom.png';

interface DataSourceCardProp {
    description: string,
    logo: string
}

const DataSourceCard = ({ logo, description }: DataSourceCardProp) => {
    const [ moreOrLessTxt, setMoreOrLessTxt] = useState('Read More....')
    const readMore = (txt) => {
        setMoreOrLessTxt(txt === 'Read More....' ? 'Read Less....' : 'Read More....');
    }
    return (
        <>
            <Card className='cardContainer'>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image={companyLogo}
                        alt="symbiome"
                        className='logo'
                    />
                    <CardContent>
                        <Typography gutterBottom component="div">
                            {moreOrLessTxt === 'Read Less....' ? description : description.slice(0, 275)}
                            { description?.length > 275 && 
                            <Typography className="readmore" component="span">
                                <Box onClick={() => readMore(moreOrLessTxt)}>({moreOrLessTxt})</Box>
                            </Typography>
                            }
                        </Typography>
                        <Box className="actionBtn">
                            <Button size="small" >
                                Sign Data Disclosure Agreement
                            </Button>
                            <Button size="small">
                                View MetaData and APIs
                            </Button>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )

}

export default DataSourceCard;