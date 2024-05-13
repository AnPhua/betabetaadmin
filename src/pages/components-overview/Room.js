/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, IconButton } from '@mui/material';
import { Input, Button, notification, Modal, Spin, InputNumber, Select } from 'antd';
import MainCard from 'components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Close';
import {
  CreateRoom,
  DeleteRoom,
  GetRoomById,
  UpdateRoom,
  GetAllRooms,
  GetAllCinemaNoPagination
} from '../../services/controller/StaffController';
import { TablePagination, Checkbox } from '@mui/material';
const ComponentRoom = () => {
  const { TextArea } = Input;
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);

  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');

  // ADD A NEW MOVIE
  const [addNameRoom, setAddNameRoom] = useState('');
  const [addChoseCinema, setChoseCinema] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [addCapacity, setAddCapacity] = useState(50);
  const [addType, setAddType] = useState(1);
  const [addDescription, setDescription] = useState('');
  const [isLoadingCreateRoom, setIsLoadingCreateRoom] = useState(false);

  const handleSelectCinema = (selectedOption) => {
    setSelectedCinema(selectedOption);
  };
  const addANewMovie = async () => {
    let errorMessage = '';
    switch (true) {
      case !addNameRoom:
        errorMessage = 'Vui lòng nhập tên phòng!';
        break;
      case !selectedCinema:
        errorMessage = 'Vui lòng chọn rạp!';
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

    const addroom = {
      capacity: addCapacity,
      type: addType,
      description: addDescription,
      cinemaId: selectedCinema,
      name: addNameRoom,
      request_CreateSeats: null
    };
    await CreateRoom(addroom, setIsLoadingCreateRoom);
    await getAllRooms(metadt.PageNumber, metadt.PageSize);
    setAddNameRoom('');
    setSelectedCinema(null);
    setAddCapacity(50);
    setAddType(1);
    setDescription('');
  };
  //////////////////////////////////////////
  // UPDATE MOVIE
  const [editNameRoom, setEditNameRoom] = useState('');
  const [editCapacity, setEditCapacity] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSelectedCinema, setEditSelectedCinema] = useState(null);
  const [editType, setEditType] = useState('');
  const [isUpdatingRoom, setIsUpdatingRoom] = useState(false);
  const showListCinema = async () => {
    const rescinema = await GetAllCinemaNoPagination();
    if (rescinema) {
      setChoseCinema(rescinema);
    }
  };
  const handleEditSelectCinema = (selectedOption) => {
    setEditSelectedCinema(selectedOption);
  };
  const showDataMovie = async (id) => {
    try {
      setIdToUpdate(id);
      const res = await GetRoomById(id);
      if (res && res.data) {
        setEditNameRoom(res.data.name);
        setEditCapacity(res.data.capacity);
        setEditDescription(res.data.description);
        setEditType(res.data.type);
      }
    } catch (error) {
      console.error('Error while fetching movie by ID:', error);
    }
  };
  const updateMovie = async () => {
    let errorMessage = '';
    switch (true) {
      case !editNameRoom:
        errorMessage = 'Vui lòng nhập tên phòng!';
        break;
      case !editSelectedCinema:
        errorMessage = 'Vui lòng chọn rạp!';
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
    const udroom = {
      roomId: idToUpdate,
      capacity: editCapacity,
      type: editType,
      description: editDescription,
      cinemaId: editSelectedCinema,
      name: editNameRoom,
      request_CreateSeats: null
    };

    await UpdateRoom(udroom, setIsUpdatingRoom);
    await getAllRooms(metadt.PageNumber, metadt.PageSize);
    setIdToUpdate('');
    setEditNameRoom('');
    handleEditSelectCinema('');
    setEditCapacity(50);
    setEditType(1);
    setEditDescription('');
  };
  /////////////////////////////////////////
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const [metadt, setMetaDt] = useState({ totalItems: 0, PageNumber: 1, PageSize: 10 });

  useEffect(() => {
    setIsComponentVisible(true);
    showListCinema();
    getAllRooms(metadt.PageNumber, metadt.PageSize);
  }, []);

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleDeleteClick = async () => {
    if (idToDelete) {
      await DeleteRoom(idToDelete);
      setDeleteModal(false);
      setIdToDelete('');
      await getAllRooms(1, metadt.PageSize);
    }
  };
  const onPageChange = (e, newpage) => {
    getAllRooms(newpage + 1, metadt.PageSize);
  };
  const onRowsPerPageChange = (e) => {
    getAllRooms(1, e.target.value);
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

  const getAllRooms = async (PageNumber, PageSize) => {
    let res = await GetAllRooms(PageNumber, PageSize);
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
            {isLoadingCreateRoom ? (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Spin spinning={isLoadingCreateRoom} delay={500} />
              </Grid>
            ) : (
              <>
                <Grid item xs={14}>
                  <MainCard title="CHI TIẾT PHÒNG" codeHighlight sx={{ borderWidth: 2 }}>
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
                                    <TableCell align="center">Sức Chứa</TableCell>
                                    <TableCell align="center">Loại Phòng</TableCell>
                                    <TableCell align="center">Mô Tả</TableCell>
                                    <TableCell align="center">Phòng Của Rạp</TableCell>
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
                                        <TableCell align="center">{row.capacity}</TableCell>
                                        <TableCell align="center">{row.type}</TableCell>
                                        <TableCell align="center">{row.description}</TableCell>
                                        <TableCell align="center">{row.cinemaName}</TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
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
                  <MainCard title="THÊM PHÒNG" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Sức Chứa
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <InputNumber
                            placeholder="Sức Chứa"
                            min={50}
                            max={300}
                            defaultValue={100}
                            value={addCapacity}
                            onChange={(value) => setAddCapacity(value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Phòng Của Rạp
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select
                            style={{ width: '250px' }}
                            placeholder="Chọn Rạp"
                            value={selectedCinema}
                            onChange={handleSelectCinema}
                            displayEmpty
                          >
                            {addChoseCinema.map((addChoseCinema) => (
                              <option key={addChoseCinema.id} value={addChoseCinema.id}>
                                {addChoseCinema.nameOfCinema}
                              </option>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Loại Phòng
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <InputNumber
                            placeholder="Loại phòng"
                            min={1}
                            max={5}
                            defaultValue={1}
                            value={addType}
                            onChange={(value) => setAddType(value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Tên Phòng
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Tên Phòng"
                            value={addNameRoom}
                            style={{ width: '400px' }}
                            onChange={(e) => setAddNameRoom(e.target.value)}
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
                            Thêm Phòng
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
                <Grid item xs={6}>
                  <MainCard title="CẬP NHẬT PHÒNG" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Sức Chứa
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <InputNumber
                            placeholder="Sức Chứa"
                            min={50}
                            max={300}
                            defaultValue={100}
                            value={editCapacity}
                            onChange={(value) => setEditCapacity(value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Phòng Của Rạp
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Select style={{ width: '250px' }} placeholder="Chọn Rạp" onChange={handleEditSelectCinema} displayEmpty>
                            {addChoseCinema.map((addChoseCinema) => (
                              <option key={addChoseCinema.id} value={addChoseCinema.id}>
                                {addChoseCinema.nameOfCinema}
                              </option>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Loại Phòng
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <InputNumber
                            placeholder="Loại phòng"
                            min={1}
                            max={5}
                            defaultValue={1}
                            value={editType}
                            onChange={(value) => setEditType(value)}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Tên Phòng
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Tên Phòng"
                            value={editNameRoom}
                            style={{ width: '400px' }}
                            onChange={(e) => setEditNameRoom(e.target.value)}
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
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
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
                          {isUpdatingRoom ? (
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

export default ComponentRoom;
