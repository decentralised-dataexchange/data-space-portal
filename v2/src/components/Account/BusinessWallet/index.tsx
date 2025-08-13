"use client"

import React, { useState } from "react";
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
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
});

// Match DDA table cell styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: "0.875rem",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.87)",
    padding: "6px 16px",
    border: "1px solid #D7D6D6",
    backgroundColor: "#e5e4e4",
    whiteSpace: 'nowrap',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.875rem",
    fontWeight: "lighter",
    color: "rgba(0, 0, 0, 0.87)",
    padding: "6px 16px",
    border: "1px solid #D7D6D6",
    whiteSpace: 'nowrap',
  },
}));

const StyledTableRow = styled(TableRow)({
  border: "1px solid #D7D6D6",
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
        <TableContainer sx={{ backgroundColor: '#FFFF', borderRadius: 0, overflowY: 'hidden', overflowX: 'auto' }}>
          <Table size="small" aria-label="business wallet table">
            <TableHead>
              <TableRow>
                <StyledTableCell>{t('businessWallet.label')}</StyledTableCell>
                <StyledTableCell>{t('businessWallet.connectedOn')}</StyledTableCell>
                <StyledTableCell>{t('businessWallet.connectionId')}</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredConnections.length > 0 ? (
                filteredConnections.map((connection) => (
                  <StyledTableRow key={connection.id}>
                    <StyledTableCell>{connection.label}</StyledTableCell>
                    <StyledTableCell>{formatDate(connection.connectedOn)}</StyledTableCell>
                    <StyledTableCell
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: 'none',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{connection.id}</Typography>
                      <TrashSimpleIcon
                        className="delete-icon"
                        onClick={() => handleDelete(connection.id)}
                        style={{ cursor: 'pointer' }}
                        size={17}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell colSpan={3} align="center">
                    {searchTerm ? t('common.noResultsFound') : t('common.noData', { fallback: "No connections available" })}
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </BusinessWalletTable>
    </Container>
  );
};

export default BusinessWallet;
