import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { Image, Input, Button, Upload, notification } from 'antd';
import MainCard from 'components/MainCard';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { GetAllBannersNoPagination, CreateBanner, DeleteBanner } from '../../services/controller/AdminController';

const ComponentBanner = () => {
  const [rows, setRows] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [addtitle, setAddtitle] = useState('');
  const onChangeforupload = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };
  const resetForm = () => {
    setFileList([]);
    setAddtitle('');
  };
  useEffect(() => {
    getAllBanners1();
  }, []);
  const addANewBanner = async () => {
    const formData = new FormData();
    if (!fileList || fileList.length === 0 || !fileList[0].originFileObj) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng chọn ảnh!'
      });
      return;
    }
    if (!addtitle) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập tiêu đề!'
      });
      return;
    }
    formData.append('ImageUrl', fileList[0].originFileObj);
    formData.append('Title', addtitle);
    await CreateBanner(formData);
    await getAllBanners1();
    resetForm();
  };

  const handleDeleteClick = async (id) => {
    await DeleteBanner(id);
    await getAllBanners1();
  };
  const getAllBanners1 = async () => {
    let res = await GetAllBannersNoPagination();
    if (res) {
      setRows(res);
    }
  };
  const columns = [
    {
      field: 'imageUrl',
      headerName: 'Ảnh',
      width: 600,
      align: 'center',
      headerAlign: 'center',
      editable: true,
      renderCell: (params) => <Image src={params.value} alt={params.value} />
    },
    {
      field: 'title',
      headerName: 'Tiêu Đề',
      type: 'string',
      width: 300,
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
            icon={<DeleteIcon onClick={() => handleDeleteClick(id)} />}
            label="Delete"
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
                getRowHeight={() => 'auto'}
                slotPropYs={{
                  toolbar: { setRows, setRowModesModel }
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 }
                  }
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
              />
            </Box>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={6}>
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
                <Input placeholder="Title" value={addtitle} onChange={(e) => setAddtitle(e.target.value)} />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
              <Grid item xs={2}>
                <Typography variant="subtitle1" gutterBottom alignItem="center" align="center"></Typography>
              </Grid>
              <Grid item xs={3}>
                <Button type="primary" danger onClick={addANewBanner}>
                  Thêm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
      <Grid item xs={6}>
        <MainCard title="CẬP NHẬT BANNER" codeHighlight sx={{ borderWidth: 2 }}>
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
                  Cập Nhật
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
