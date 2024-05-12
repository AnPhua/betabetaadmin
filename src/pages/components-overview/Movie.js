/* eslint-disable no-unused-vars */
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
  GetMovieById,
  UpdateMovie,
  UpdateMovieHaveString,
  GetAllMovieType,
  GetAllRate,
  UpdateMovieHeroString,
  UpdateMovieImageString
} from '../../services/controller/AdminController';
import { GetAllMovie } from 'services/controller/StaffController';
import { TablePagination, Checkbox } from '@mui/material';
import dayjs from 'dayjs';
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
  // UPDATE MOVIE
  const [editName, setEditName] = useState([{ name: '' }]);
  const [editMovieDuration, setEditMovieDuration] = useState([{ movieDuration: '' }]);
  const [editDescription, setEditDescription] = useState([{ description: '' }]);
  const [editMovieType, setEditMovieType] = useState([{ data: '' }]);
  const [editSelectedMovieType, setEditSelectedMovieType] = useState(null);
  const [editPreDate, setEditPreDate] = useState([{ premiereDate: '' }]);
  const [editEndDate, setEditEndDate] = useState([{ endTime: '' }]);
  const [editIsHot, setEditIsHot] = useState([{ isHot: '' }]);
  const [editIsTicket, setEditIsTicket] = useState([{ isSellTicket: '' }]);
  const [editImage, setEditImage] = useState([{ image: '' }]);
  const [editHeroImage, setEditHeroImage] = useState([{ heroImage: '' }]);
  const [editLanguage, setEditLanguage] = useState([{ language: '' }]);
  const [editMovieRate, setEditMovieRate] = useState([{ rateName: '' }]);
  const [editSelectedMovieRate, setEditSelectedMovieRate] = useState(null);
  const [editTrailer, setEditTrailer] = useState([{ trailer: '' }]);
  const [editCaster, setEditCaster] = useState([{ caster: '' }]);
  const [editDirector, setEditDirector] = useState([{ director: '' }]);
  const [isUpdatingMovie, setIsUpdatingMovie] = useState(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleEditSelectIsHot = (selectedOption) => {
    setEditIsHot([{ isHot: selectedOption === 'Có' ? 'True' : 'False' }]);
  };
  const handleEditSelectIsTicket = (selectedOption) => {
    setEditIsTicket([{ isSellTicket: selectedOption === 'Có' ? 'True' : 'False' }]);
  };
  const handleEditPreDateChange = (date, dateString) => {
    if (dateString === '') {
      setEditPreDate([{ premiereDate: null }]);
    } else {
      setEditPreDate([{ premiereDate: dateString }]);
    }
  };
  const handleEditEndDateChange = (date, dateString) => {
    if (dateString === '') {
      setEditEndDate([{ premiereDate: null }]);
    } else {
      setEditEndDate([{ premiereDate: dateString }]);
    }
  };
  const handleChangeForImage = ({ fileList: newFileList }) => {
    setEditImage(newFileList);
  };
  const handleChangeForHero = ({ fileList: newFileList }) => {
    setEditHeroImage(newFileList);
  };
  const handleSelectEditMovieType = (selectedOption) => {
    setEditSelectedMovieType(selectedOption);
  };
  const handleSelectEditMovieRate = (selectedOption) => {
    setEditSelectedMovieRate(selectedOption);
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
        Chọn Ảnh
      </div>
    </button>
  );
  const showDataMovie = async (id) => {
    try {
      setIdToUpdate(id);
      const res = await GetMovieById(id);
      if (res && res.data) {
        const {
          movieDuration,
          endTime,
          premiereDate,
          director,
          caster,
          isHot,
          isSellTicket,
          description,
          image,
          heroImage,
          language,
          movieTypeName,
          name,
          rateName,
          trailer
        } = res.data;
        setEditImage([{ url: image }]);
        setEditHeroImage([{ url: heroImage }]);
        setEditTrailer([{ trailer: trailer }]);
        setEditMovieRate([{ rateName: rateName }]);
        setEditLanguage([{ language: language }]);
        setEditDirector([{ director: director }]);
        setEditCaster([{ caster: caster }]);
        setEditMovieType([{ movieTypeName: movieTypeName }]);
        setEditPreDate([{ premiereDate: premiereDate }]);
        setEditName([{ name: name }]);
        setEditEndDate([{ endTime: endTime }]);
        setEditIsHot([{ isHot: isHot }]);
        setEditIsTicket([{ isSellTicket: isSellTicket }]);
        setEditMovieDuration([{ movieDuration: movieDuration }]);
        setEditDescription([{ description: description }]);
      }
    } catch (error) {
      console.error('Error while fetching movie by ID:', error);
    }
  };
  const updateMovie = async () => {
    let errorMessage = '';
    const formData = new FormData();
    switch (true) {
      case !editName:
        errorMessage = 'Vui lòng nhập tên phim!';
        break;
      case !editSelectedMovieType:
        errorMessage = 'Cần chọn lại thể loại phim!';
        break;
      case !addMovieDurate:
        errorMessage = 'Vui lòng nhập thời lượng phim!';
        break;
      case !editPreDate:
        errorMessage = 'Vui lòng chọn ngày khởi chiếu!';
        break;
      case !editEndDate:
        errorMessage = 'Vui lòng chọn ngày kết thúc!';
        break;
      case !editImage || editImage.length === 0:
        errorMessage = 'Vui lòng chọn ảnh!';
        break;
      case !editHeroImage || editHeroImage.length === 0:
        errorMessage = 'Vui lòng chọn poster!';
        break;
      case !editLanguage:
        errorMessage = 'Vui lòng nhập ngôn ngữ!';
        break;
      case !editSelectedMovieRate:
        errorMessage = 'Cần chọn lại giới hạn tuổi!';
        break;
      case !editTrailer:
        errorMessage = 'Vui lòng nhập trailer phim!';
        break;
      case !editCaster:
        errorMessage = 'Vui lòng nhập dàn diễn viên!';
        break;
      case !editDirector:
        errorMessage = 'Vui lòng nhập đạo diễn!';
        break;
      case !editDescription:
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
    const checkTypeImage = !!editImage[0].url;
    const checkTypeHeroImage = !!editHeroImage[0].url;
    formData.append('Id', idToUpdate);
    formData.append('Name', editName[0]?.name);
    formData.append('MovieTypeId', editSelectedMovieType);
    formData.append('MovieDuration', editMovieDuration[0]?.movieDuration);
    formData.append('PremiereDate', editPreDate[0]?.premiereDate);
    formData.append('EndTime', editEndDate[0]?.endTime);
    formData.append('IsHot', editIsHot[0]?.isHot);
    formData.append('IsSellTicket', editIsTicket[0].isSellTicket);
    formData.append('Image', checkTypeImage ? editImage[0].url : editImage[0].originFileObj);
    formData.append('HeroImage', checkTypeHeroImage ? editHeroImage[0].url : editHeroImage[0].originFileObj);
    formData.append('Language', editLanguage[0]?.language);
    formData.append('RateId', editSelectedMovieRate);
    formData.append('Trailer', editTrailer[0]?.trailer);
    formData.append('Caster', editCaster[0]?.caster);
    formData.append('Director', editDirector[0]?.director);
    formData.append('Description', editDescription[0]?.description);

    if (checkTypeImage && checkTypeHeroImage) {
      await UpdateMovieHaveString(formData, setIsUpdatingMovie);
      await getAllMovies(metadt.PageNumber, metadt.PageSize);
    } else if (checkTypeImage && !checkTypeHeroImage) {
      await UpdateMovieImageString(formData, setIsUpdatingMovie);
      await getAllMovies(metadt.PageNumber, metadt.PageSize);
    } else if (!checkTypeImage && checkTypeHeroImage) {
      await UpdateMovieHeroString(formData, setIsUpdatingMovie);
      await getAllMovies(metadt.PageNumber, metadt.PageSize);
    } else {
      await UpdateMovie(formData, setIsUpdatingMovie);
      await getAllMovies(metadt.PageNumber, metadt.PageSize);
    }
    setIdToUpdate('');
    setEditCaster('');
    setEditMovieType('');
    setEditMovieRate('');
    setEditDirector('');
    setEditIsHot('');
    setEditIsTicket('');
    setEditSelectedMovieType('');
    setEditSelectedMovieRate('');
    setEditLanguage('');
    handleEditPreDateChange('');
    handleEditEndDateChange('');
    setEditTrailer('');
    setEditImage([]);
    setEditHeroImage([]);
    setEditName('');
    setEditDescription('');
    setEditMovieDuration('');
  };
  /////////////////////////////////////////
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const [metadt, setMetaDt] = useState({ totalItems: 0, PageNumber: 1, PageSize: 10 });

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
                                            <EditIcon onClick={() => showDataMovie(row.id)} />
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
                            placeholder="Mô Tả"
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
                            Tên Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            style={{ width: 300 }}
                            placeholder="Tên Phim"
                            value={editName[0]?.name}
                            onChange={(e) => setEditName([{ name: e.target.value }])}
                          />
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
                            onChange={handleSelectEditMovieType}
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
                            value={editMovieDuration[0]?.movieDuration}
                            onChange={(value) => setEditMovieDuration([{ movieDuration: value }])}
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
                            value={dayjs(editPreDate[0]?.premiereDate)}
                            format={{
                              format: 'YYYY-MM-DD',
                              type: 'mask'
                            }}
                            onChange={handleEditPreDateChange}
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
                            value={dayjs(editEndDate[0]?.endTime)}
                            format={{
                              format: 'YYYY-MM-DD',
                              type: 'mask'
                            }}
                            onChange={handleEditEndDateChange}
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
                            defaultValue={editIsHot[0]?.isHot == true ? 'Có' : 'Không'}
                            placeholder="Hot?"
                            style={{ width: 100 }}
                            options={[
                              { value: 'True', label: 'Có' },
                              { value: 'False', label: 'Không' }
                            ]}
                            onChange={handleEditSelectIsHot}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Mở Bán
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            defaultValue={editIsTicket[0]?.isSellTicket == true ? 'Có' : 'Không'}
                            placeholder="Ticket?"
                            style={{ width: 100 }}
                            options={[
                              { value: 'True', label: 'Có' },
                              { value: 'False', label: 'Không' }
                            ]}
                            onChange={handleEditSelectIsTicket}
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
                          <>
                            <Upload
                              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                              listType="picture-card"
                              fileList={editImage}
                              onPreview={handlePreview}
                              onChange={handleChangeForImage}
                            >
                              {editImage.length >= 1 ? null : uploadButton}
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
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Poster Của Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <>
                            <Upload
                              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                              listType="picture-card"
                              fileList={editHeroImage}
                              onPreview={handlePreview}
                              onChange={handleChangeForHero}
                            >
                              {editHeroImage.length >= 1 ? null : uploadButton}
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
                            Ngôn Ngữ
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Ngôn Ngữ Của Phim"
                            value={editLanguage[0]?.language}
                            style={{ width: '200px' }}
                            onChange={(e) => setEditLanguage([{ language: e.target.value }])}
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
                            onChange={handleSelectEditMovieRate}
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
                            value={editTrailer[0]?.trailer}
                            style={{ width: '400px' }}
                            onChange={(e) => setEditTrailer([{ trailer: e.target.value }])}
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
                            value={editCaster[0]?.caster}
                            style={{ width: '400px' }}
                            onChange={(e) => setEditCaster([{ caster: e.target.value }])}
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
                            value={editDirector[0]?.director}
                            onChange={(e) => setEditDirector([{ director: e.target.value }])}
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
                            value={editDescription[0]?.description}
                            onChange={(e) => setEditDescription([{ description: e.target.value }])}
                            placeholder="Mô tả"
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
                          {isUpdatingMovie ? (
                            <Button type="primary" success loading>
                              Đang Cập Nhật....
                            </Button>
                          ) : (
                            <Button type="primary" success onClick={updateMovie}>
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
