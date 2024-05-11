/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, IconButton } from '@mui/material';
import { Image, Input, Button, Upload, notification, Modal, Spin, InputNumber, DatePicker, Select } from 'antd';
import MainCard from 'components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { PlusOutlined } from '@ant-design/icons';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Close';
import {
  CreateMovie,
  DeleteMovie,
  GetFoodById,
  UpdateFood,
  UpdateFoodHaveString,
  GetAllMovieType,
  GetAllRate
} from '../../services/controller/AdminController';
import { GetAllMovie } from 'services/controller/StaffController';
import { TablePagination, Checkbox } from '@mui/material';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
//const { RangePicker } = DatePicker;
const ComponentMovie = () => {
  const { TextArea } = Input;
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileListUpdate, setFileListUpdate] = useState([{ image: '' }]);
  const [editNameOfFood, setEditNameOfFood] = useState([{ nameOfFood: '' }]);
  const [editPrice, setEditPrice] = useState([{ price: 50000 }]);
  const [editDescription, setEditDescription] = useState([{ description: '' }]);
  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');

  // ADD A NEW MOVIE
  const [addNameMovie, setAddNameMovie] = useState('');
  const [addMovieType, setAddMovieType] = useState([]);
  const [selectedMovieType, setSelectedMovieType] = useState(null);
  const [addMovieDurate, setAddMovieDurate] = useState(70);
  const [addPreDate, setAddPreDate] = useState('');
  const [addEndDate, setAddEndDate] = useState('');
  const [addIsHot, setAddIsHot] = useState('False');
  const [addImage, setAddImage] = useState([]);
  const [addHeroImage, setAddHeroImage] = useState([]);
  const [addLanguage, setAddLanguage] = useState('');
  const [addMovieRate, setAddMovieRate] = useState([]);
  const [selectedMovieRate, setSelectedMovieRate] = useState(null);
  const [addTrailer, setAddTrailer] = useState('');
  const [addCaster, setAddCaster] = useState('');
  const [addDirector, setAddDirector] = useState('');
  const [addDescription, setDescription] = useState('');
  const [isLoadingCreateMovie, setIsLoadingCreateMovie] = useState(false);
  console.log(setIsLoadingCreateMovie);
  const onChangeForImage = ({ fileList: newFileList }) => {
    setAddImage(newFileList.slice(-1));
  };
  const onChangeForHeroImage = ({ fileList: newFileList }) => {
    setAddHeroImage(newFileList.slice(-1));
  };
  const handleSelectIsHot = (selectedOption) => {
    setAddIsHot(selectedOption === 'Có' ? 'True' : 'False');
  };
  const handleSelectMovieType = (selectedOption) => {
    setSelectedMovieType(selectedOption);
  };
  const handleSelectMovieRate = (selectedOption) => {
    setSelectedMovieRate(selectedOption);
  };
  const handlePreDateChange = (date, dateString) => {
    if (dateString === '') {
      setAddPreDate(null);
    } else {
      setAddPreDate(dateString);
    }
  };
  const handleEndDateChange = (date, dateString) => {
    if (dateString === '') {
      setAddEndDate(null);
    } else {
      setAddEndDate(dateString);
    }
  };
  const addANewMovie = async () => {
    let errorMessage = '';
    const formData = new FormData();
    switch (true) {
      case !addNameMovie:
        errorMessage = 'Vui lòng nhập tên phim!';
        break;
      case !selectedMovieType:
        errorMessage = 'Vui lòng chọn thể loại phim!';
        break;
      case !addMovieDurate:
        errorMessage = 'Vui lòng nhập thời lượng phim!';
        break;
      case !addPreDate:
        errorMessage = 'Vui lòng chọn ngày khởi chiếu!';
        break;
      case !addEndDate:
        errorMessage = 'Vui lòng chọn ngày kết thúc!';
        break;
      case !addImage || addImage.length === 0 || !addImage[0].originFileObj:
        errorMessage = 'Vui lòng chọn ảnh!';
        break;
      case !addHeroImage || addHeroImage.length === 0 || !addHeroImage[0].originFileObj:
        errorMessage = 'Vui lòng chọn poster!';
        break;
      case !addLanguage:
        errorMessage = 'Vui lòng nhập ngôn ngữ!';
        break;
      case !selectedMovieRate:
        errorMessage = 'Vui lòng chọn giới hạn tuổi!';
        break;
      case !addTrailer:
        errorMessage = 'Vui lòng nhập trailer phim!';
        break;
      case !addCaster:
        errorMessage = 'Vui lòng nhập dàn diễn viên!';
        break;
      case !addDirector:
        errorMessage = 'Vui lòng nhập đạo diễn!';
        break;
      case !addDescription:
        errorMessage = 'Vui lòng nhập mô tả!';
        break;
      default:
        break;
    }

    if (errorMessage) {
      notification.error({
        message: 'Lỗi',
        description: errorMessage
      });
      return;
    }

    formData.append('Name', addNameMovie);
    formData.append('MovieTypeId', selectedMovieType);
    formData.append('MovieDuration', addMovieDurate);
    formData.append('PremiereDate', addPreDate);
    formData.append('EndTime', addEndDate);
    formData.append('IsHot', addIsHot);
    formData.append('IsSellTicket', false);
    formData.append('Image', addImage[0].originFileObj);
    formData.append('HeroImage', addHeroImage[0].originFileObj);
    formData.append('Language', addLanguage);
    formData.append('RateId', selectedMovieRate);
    formData.append('Trailer', addTrailer);
    formData.append('Caster', addCaster);
    formData.append('Director', addDirector);
    formData.append('Description', addDescription);
    await CreateMovie(formData, setIsLoadingCreateMovie);
    await getAllMovies(metadt.PageNumber, metadt.PageSize);
    setAddNameMovie('');
    setSelectedMovieType(null);
    setAddMovieDurate(70);
    handlePreDateChange('');
    handleEndDateChange('');
    setAddIsHot('');
    setAddImage([]);
    setAddHeroImage([]);
    setAddLanguage('');
    setSelectedMovieRate(null);
    setAddTrailer('');
    setAddCaster('');
    setAddDirector('');
    setDescription('');
  };
  //////////////////////////////////////////

  const [isUpdatingFood, setIsUpdatingFood] = useState(false);
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const [metadt, setMetaDt] = useState({ totalItems: 0, PageNumber: 1, PageSize: 10 });

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
  const showDataMovieTypeandRate = async () => {
    const resmovie = await GetAllMovieType();
    const resrate = await GetAllRate();
    if (resmovie && resrate) {
      setAddMovieType(resmovie);
      setAddMovieRate(resrate);
    }
  };
  useEffect(() => {
    setIsComponentVisible(true);
    getAllMovies(metadt.PageNumber, metadt.PageSize);
    showDataMovieTypeandRate();
  }, []);

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleDeleteClick = async () => {
    if (idToDelete) {
      await DeleteMovie(idToDelete);
      setDeleteModal(false);
      setIdToDelete('');
      await getAllMovies(1, metadt.PageSize);
    }
  };
  const onPageChange = (e, newpage) => {
    getAllMovies(newpage + 1, metadt.PageSize);
  };
  const onRowsPerPageChange = (e) => {
    getAllMovies(1, e.target.value);
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
    await getAllMovies(metadt.PageNumber, metadt.PageSize);
    setIdToUpdate('');
    setFileListUpdate([]);
    setEditNameOfFood('');
    setEditDescription('');
    setEditPrice('');
  };
  const getAllMovies = async (PageNumber, PageSize) => {
    let res = await GetAllMovie(PageNumber, PageSize);
    if (res && res.data) {
      setRows(res.data);
      setMetaDt({ totalItems: res.totalItems, PageNumber: res.pageNumber, PageSize: res.pageSize });
    }
  };
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '170vh' }}>
        {isComponentVisible && (
          <Grid container spacing={3}>
            {isLoadingCreateMovie ? (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Spin spinning={isLoadingCreateMovie} delay={500} />
              </Grid>
            ) : (
              <>
                <Grid item xs={14}>
                  <MainCard title="CHI TIẾT PHIM" codeHighlight sx={{ borderWidth: 2 }}>
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
                              <Table sx={{ maxWidth: 2000 }} aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell />
                                    <TableCell align="center">Tên Phim</TableCell>
                                    <TableCell align="center">Thể Loại</TableCell>
                                    <TableCell align="center">Thời Lượng</TableCell>
                                    <TableCell align="center">Khởi Chiếu</TableCell>
                                    <TableCell align="center">Kết Thúc</TableCell>
                                    <TableCell align="center">Ảnh</TableCell>
                                    <TableCell align="center">Poster</TableCell>
                                    <TableCell align="center">Ngôn Ngữ</TableCell>
                                    <TableCell align="center">Giới Hạn Tuổi</TableCell>
                                    <TableCell align="center">Dàn Diễn Viên</TableCell>
                                    <TableCell align="center">Đạo Diễn</TableCell>
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
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.movieTypeName}</TableCell>
                                        <TableCell align="center">{row.movieDuration}</TableCell>
                                        <TableCell align="center">{formatDate(row.premiereDate)}</TableCell>
                                        <TableCell align="center">{formatDate(row.endTime)}</TableCell>
                                        <TableCell align="center">
                                          <Image src={row.image} alt={row.image} />
                                        </TableCell>
                                        <TableCell align="center">
                                          <Image src={row.heroImage} alt={row.heroImage} />
                                        </TableCell>
                                        <TableCell align="center">{row.language}</TableCell>
                                        <TableCell align="center">{row.rateName}</TableCell>
                                        <TableCell align="center">{row.caster}</TableCell>
                                        <TableCell align="center">{row.director}</TableCell>
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
                  <MainCard title="THÊM PHIM MỚI" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Tên Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input placeholder="Tên Phim" value={addNameMovie} onChange={(e) => setAddNameMovie(e.target.value)} />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Thể Loại Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            style={{ width: '250px' }}
                            placeholder="Chọn Thể Loại Phim"
                            value={selectedMovieType}
                            onChange={handleSelectMovieType}
                            displayEmpty
                          >
                            {addMovieType.map((addMovieType) => (
                              <option key={addMovieType.id} value={addMovieType.id}>
                                {addMovieType.movieTypeName}
                              </option>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Thời Lượng Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <InputNumber
                            placeholder="Thời Lượng"
                            min={60}
                            max={300}
                            defaultValue={70}
                            value={addMovieDurate}
                            onChange={(value) => setAddMovieDurate(value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Ngày Khởi Chiếu
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <DatePicker
                            format={{
                              format: 'YYYY-MM-DD',
                              type: 'mask'
                            }}
                            onChange={handlePreDateChange}
                            placeholder="Ngày Khởi Chiếu"
                            needConfirm
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Ngày Kết Thúc
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <DatePicker
                            format={{
                              format: 'YYYY-MM-DD',
                              type: 'mask'
                            }}
                            onChange={handleEndDateChange}
                            placeholder="Ngày Kết Thúc"
                            needConfirm
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Hot
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            defaultValue="Không"
                            placeholder="Hot?"
                            style={{ width: 100 }}
                            options={[
                              { value: 'True', label: 'Có' },
                              { value: 'False', label: 'Không' }
                            ]}
                            onChange={handleSelectIsHot}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Ảnh Của Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            fileList={addImage}
                            onChange={onChangeForImage}
                            maxCount={1}
                          >
                            {addImage.length === 0 && '+ Chọn Ảnh'}
                          </Upload>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Poster Của Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            fileList={addHeroImage}
                            onChange={onChangeForHeroImage}
                            maxCount={1}
                          >
                            {addHeroImage.length === 0 && '+ Chọn Ảnh'}
                          </Upload>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Ngôn Ngữ
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Ngôn Ngữ Của Phim"
                            value={addLanguage}
                            style={{ width: '200px' }}
                            onChange={(e) => setAddLanguage(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Giới Hạn Độ Tuổi
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            style={{ width: '400px' }}
                            placeholder="Chọn Độ Tuổi Của Phim"
                            value={selectedMovieRate}
                            onChange={handleSelectMovieRate}
                            displayEmpty
                          >
                            {addMovieRate.map((addMovieRate) => (
                              <option key={addMovieRate.id} value={addMovieRate.id}>
                                {addMovieRate.code} - {addMovieRate.description}
                              </option>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Trailer Của Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Trailer Youtube"
                            value={addTrailer}
                            style={{ width: '400px' }}
                            onChange={(e) => setAddTrailer(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Dàn Diễn Viên
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Dàn Diễn Viên"
                            value={addCaster}
                            style={{ width: '400px' }}
                            onChange={(e) => setAddCaster(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Đạo Diễn
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Đạo Diễn"
                            style={{ width: '400px' }}
                            value={addDirector}
                            onChange={(e) => setAddDirector(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Mô Tả Về Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <TextArea
                            showCount
                            maxLength={700}
                            value={addDescription}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="disable resize"
                            style={{
                              height: 130,
                              width: 500,
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
                          <Button type="primary" danger onClick={addANewMovie}>
                            Thêm Phim
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
                <Grid item xs={6}>
                  <MainCard title="CẬP NHẬT PHIM" codeHighlight sx={{ borderWidth: 2 }}>
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
                            maxLength={700}
                            value={editDescription[0]?.description}
                            onChange={(e) => setEditDescription([{ description: e.target.value }])}
                            placeholder="disable resize"
                            style={{
                              height: 130,
                              width: 500,
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

export default ComponentMovie;
