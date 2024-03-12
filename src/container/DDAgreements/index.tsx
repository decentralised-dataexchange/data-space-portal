import React from 'react';
import BasicTable from '../../component/Table';
import { TableData, TableHead } from './tableUtils'
import { Box } from '@mui/material';
import './style.scss';

const DDAgreements = () => {
    return(
        <Box sx={{ margin: '15px 10px'}}>
            <span className="dd-titleTxt">Data Disclosure Agreements</span>
            <Box sx={{ marginTop: '15px'}}>
                <BasicTable tableData={TableData} tableField={TableHead}/>
            </Box>
        </Box>
    )
}

export default DDAgreements;