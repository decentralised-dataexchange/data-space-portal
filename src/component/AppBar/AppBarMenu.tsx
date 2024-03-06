import React from "react";
import defaultAvatar from "../../../public/img//avatar.png";
import { IconButton } from "@mui/material";
import { useNavigate } from 'react-router-dom';


type Props = {
  firstName: string;
  email: string;
  lastVisited: string;
};

export const AppBarMenu = (props: Props) => {
  const navigate = useNavigate();
  const handleMenu = () => {
    navigate('/login');
  };

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        onClick={(handleMenu)}
        sx={{ marginLeft: "auto" }}
      >
          <img
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            src={defaultAvatar}
            alt="img"
          />
      </IconButton>
    </>
  );
};
