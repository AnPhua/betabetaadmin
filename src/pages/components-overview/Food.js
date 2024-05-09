/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, IconButton } from '@mui/material';
import { Image, Input, Button, Upload, notification, Modal, Spin, InputNumber } from 'antd';
import MainCard from 'components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { PlusOutlined } from '@ant-design/icons';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Close';
import {
  CreateFood,
  DeleteFood,
  GetAllFoods,
  GetFoodById,
  UpdateFood,
  UpdateFoodHaveString
} from '../../services/controller/AdminController';
import { TablePagination, Checkbox } from '@mui/material';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const ComponentFood = () => {
  const { TextArea } = Input;
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileListUpdate, setFileListUpdate] = useState([{ image: '' }]);
  const [editNameOfFood, setEditNameOfFood] = useState([{ nameOfFood: '' }]);
  const [editPrice, setEditPrice] = useState([{ price: 50000 }]);
  const [editDescription, setEditDescription] = useState([{ description: '' }]);
  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [addFood, setAddFood] = useState('');
  const [addPrice, setAddPrice] = useState(50000);
  const [addDescription, setDescription] = useState('');
  const [isLoadingFood, setIsLoadingFood] = useState(false);
  const [isUpdatingFood, setIsUpdatingFood] = useState(false);
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [metadt, setMetaDt] = useState({ totalItems: 0, PageNumber: 1, PageSize: 10 });
  const onChangeforupload = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1));
    console.log('add', newFileList);
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
    getAllFoods(metadt.PageNumber, metadt.PageSize);
  }, []);

  const addANewFood = async () => {
    const formData = new FormData();
    if (!fileList || fileList.length === 0 || !fileList[0].originFileObj) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng chọn ảnh!'
      });
      return;
    }
    if (!addFood) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập tên đồ ăn!'
      });
      return;
    }
    if (!addDescription) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập mô tả!'
      });
      return;
    }
    formData.append('Price', addPrice);
    formData.append('Description', addDescription);
    formData.append('Image', fileList[0].originFileObj);
    formData.append('NameOfFood', addFood);

    await CreateFood(formData, setIsLoadingFood);
    await getAllFoods(metadt.PageNumber, metadt.PageSize);
    setAddPrice(50000);
    setDescription('');
    setFileList([]);
    setAddFood('');
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleDeleteClick = async () => {
    if (idToDelete) {
      await DeleteFood(idToDelete);
      setDeleteModal(false);
      setIdToDelete('');
      await getAllFoods(1, metadt.PageSize);
    }
  };
  const onPageChange = (e, newpage) => {
    getAllFoods(newpage + 1, metadt.PageSize);
  };
  const onRowsPerPageChange = (e) => {
    getAllFoods(1, e.target.value);
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
      const res = await GetFoodById(id);
      if (res && res.data) {
        const { price, description, image, nameOfFood } = res.data;
        setFileListUpdate([{ url: image }]);
        setEditNameOfFood([{ nameOfFood: nameOfFood }]);
        setEditPrice([{ price: price }]);
        setEditDescription([{ description: description }]);
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
    if (!editNameOfFood) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập tiêu đề!'
      });
      return;
    }
    if (!editDescription) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập tiêu đề!'
      });
      return;
    }
    const checkType = !!fileListUpdate[0].url;
    formData.append('FoodId', idToUpdate);
    formData.append('Image', checkType ? fileListUpdate[0].url : fileListUpdate[0].originFileObj);
    formData.append('NameOfFood', editNameOfFood[0].nameOfFood);
    formData.append('Price', editPrice[0].price);
    formData.append('Description', editDescription[0].description);
    console.log(
      `Image: ${checkType}, NameOfFood: ${editNameOfFood[0].nameOfFood}`,
      `Price: ${editPrice[0].price}, Description: ${editDescription[0].description}`
    );
    if (checkType) {
      await UpdateFoodHaveString(formData, setIsUpdatingFood);
    } else {
      await UpdateFood(formData, setIsUpdatingFood);
    }
    await getAllFoods(metadt.PageNumber, metadt.PageSize);
    setIdToUpdate('');
    setFileListUpdate([]);
    setEditNameOfFood('');
    setEditDescription('');
    setEditPrice('');
  };
  const getAllFoods = async (PageNumber, PageSize) => {
    let res = await GetAllFoods(PageNumber, PageSize);
    if (res && res.data) {
      setRows(res.data);
      setMetaDt({ totalItems: res.totalItems, PageNumber: res.pageNumber, PageSize: res.pageSize });
    }
  };
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { currency: 'VND' });
  };
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        {isComponentVisible && (
          <Grid container spacing={3}>
            {isLoadingFood ? (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Spin spinning={isLoadingFood} delay={500} />
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <MainCard title="ĐỒ ĂN" codeHighlight sx={{ borderWidth: 2 }}>
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
                              <Table sx={{ minWidth: 800 }} aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell />
                                    <TableCell align="center">Ảnh</TableCell>
                                    <TableCell align="center">Tên Đồ Ăn</TableCell>
                                    <TableCell align="center">Giá</TableCell>
                                    <TableCell align="center">Mô Tả</TableCell>
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
                                        <TableCell align="left">
                                          <Image src={row.image} alt={row.image} />
                                        </TableCell>
                                        <TableCell align="center">{row.nameOfFood}</TableCell>
                                        <TableCell align="center">{formatPrice(row.price)}vnđ</TableCell>
                                        <TableCell align="center">{row.description}</TableCell>
                                        <TableCell align="center" sx={{ width: '10%' }}>
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
                  <MainCard title="THÊM ĐỒ ĂN" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Ảnh Đồ Ăn
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
                            Tên Đồ Ăn
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input placeholder="Tên Đồ Ăn" value={addFood} onChange={(e) => setAddFood(e.target.value)} />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Giá
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <InputNumber
                            placeholder="Giá"
                            min={40000}
                            max={1000000}
                            defaultValue={50000}
                            value={addPrice}
                            onChange={(value) => setAddPrice(value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Mô Tả
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <TextArea
                            showCount
                            maxLength={200}
                            value={addDescription}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="disable resize"
                            style={{
                              height: 130,
                              width: 400,
                              resize: 'none'
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center"></Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Button type="primary" danger onClick={addANewFood}>
                            Thêm
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
                <Grid item xs={6}>
                  <MainCard title="CẬP NHẬT ĐỒ ĂN" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Ảnh Đồ Ăn
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
                            Tên Đồ Ăn
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Tên Đồ Ăn"
                            value={editNameOfFood[0]?.nameOfFood}
                            onChange={(e) => setEditNameOfFood([{ nameOfFood: e.target.value }])}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Giá
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <InputNumber
                            placeholder="Giá"
                            min={40000}
                            max={1000000}
                            defaultValue={50000}
                            value={editPrice[0]?.price}
                            onChange={(value) => setEditPrice([{ price: value }])}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Mô Tả
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <TextArea
                            showCount
                            maxLength={200}
                            value={editDescription[0]?.description}
                            onChange={(e) => setEditDescription([{ description: e.target.value }])}
                            placeholder="disable resize"
                            style={{
                              height: 130,
                              width: 400,
                              resize: 'none'
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center"></Typography>
                        </Grid>
                        <Grid item xs={3}>
                          {isUpdatingFood ? (
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
        title="Xóa Đồ Ăn !"
        open={deletemodal}
        onOk={handleDeleteClick}
        onCancel={() => setDeleteModal(false)}
        okText="Có"
        cancelText="Không"
      >
        <p>Bạn Có Chắc Chắn Muốn Xóa Đồ Ăn Này Không?</p>
      </Modal>
    </>
  );
};

export default ComponentFood;
