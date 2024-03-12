import React from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const visibleIcon = () => {
  return (
    <VisibilityOutlinedIcon sx={{ color: '#696868'}}/>
  )
}

const publishIcon = () => {
  return (
    <PublishOutlinedIcon sx={{ color: '#b2b2b2'}}/>
  )
}

const deleteIcon = () => {
  return (
    <DeleteOutlineOutlinedIcon sx={{ color: '#b2b2b2'}}/>
  )
}

const TableData =  [
  {
    purpose: "Registration data",
    version: "1.0",
    lawfulProcess: "Contractual purpose",
    status: "Listed",
  },
  {
    purpose: "Covid-19 test results",
    version: "1.0",
    lawfulProcess: "Contractual purpose",
    status: "UnListed",
  },
  {
    purpose: "Third-party data sharing",
    version: "1.0",
    lawfulProcess: "consent",
    status: "Under Review",
  },
  {
    purpose: "Marketing and campaign",
    version: "1.0",
    lawfulProcess: "consent",
    status: "Rejected",
  },

  {
    purpose: "Marketing and campaign",
    version: "1.0",
    lawfulProcess: "consent",
    status: "Rejected",
  },

  {
    purpose: "Marketing and campaign",
    version: "1.0",
    lawfulProcess: "consent",
    status: "Rejected",
  },

  {
    purpose: "Marketing and campaign",
    version: "1.0",
    lawfulProcess: "consent",
    status: "Rejected",
  },
]

const TableHead =  [
    {
      title: "Usage purpose",
      field: "purpose",
    },
    {
      field: "version",
      title: "Version",
    },
    {
      field: "lawfulProcess",
      title: "Lawful basis of processing",
      headerWidth: "25%",
    },
    {
      field: "status",
      title: "Status",
    },
    {
      cell: publishIcon,
      title: "",
    },
    {
      cell: visibleIcon,
      title: "",
    },
    {
      cell: deleteIcon,
      title: "",
    }
  ];
  
  export { TableHead, TableData  };