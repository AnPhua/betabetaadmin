import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TableCell, TableContainer, Table, TableHead, TableRow } from '@mui/material';
import { Image, Input, Button, Upload, notification, Modal } from 'antd';
import MainCard from 'components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Close';

import { CreateBanner, DeleteBanner, GetAllBanner } from '../../services/controller/AdminController';
import { TableBody } from '../../../node_modules/@material-ui/core/index';
import { TablePagination } from '@mui/material';
//import { Pagination } from '../../../node_modules/@mui/lab/index';
const ComponentBanner = () => {
  const [rows, setRows] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  //const [rowModesModel, setRowModesModel] = useState({});
  const [idToDelete, setIdToDelete] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [metadt, setMetaDt] = useState({ totalItems: 0, PageNumber: 1, PageSize: 10 });
  const onChangeforupload = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };

  const resetForm = () => {
    setFileList([]);
    setAddTitle('');
  };

  useEffect(() => {
    setIsComponentVisible(true);
    getAllBanners(metadt.PageNumber, metadt.PageSize);
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
    if (!addTitle) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập tiêu đề!'
      });
      return;
    }
    formData.append('ImageUrl', fileList[0].originFileObj);
    formData.append('Title', addTitle);
    await CreateBanner(formData);
    //await getAllBanners1();
    await getAllBanners(1);
    resetForm();
  };

  const handleDeleteClick = async () => {
    if (idToDelete) {
      await DeleteBanner(idToDelete);
      await getAllBanners(1);
      setDeleteModal(false); // Đóng modal sau khi xóa
      setIdToDelete(''); // Reset idToDelete sau khi xóa
    }
  };

  // const openDeleteModal = (id) => {
  //   setIdToDelete(id); // Lưu id của banner cần xóa
  //   setDeleteModal(true); // Mở modal xác nhận xóa
  // };

  // const getAllBanners1 = async () => {
  //   let res = await GetAllBannersNoPagination();
  //   if (res) {
  //     setRows(res);
  //   }
  // };
  const getAllBanners = async (PageNumber, PageSize) => {
    let res = await GetAllBanner(PageNumber, PageSize);
    if (res && res.data) {
      setRows(res.data);
      setMetaDt({ totalItems: res.totalItems, PageNumber: res.pageNumber, PageSize: res.pageSize });
    }
  };
  // const columns = [
  //   {
  //     field: 'imageUrl',
  //     headerName: 'Ảnh',
  //     width: 600,
  //     align: 'center',
  //     headerAlign: 'center',
  //     editable: true,
  //     renderCell: (params) => <Image src={params.value} alt={params.value} />
  //   },
  //   {
  //     field: 'title',
  //     headerName: 'Tiêu Đề',
  //     type: 'string',
  //     width: 300,
  //     align: 'left',
  //     headerAlign: 'left',
  //     editable: true
  //   },
  //   {
  //     field: 'actions',
  //     type: 'actions',
  //     headerName: 'Actions',
  //     width: 100,
  //     cellClassName: 'actions',
  //     getActions: ({ id }) => {
  //       const isInEditMode = rowModesModel[id]?.mode === 'edit';

  //       if (isInEditMode) {
  //         return [
  //           <GridActionsCellItem
  //             key={`save_${id}`}
  //             icon={<SaveIcon />}
  //             label="Save"
  //             sx={{
  //               color: 'primary.main'
  //             }}
  //             //onClick={handleSaveClick(id)}
  //           />,
  //           <GridActionsCellItem
  //             key={`cancel_${id}`}
  //             icon={<CancelIcon />}
  //             label="Cancel"
  //             className="textPrimary"
  //             //onClick={handleCancelClick(id)}
  //             color="inherit"
  //           />
  //         ];
  //       }

  //       return [
  //         <GridActionsCellItem key={`edit_${id}`} icon={<EditIcon />} label="Edit" className="textPrimary" color="inherit" />,
  //         <GridActionsCellItem
  //           key={`delete_${id}`}
  //           icon={<DeleteIcon onClick={() => openDeleteModal(id)} />}
  //           label="Delete"
  //           color="inherit"
  //         />
  //       ];
  //     }
  //   }
  // ];
  // useEffect(() => {
  //   console.log('A', metadt);
  //   getAllBanners(metadt);
  // }, [metadt.PageNumber, metadt.PageSize]);

  return (
    <>
      {isComponentVisible && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <MainCard title="BANNER" codeHighlight sx={{ borderWidth: 2 }}>
              <Grid container spacing={0} direction="row">
                <div style={{ overflowY: 'auto', width: '100%' }}>
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
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Ảnh</TableCell>
                            <TableCell align="center">Title</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                              <TableCell align="right">
                                <Image src={row.imageUrl} alt={row.imageUrl} />
                              </TableCell>
                              <TableCell align="right">{row.title}</TableCell>
                              <TableCell>
                                <EditIcon />

                                <DeleteIcon
                                //onClick={() => openDeleteModal(id)}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </div>
                <div>
                  <TablePagination
                    component="div"
                    count={metadt.totalItems}
                    page={metadt.PageNumber - 1}
                    onPageChange={(e, newpage) => {
                      getAllBanners(newpage + 1, metadt.PageSize);
                    }}
                    rowsPerPage={metadt.PageSize}
                    onRowsPerPageChange={(e) => {
                      getAllBanners(1, e.target.value);
                    }}
                  />
                </div>
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
                    <Input placeholder="Title" value={addTitle} onChange={(e) => setAddTitle(e.target.value)} />
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
                    <Button type="primary" success>
                      Cập Nhật
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      )}
      <Modal
        title="Xóa Banner !"
        open={deletemodal}
        onOk={handleDeleteClick}
        onCancel={() => setDeleteModal(false)}
        okText="Có"
        cancelText="Không"
      >
        <p>Bạn Có Chắc Chắn Muốn Xóa Banner Này Không?</p>
      </Modal>
    </>
  );
};

export default ComponentBanner;
