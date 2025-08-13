"use client"

import React, { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import IconButton from '@mui/material/IconButton';
import { PlusCircleIcon, TrashSimpleIcon } from '@phosphor-icons/react';
import '../style.scss';

const Container = styled("div")(({ theme }) => ({
  margin: "0px 15px 0px 15px",
  paddingBottom: "50px",
  [theme.breakpoints.down("sm")]: {
    margin: "10px",
  },
}));

const HeaderContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  marginTop: "10px",
});

const BusinessWalletTable = styled("div")({
  marginTop: "20px",
  width: "100%",
  backgroundColor: "#FFFFFF",
  borderRadius: "7px",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
});

const TableHeader = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  padding: "15px",
  borderBottom: "1px solid #DFDFDF",
  backgroundColor: "#F7F7F7",
});

const TableRow = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  padding: "15px",
  borderBottom: "1px solid #DFDFDF",
  "&:last-child": {
    borderBottom: "none",
  },
});

const SearchBox = styled(TextField)({
  width: "300px",
  marginLeft: "auto",
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
  },
});

const BusinessWallet = () => {
  const t = useTranslations();
  const [connections, setConnections] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredConnections = connections.filter(conn =>
    conn.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conn.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = (id: string) => {
    // In a real app, this would call an API to delete the connection
    // For example: apiService.deleteBusinessWalletConnection(id)
    setConnections(connections.filter(conn => conn.id !== id));
  };

  const handleAddNewConnection = () => {
    // TODO: implement add new business wallet connection
    console.log('Add new business wallet connection');
  };

  return (
    <Container className="pageContainer">
      <HeaderContainer>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: "0.5rem" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ fontSize: '20px' }}>
              {t('breadcrumbs.businessWallet')}
            </Typography>
            <IconButton onClick={handleAddNewConnection} aria-label={t('common.add')} sx={{ padding: 0}}>
              <PlusCircleIcon size={22} color="black" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '14px' }}>
              {t('businessWallet.subtitle')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SearchBox
                placeholder="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  sx: { paddingRight: 1 }
                }}
              />
            </Box>
          </Box>
        </Box>
      </HeaderContainer>



      <BusinessWalletTable>
        <TableHeader>
          <Typography variant="subtitle2" fontWeight="bold">
            {t('businessWallet.label')}
          </Typography>
          <Typography variant="subtitle2" fontWeight="bold">
            {t('businessWallet.connectedOn')}
          </Typography>
          <Typography variant="subtitle2" fontWeight="bold">
            {t('businessWallet.connectionId')}
          </Typography>
        </TableHeader>

        {filteredConnections.length > 0 ? (
          filteredConnections.map((connection) => (
            <TableRow key={connection.id}>
              <Typography variant="body2">{connection.label}</Typography>
              <Typography variant="body2">{formatDate(connection.connectedOn)}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">{connection.id}</Typography>
                <TrashSimpleIcon
                  className="delete-icon"
                  onClick={() => handleDelete(connection.id)}
                />
              </Box>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <Typography variant="body2" sx={{ gridColumn: '1 / span 3', textAlign: 'center' }}>
              {searchTerm ? t('common.noResultsFound') : t('common.noData', { fallback: "No connections available" })}
            </Typography>
          </TableRow> 
        )}
      </BusinessWalletTable>
    </Container>
  );
};

export default BusinessWallet;
