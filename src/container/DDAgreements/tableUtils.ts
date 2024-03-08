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
      headerWidth: "15%",
    },
    {
      field: "status",
      title: "Status",
    },
    {
      field: "",
      title: "",
    },
    {
      field: "",
      title: "",
    },
    {
      field: "",
      title: "",
    },
    {
      field: "",
      title: "",
    },
  ];
  
  export { TableHead, TableData  };