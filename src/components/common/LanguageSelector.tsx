"use client"
import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { locales } from "@/constants/il8n";

const LanguageSelector: React.FC = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleChange = (newLocale: string) => {
    const pathname = window.location.pathname;
    const pathnameParts = pathname.split("/");
    
    // Check if the current path starts with a known locale
    const firstSegment = pathnameParts[1]; // First segment after leading slash
    const hasLocalePrefix = locales.includes(firstSegment);
    
    let pathWithoutLocale: string;
    if (hasLocalePrefix) {
      // Remove leading empty string and locale prefix
      pathWithoutLocale = '/' + pathnameParts.slice(2).join('/');
    } else {
      // No locale prefix, keep the path as-is (just remove leading empty string)
      pathWithoutLocale = pathname;
    }
    
    // Ensure pathWithoutLocale starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }
    
    // Construct new path with the new locale
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    // Navigate to the new locale path
    router.push(newPath);
    // Optionally store language preference
    localStorage.setItem("preferredLanguage", newLocale);
    setOpen(false);
  };

  return (
    <>
      <Button
        ref={anchorRef}
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{ textTransform: "capitalize !important", padding: 0, color: "black", fontSize: "12px" }}
      >
        {t('common.language')}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="top-start"
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleToggle}>
            <Menu
              id="dropdown-menu"
              anchorEl={anchorRef.current}
              keepMounted
              open={open}
              onClose={handleToggle}
              TransitionProps={TransitionProps}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              {locales.map((l) => {
                let label = l;
                switch (l) {
                  case "en": label = "English"; break;
                  case "sv": label = "Swedish"; break;
                  case "fi": label = "Finnish"; break;
                  case "es": label = "Spanish"; break;
                  case "no": label = "Norwegian"; break;
                  default: label = l;
                }
                return (
                  <MenuItem 
                    key={l}
                    style={{ fontSize: "12px" }} 
                    onClick={() => handleChange(l)}
                  >
                    {label}
                  </MenuItem>
                );
              })}
            </Menu>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default LanguageSelector;
