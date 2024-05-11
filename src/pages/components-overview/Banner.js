/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, IconButton } from '@mui/material';
import { Image, Input, Button, Upload, notification, Modal, Spin } from 'antd';
import MainCard from 'components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { PlusOutlined } from '@ant-design/icons';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Close';
import {
  CreateBanner,
  DeleteBanner,
  GetAllBanner,
  GetBannerById,
  UpdateBanner,
  UpdateBannerHaveString
} from '../../services/controller/AdminController';
import { TablePagination, Checkbox, CircularProgress } from '@mui/material';
//import ImgCrop from 'antd-img-crop';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ComponentBanner = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileListUpdate, setFileListUpdate] = useState([{ imageUrl: '' }]);
  const [editTitle, setEditTitle] = useState([{ title: '' }]);
  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [metadt, setMetaDt] = useState({ totalItems: 0, PageNumber: 1, PageSize: 10 });
  const onChangeforupload = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileListUpdate(newFileList);
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none'
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </button>
  );
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
    console.log(`imageUrl: ${fileList[0].originFileObj}, title: ${addTitle}`);
    await CreateBanner(formData, setIsLoading);
    await getAllBanners(metadt.PageNumber, metadt.PageSize);
    setFileList([]);
    setAddTitle('');
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleDeleteClick = async () => {
    if (idToDelete) {
      await DeleteBanner(idToDelete);
      setDeleteModal(false);
      setIdToDelete('');
      await getAllBanners(1, metadt.PageSize);
    }
  };
  const onPageChange = (e, newpage) => {
    getAllBanners(newpage + 1, metadt.PageSize);
  };
  const onRowsPerPageChange = (e) => {
    getAllBanners(1, e.target.value);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };
  const openDeleteModal = (id) => {
    setIdToDelete(id);
    setDeleteModal(true);
  };
  const showDataBanner = async (id) => {
    try {
      setIdToUpdate(id);
      const res = await GetBannerById(id);
      if (res && res.data) {
        const { imageUrl } = res.data;
        const { title } = res.data;
        setFileListUpdate([{ url: imageUrl }]);
        setEditTitle([{ title }]);
      }
    } catch (error) {
      console.error('Error while fetching banner by ID:', error);
    }
  };

  const updateabanner = async () => {
    const formData = new FormData();

    if (!fileListUpdate || fileListUpdate.length === 0) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng chọn ảnh!'
      });
      return;
    }
    if (!editTitle) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập tiêu đề!'
      });
      return;
    }

    const checkType = !!fileListUpdate[0].url;
    formData.append('BannerId', idToUpdate);
    formData.append('ImageUrl', checkType ? fileListUpdate[0].url : fileListUpdate[0].originFileObj);
    formData.append('Title', editTitle[0].title);
    if (checkType) {
      await UpdateBannerHaveString(formData, setIsUpdating);
    } else {
      await UpdateBanner(formData, setIsUpdating);
    }
    await getAllBanners(metadt.PageNumber, metadt.PageSize);
    setIdToUpdate('');
    setFileListUpdate([]);
    setEditTitle('');
  };
  const getAllBanners = async (PageNumber, PageSize) => {
    let res = await GetAllBanner(PageNumber, PageSize);
    if (res && res.data) {
      setRows(res.data);
      setMetaDt({ totalItems: res.totalItems, PageNumber: res.pageNumber, PageSize: res.pageSize });
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {isComponentVisible && (
          <Grid container spacing={3}>
            {isLoading ? (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Spin spinning={isLoading} delay={500} />
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <MainCard title="BANNER" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0} direction="row">
                      <div style={{ width: '100%' }}>
                        <Box
                          sx={{
                            overflowY: 'auto',
                            height: 400,
                            '& .actions': {
                              color: 'text.secondary'
                            },
                            '& .textPrimary': {
                              color: 'text.primary'
                            }
                          }}
                        >
                          <Paper>
                            <TableContainer>
                              <Table sx={{ minWidth: 600 }} aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell />
                                    <TableCell align="center">Ảnh</TableCell>
                                    <TableCell align="center">Title</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {rows.map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                      <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                      >
                                        <TableCell padding="checkbox">
                                          <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                              'aria-labelledby': labelId
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell align="center">
                                          <Image src={row.imageUrl} alt={row.imageUrl} />
                                        </TableCell>
                                        <TableCell align="center">{row.title}</TableCell>
                                        <TableCell>
                                          <IconButton aria-label="edit" size="small">
                                            <EditIcon onClick={() => showDataBanner(row.id)} />
                                          </IconButton>
                                          <IconButton aria-label="delete" size="small">
                                            <DeleteIcon onClick={() => openDeleteModal(row.id)} />
                                          </IconButton>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <TablePagination
                              showFirstButton="true"
                              showLastButton="true"
                              component="div"
                              count={metadt.totalItems}
                              page={metadt.PageNumber - 1}
                              onPageChange={onPageChange}
                              rowsPerPage={metadt.PageSize}
                              onRowsPerPageChange={onRowsPerPageChange}
                            />
                          </Paper>
                        </Box>
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
                          {isLoading ? (
                            <Button type="primary" danger startDecorator={<CircularProgress variant="solid" />}>
                              Đang Thêm Banner ....
                            </Button>
                          ) : (
                            <Button type="primary" danger onClick={addANewBanner}>
                              Thêm
                            </Button>
                          )}
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
                          <>
                            <Upload
                              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                              listType="picture-card"
                              fileList={fileListUpdate}
                              onPreview={handlePreview}
                              onChange={handleChange}
                            >
                              {fileListUpdate.length >= 1 ? null : uploadButton}
                            </Upload>
                            {previewImage && (
                              <Image
                                wrapperStyle={{
                                  display: 'none'
                                }}
                                preview={{
                                  visible: previewOpen,
                                  onVisibleChange: (visible) => setPreviewOpen(visible),
                                  afterOpenChange: (visible) => !visible && setPreviewImage('')
                                }}
                                src={previewImage}
                              />
                            )}
                          </>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Title
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Title"
                            value={editTitle[0]?.title}
                            onChange={(e) => setEditTitle([{ title: e.target.value }])}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center"></Typography>
                        </Grid>
                        <Grid item xs={3}>
                          {isUpdating ? (
                            <Button type="primary" success loading>
                              Đang Cập Nhật....
                            </Button>
                          ) : (
                            <Button type="primary" success onClick={updateabanner}>
                              Cập Nhật
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
              </>
            )}
          </Grid>
        )}
      </div>
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
