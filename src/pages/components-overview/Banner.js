import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Image, Upload, Input, Button } from 'antd';
import MainCard from 'components/MainCard';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { GetAllBanners } from '../../services/controller/AdminController';

const ComponentBanner = () => {
  const [rows, setRows] = React.useState([]);
  const [fileList, setFileList] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const onChangeforupload = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };
  React.useEffect(() => {
    getAllBanners1();
  }, []);
  const getAllBanners1 = async () => {
    let res = await GetAllBanners();
    if (res && res.data) {
      setRows(res.data);
    }
  };
  // const handleRowEditStop = (params, event) => {
  //   if (params.reason === GridRowEditStopReasons.rowFocusOut) {
  //     event.defaultMuiPrevented = true;
  //   }
  // };

  // const handleEditClick = (id) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: 'edit' } });
  // };

  // const handleSaveClick = (id) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: 'view' } });
  // };

  // const handleDeleteClick = (id) => () => {
  //   setRows(rows.filter((row) => row.id !== id));
  // };

  // const handleCancelClick = (id) => () => {
  //   setRowModesModel({
  //     ...rowModesModel,
  //     [id]: { mode: 'view', ignoreModifications: true }
  //   });

  //   const editedRow = rows.find((row) => row.id === id);
  //   if (editedRow.isNew) {
  //     setRows(rows.filter((row) => row.id !== id));
  //   }
  // };

  // const processRowUpdate = (newRow) => {
  //   const updatedRow = { ...newRow, isNew: false };
  //   setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
  //   return updatedRow;
  // };

  // const handleRowModesModelChange = (newRowModesModel) => {
  //   setRowModesModel(newRowModesModel);
  // };

  const columns = [
    {
      field: 'imageUrl',
      headerName: 'Ảnh',
      width: 300,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      renderCell: (params) => <Image src={params.value} alt={params.value} width="100%" height="auto" />
    },
    {
      field: 'title',
      headerName: 'Tiêu Đề',
      type: 'string',
      width: 80,
      align: 'left',
      headerAlign: 'left',
      editable: true
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
              //onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`cancel_${id}`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              //onClick={handleCancelClick(id)}
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
            // onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`delete_${id}`}
            icon={<DeleteIcon />}
            label="Delete"
            // onClick={handleDeleteClick(id)}
            color="inherit"
          />
        ];
      }
    }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="BANNER" codeHighlight sx={{ borderWidth: 2 }}>
          <Grid container spacing={0} direction="row" alignItems="center">
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
                slotProps={{
                  toolbar: { setRows, setRowModesModel }
                }}
                columnBuffer={8}
                rowHeight={100}
                checkboxSelection
              />
            </Box>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={5}>
        <MainCard title="THÊM BANNER" codeHighlight sx={{ borderWidth: 2 }}>
          <Grid container spacing={0}>
            <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
              <Grid item xs={2}>
                <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                  ImageUrl
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChangeforupload}
                  maxCount={1}
                >
                  {fileList.length === 0 && '+ Chọn Ảnh'}
                </Upload>
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
              <Grid item xs={2}>
                <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                  Title
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Input placeholder="Title" />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
              <Grid item xs={2}>
                <Typography variant="subtitle1" gutterBottom alignItem="center" align="center"></Typography>
              </Grid>
              <Grid item xs={3}>
                <Button type="primary" danger>
                  Thêm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default ComponentBanner;
