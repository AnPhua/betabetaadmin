/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, IconButton } from '@mui/material';
import { Input, Button, notification, Modal, Spin, Select, DatePicker } from 'antd';
import MainCard from 'components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import moment from 'moment';
import dayjs from 'dayjs';
import {
  GetAllSchedules,
  GetAllRoomNoPagination,
  GetAllMovieNoPagination,
  CreateSchedule,
  DeleteSchedule,
  GetSchedulesById,
  UpdateSchedules
} from 'services/controller/ScheduleController';
import { TablePagination, Checkbox } from '@mui/material';
const ComponentSchedules = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);

  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');

  // ADD A NEW SCHEDULES
  const [addPreDate, setAddPreDate] = useState('');
  const [addNameSchedules, setAddNameSchedules] = useState('');
  const [addChoseMovie, setChoseMovie] = useState([]);
  const [addChoseRoom, setChoseRoom] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoadingCreateSchedule, setIsLoadingCreateSchedule] = useState(false);
  const onChangeStartTime = (_, dateStr) => {
    setAddPreDate(dateStr);
  };
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const formattedDateTime = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year} | ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    return formattedDateTime;
  };
  const formatDateSendtoServer = (date) => {
    let formattedDateTime = null;
    if (date) {
      formattedDateTime = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS');
    }
    return formattedDateTime;
  };
  const handleSelectMovie = (selectedOption) => {
    setSelectedMovie(selectedOption);
  };
  const handleSelectRoom = (selectedOption) => {
    setSelectedRoom(selectedOption);
  };
  const addANewMovie = async () => {
    let errorMessage = '';
    switch (true) {
      case !addPreDate:
        errorMessage = 'Vui lòng chọn lịch chiếu chiếu!';
        break;
      case !addNameSchedules:
        errorMessage = 'Vui lòng nhập tên lịch chiếu!';
        break;
      case !selectedMovie:
        errorMessage = 'Vui lòng chọn Phim!';
        break;
      case !selectedRoom:
        errorMessage = 'Vui lòng chọn Phòng!';
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

    const addschedules = {
      movieId: selectedMovie,
      startAt: formatDateSendtoServer(addPreDate),
      name: addNameSchedules,
      roomId: selectedRoom
    };
    await CreateSchedule(addschedules, setIsLoadingCreateSchedule);
    await getAllSchedules(metadt.PageNumber, metadt.PageSize);
    setAddNameSchedules('');
    setSelectedMovie(null);
    setSelectedRoom(null);
    setAddPreDate('');
  };
  //////////////////////////////////////////
  // UPDATE MOVIE
  const [editPreDate, setEditPreDate] = useState('');
  const [editNameSchedules, setEditNameSchedules] = useState('');
  const [selectedEditMovie, setSelectedEditMovie] = useState(null);
  const [selectedEditRoom, setSelectedEditRoom] = useState(null);
  const [isUpdatingSchedules, setIsUpdatingSchedules] = useState(false);
  const showListMovie = async () => {
    const rescinema = await GetAllMovieNoPagination();
    const resroom = await GetAllRoomNoPagination();
    if (rescinema && resroom) {
      setChoseMovie(rescinema);
      setChoseRoom(resroom);
    }
  };
  const onChangeEditStartTime = (_, dateStr) => {
    setEditPreDate(dateStr);
  };
  const handleEditSelectMovie = (selectedOption) => {
    setSelectedEditMovie(selectedOption);
  };
  const handleEditSelectRoom = (selectedOption) => {
    setSelectedEditRoom(selectedOption);
  };
  const showDataMovie = async (id) => {
    try {
      setIdToUpdate(id);
      const res = await GetSchedulesById(id);
      if (res && res.data) {
        setEditPreDate(res.data.startAt);
        setEditNameSchedules(res.data.name);
      }
    } catch (error) {
      console.error('Error while fetching movie by ID:', error);
    }
  };
  const updateSchedule = async () => {
    let errorMessage = '';
    switch (true) {
      case !editPreDate:
        errorMessage = 'Vui lòng chọn lịch chiếu chiếu!';
        break;
      case !editNameSchedules:
        errorMessage = 'Vui lòng nhập tên lịch chiếu!';
        break;
      case !selectedEditMovie:
        errorMessage = 'Vui lòng chọn Phim!';
        break;
      case !selectedEditRoom:
        errorMessage = 'Vui lòng chọn Phòng!';
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
    const udsch = {
      scheduleId: idToUpdate,
      movieId: selectedEditMovie,
      startAt: formatDateSendtoServer(editPreDate),
      name: editNameSchedules,
      roomId: selectedEditRoom
    };

    await UpdateSchedules(udsch, setIsUpdatingSchedules);
    await getAllSchedules(metadt.PageNumber, metadt.PageSize);
    setIdToUpdate('');
    setEditNameSchedules('');
    setEditPreDate('');
    handleEditSelectMovie('');
    handleEditSelectRoom('');
  };
  /////////////////////////////////////////
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const [metadt, setMetaDt] = useState({ totalItems: 0, PageNumber: 1, PageSize: 10 });

  useEffect(() => {
    setIsComponentVisible(true);
    showListMovie();
    getAllSchedules(metadt.PageNumber, metadt.PageSize);
  }, []);

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleDeleteClick = async () => {
    if (idToDelete) {
      await DeleteSchedule(idToDelete);
      setDeleteModal(false);
      setIdToDelete('');
      await getAllSchedules(1, metadt.PageSize);
    }
  };
  const onPageChange = (e, newpage) => {
    getAllSchedules(newpage + 1, metadt.PageSize);
  };
  const onRowsPerPageChange = (e) => {
    getAllSchedules(1, e.target.value);
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

  const getAllSchedules = async (PageNumber, PageSize) => {
    let res = await GetAllSchedules(PageNumber, PageSize);
    if (res && res.data) {
      setRows(res.data);
      setMetaDt({ totalItems: res.totalItems, PageNumber: res.pageNumber, PageSize: res.pageSize });
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '120vh' }}>
        {isComponentVisible && (
          <Grid container spacing={3}>
            {isLoadingCreateSchedule ? (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Spin spinning={isLoadingCreateSchedule} delay={500} />
              </Grid>
            ) : (
              <>
                <Grid item xs={14}>
                  <MainCard title="CHI TIẾT LỊCH CHIẾU" codeHighlight sx={{ borderWidth: 2 }}>
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
                                    <TableCell align="center">Thời Gian Bắt Đầu</TableCell>
                                    <TableCell align="center">Thời Gian Kết Thúc</TableCell>
                                    <TableCell align="center">Tên Phim</TableCell>
                                    <TableCell align="center">Tên Lịch Chiếu</TableCell>
                                    <TableCell align="center">Tên Phòng</TableCell>
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
                                        <TableCell align="center">{formatDateTime(row.startAt)}</TableCell>
                                        <TableCell align="center">{formatDateTime(row.endAt)}</TableCell>
                                        <TableCell align="center">{row.movieName}</TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center">{row.roomName}</TableCell>
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
                  <MainCard title="THÊM LỊCH CHIẾU" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Thời Gian Chiếu Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <DatePicker showTime onChange={onChangeStartTime} placeholder="Chọn ngày và giờ" />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            style={{ width: '350px' }}
                            placeholder="Chọn Phim"
                            value={selectedMovie}
                            onChange={handleSelectMovie}
                            displayEmpty
                          >
                            {addChoseMovie.map((addChoseMovie) => (
                              <option key={addChoseMovie.id} value={addChoseMovie.id}>
                                {addChoseMovie.name}
                              </option>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Tên Lịch Chiếu
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Tên Lịch Chiếu"
                            value={addNameSchedules}
                            style={{ width: '400px' }}
                            onChange={(e) => setAddNameSchedules(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Phòng
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            style={{ width: '350px' }}
                            placeholder="Chọn Phòng"
                            value={selectedMovie}
                            onChange={handleSelectRoom}
                            displayEmpty
                          >
                            {addChoseRoom.map((addChoseRoom) => (
                              <option key={addChoseRoom.id} value={addChoseRoom.id}>
                                {addChoseRoom.name}
                              </option>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center"></Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Button type="primary" danger onClick={addANewMovie}>
                            Thêm Lịch Chiếu
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
                <Grid item xs={6}>
                  <MainCard title="CẬP NHẬT LỊCH CHIẾU" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Thời Gian Chiếu Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <DatePicker value={dayjs(editPreDate)} showTime onChange={onChangeEditStartTime} placeholder="Chọn ngày và giờ" />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            style={{ width: '350px' }}
                            placeholder="Chọn Phim"
                            value={selectedEditMovie}
                            onChange={handleEditSelectMovie}
                            displayEmpty
                          >
                            {addChoseMovie.map((addChoseMovie) => (
                              <option key={addChoseMovie.id} value={addChoseMovie.id}>
                                {addChoseMovie.name}
                              </option>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Tên Lịch Chiếu
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Tên Lịch Chiếu"
                            value={editNameSchedules}
                            style={{ width: '400px' }}
                            onChange={(e) => setEditNameSchedules(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Phòng
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            style={{ width: '350px' }}
                            placeholder="Chọn Phòng"
                            value={selectedEditRoom}
                            onChange={handleEditSelectRoom}
                            displayEmpty
                          >
                            {addChoseRoom.map((addChoseRoom) => (
                              <option key={addChoseRoom.id} value={addChoseRoom.id}>
                                {addChoseRoom.name}
                              </option>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={3}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center"></Typography>
                        </Grid>
                        <Grid item xs={3}>
                          {isUpdatingSchedules ? (
                            <Button type="primary" success loading>
                              Đang Cập Nhật....
                            </Button>
                          ) : (
                            <Button type="primary" success onClick={updateSchedule}>
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

export default ComponentSchedules;
