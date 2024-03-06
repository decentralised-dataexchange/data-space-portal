import React from 'react';
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
                            {description}<Typography className="readmore" component="span">(Read more.....)</Typography>
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