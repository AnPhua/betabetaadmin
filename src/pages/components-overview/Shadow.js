import React from 'react';
import { Grid } from '@mui/material';
import MainCard from 'components/MainCard';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridToolbarContainer, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';
const convertToDateObject = (dateString) => {
  const [month, day, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
};
const initialRows = [
  {
    id: 1,
    name: 'ChoiWooJe',
    age: 5,
    joinDate: convertToDateObject('2024/04/04'),
    role: 'Player'
  },
  {
    id: 2,
    name: 'MoonHyeonJoon',
    age: 21,
    joinDate: convertToDateObject('2024/04/04'),
    role: 'Player'
  },
  {
    id: 3,
    name: 'LeeSangHyeok',
    age: 27,
    joinDate: convertToDateObject('2024/04/04'),
    role: 'Player'
  },
  {
    id: 4,
    name: 'LeeMinHyeong',
    age: 21,
    joinDate: convertToDateObject('2024/04/04'),
    role: 'Player'
  },
  {
    id: 5,
    name: 'RyuMinSeok',
    age: 21,
    joinDate: convertToDateObject('2024/04/04'),
    role: 'Player'
  }
];

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: 'edit', fieldToFocus: 'name' }
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

const ComponentShadow = () => {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: 'edit' } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: 'view' } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: 'view', ignoreModifications: true }
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 180, editable: true },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true
    },

    {
      field: 'joinDate',
      headerName: 'Join date',
      type: 'date',
      width: 180,
      editable: true,
      valueGetter: (params) => new Date(params.value)
    },
    {
      field: 'role',
      headerName: 'Roles',
      width: 220,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Player', 'Coach']
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === 'edit';

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`save_${id}`}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main'
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`cancel_${id}`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ];
        }

        return [
          <GridActionsCellItem
            key={`edit_${id}`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem key={`delete_${id}`} icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />
        ];
      }
    }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="Basic Shadow" codeHighlight>
          <Grid container spacing={0}>
            <Box
              sx={{
                height: 500,
                width: '100%',
                '& .actions': {
                  color: 'text.secondary'
                },
                '& .textPrimary': {
                  color: 'text.primary'
                }
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                  toolbar: EditToolbar
                }}
                slotProps={{
                  toolbar: { setRows, setRowModesModel }
                }}
              />
            </Box>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ComponentShadow;
