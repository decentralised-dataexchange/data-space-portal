import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Logo from "@/assets/img/logo.jpg";
import Link from "next/link"
import Image from "next/image";
import { useTranslations} from 'next-intl';
import './styles.scss';
import { usePathname } from 'next/navigation';

export default function CustomMinimalAppBar() {
  const t = useTranslations('appBar');
  const pathname = usePathname();
  const pathnameWithoutLocale = pathname.split('/').at(-1);
  
  return (
    <Box className="appBarContainer">
    <AppBar
      sx={{
        backgroundColor: "#00182C",
        height: 80,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar>
         <Link href="/">
           <Image className='logoImg' src={Logo} alt={`${t("header")} logo`} width={58} />
         </Link>
        <Link className="navHeaderTextLink" href="/">
          <Typography
          className="headerText"
              sx={{
                fontSize:{ sm: '1rem', md: '1.5rem' },
                lineHeight: 1
              }}
            >
              {t('header')}
            </Typography>
            <Typography
            className="subHeaderText"
              sx={{
                fontSize:{ sm: '0.6rem', md: '1.1rem' },
              }}
            >
              {t('subHeader')}
            </Typography>
        </Link>
        {
          pathnameWithoutLocale === 'login' ? null : (
            <Button variant="contained" component={Link} href="/login" className="loginBtn">
            Login
          </Button>
          )
        }
      </Toolbar>
    </AppBar>
  </Box>
  );
}
