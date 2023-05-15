import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import { React, useEffect, useState } from "react";

function Tables(props) {
  const { setRow } = props;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [pageSize, setPageSize] = useState(props.rowsPerPageOptions[0]);

  // const handleSelectionModelChange = (selection) => {
  //   onSelectedRowsChange(selection);
  // };

  const handleRowClick = (params) => {
    setRow(params.row.id);
  };

  return (
    <Box>
      <Box
        m="20px 0 0 0"
        height={props.binsize === true ? "44vh" : "75vh"}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.blueAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
     

        <DataGrid
          pageSize={pageSize}
          rows={props.Rows}
          columns={props.Coulmns}
          onRowClick={handleRowClick}
          rowsPerPageOptions={props.rowsPerPageOptions}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      </Box>
    </Box>
  );
}

export default Tables;
