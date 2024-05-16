/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, IconButton } from '@mui/material';
import { Input, Button, notification, Modal, Spin, Select } from 'antd';
import MainCard from 'components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Close';
import {
  CreateRoom,
  DeleteRoom,
  GetRoomById,
  GetAllRooms,
  GetAllRoomNoPagination,
  GetSeatTypes
} from '../../services/controller/StaffController';
import { TablePagination, Checkbox } from '@mui/material';
const ComponentSeat = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);

  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');

  // ADD A NEW MOVIE
  const [addChoseRoom, setChoseRoom] = useState([]);
  const [addChoseSeatType, setChoseSeatType] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [addCapacity, setAddCapacity] = useState(50);
  const [addNumberSeat, setAddNumberSeat] = useState(1);
  const [addDescription, setDescription] = useState('');
  const [isLoadingCreateRoom, setIsLoadingCreateRoom] = useState(false);
  const [rowSeats, setRowSeats] = useState([{ id: 0 }]);
  const [showAddButton, setShowAddButton] = useState(true);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const addSeatRow = () => {
    if (rowSeats.length < 10) {
      const newRowId = rowSeats[rowSeats.length - 1].id + 1;
      setRowSeats([...rowSeats, { id: newRowId }]);
      setShowRemoveButton(true);
      if (rowSeats.length === 9) {
        setShowAddButton(false);
      }
    }
  };
  const removeSeatRow = () => {
    if (rowSeats.length > 1) {
      const newRows = [...rowSeats];
      newRows.pop();
      setRowSeats(newRows);
      setShowAddButton(true);
      if (newRows.length === 1) {
        setShowRemoveButton(false);
      }
    }
  };
  const handSelectLine = (value) => {
    console.log(`selected ${value}`);
  };
  const handleSelectCinema = (selectedOption) => {
    setSelectedRoom(selectedOption);
  };
  const addANewMovie = async () => {
    let errorMessage = '';
    switch (true) {
      case !addNameRoom:
        errorMessage = 'Vui lòng nhập tên phòng!';
        break;
      case !selectedRoom:
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
      type: addNumberSeat,
      description: addDescription,
      cinemaId: selectedRoom,
      name: addNameRoom,
      request_CreateSeats: null
    };
    await CreateRoom(addroom, setIsLoadingCreateRoom);
    await getAllRooms(metadt.PageNumber, metadt.PageSize);
    setAddNameRoom('');
    setSelectedRoom(null);
    setAddCapacity(50);
    setAddNumberSeat(1);
    setDescription('');
  };
  //////////////////////////////////////////
  // UPDATE MOVIE
  //const [isUpdatingRoom, setIsUpdatingRoom] = useState(false);
  const showListRoomsandSeatType = async () => {
    const rescinema = await GetAllRoomNoPagination();
    const resseattype = await GetSeatTypes();
    if (rescinema) {
      setChoseRoom(rescinema);
      setChoseSeatType(resseattype);
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
  //   const updateRoom = async () => {
  //     let errorMessage = '';
  //     switch (true) {
  //       case !editNameRoom:
  //         errorMessage = 'Vui lòng nhập tên phòng!';
  //         break;
  //       case !editSelectedCinema:
  //         errorMessage = 'Vui lòng chọn rạp!';
  //         break;
  //       case !editDescription:
  //         errorMessage = 'Vui lòng nhập mô tả!';
  //         break;
  //       default:
  //         break;
  //     }

  //     if (errorMessage) {
  //       notification.error({
  //         message: 'Lỗi',
  //         description: errorMessage
  //       });
  //       return;
  //     }
  //     const udroom = {
  //       roomId: idToUpdate,
  //       capacity: editCapacity,
  //       type: editType,
  //       description: editDescription,
  //       cinemaId: editSelectedCinema,
  //       name: editNameRoom,
  //       request_CreateSeats: null
  //     };

  //     await UpdateRoom(udroom, setIsUpdatingRoom);
  //     await getAllRooms(metadt.PageNumber, metadt.PageSize);
  //     setIdToUpdate('');
  //     setEditNameRoom('');
  //     handleEditSelectCinema('');
  //     setEditSelectedCinema('');
  //     setEditCapacity(50);
  //     setEditType(1);
  //     setEditDescription('');
  //   };
  /////////////////////////////////////////
  const [isComponentVisible, setIsComponentVisible] = useState(false);

  const [metadt, setMetaDt] = useState({ totalItems: 0, PageNumber: 1, PageSize: 10 });

  useEffect(() => {
    setIsComponentVisible(true);
    showListRoomsandSeatType();
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
                  <MainCard title="CHI TIẾT PHÒNG VÀ DANH SÁCH GHẾ" codeHighlight sx={{ borderWidth: 2 }}>
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
                                    <TableCell align="center">Phòng</TableCell>
                                    <TableCell align="center">Hàng&Danh Sách Ghế</TableCell>
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
                                        <TableBody>
                                          {row.dataResponseSeats.length > 0 && (
                                            <>
                                              <TableRow>
                                                <TableCell>Hàng</TableCell>
                                                <TableCell>Danh Sách Ghế</TableCell>
                                              </TableRow>
                                              {/* {['A', 'B', 'C', 'D', 'G', 'H', 'I', 'J', 'Z'].map((line) => {
                                                const seatsInLine = row.dataResponseSeats.filter((seat) => seat.line === line);
                                                const boughtSeatsInLine = seatsInLine.filter((seat) => seat.seatStatusName === 'Ghế Hỏng');
                                                if (seatsInLine.length > 0) {
                                                  return (
                                                    <TableRow key={line}>
                                                      <TableCell>{line}</TableCell>
                                                      <TableCell>
                                                        {seatsInLine.map((seat) => (
                                                          <span key={seat.id}>
                                                            {boughtSeatsInLine.includes(seat) ? (
                                                              <span style={{ color: 'red' }}>
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                  {line}
                                                                  {seat.number}
                                                                </span>
                                                                -<span style={{ fontStyle: 'italic' }}>{seat.seatTypeName}</span>.
                                                              </span>
                                                            ) : (
                                                              <span>
                                                                <span style={{ fontWeight: 'bold' }}>
                                                                  {line}
                                                                  {seat.number}
                                                                </span>
                                                                -<span style={{ fontStyle: 'italic' }}>{seat.seatTypeName}</span>.
                                                              </span>
                                                            )}
                                                          </span>
                                                        ))}
                                                      </TableCell>
                                                    </TableRow>
                                                  );
                                                }
                                                return null;
                                              })} */}
                                              {['A', 'B', 'C', 'D', 'G', 'H', 'I', 'J', 'Z'].map((line) => {
                                                const seatsInLine = row.dataResponseSeats.filter((seat) => seat.line === line);
                                                const regularSeatsInLine = seatsInLine.filter(
                                                  (seat) => seat.seatTypeId !== 2 && seat.seatTypeId !== 3
                                                );
                                                const vipSeatsInLine = seatsInLine.filter((seat) => seat.seatTypeId === 2);
                                                const doubleSeatsInLine = seatsInLine.filter((seat) => seat.seatTypeId === 3);
                                                const boughtRegularSeatsInLine = regularSeatsInLine.filter(
                                                  (seat) => seat.seatStatusName === 'Ghế Hỏng'
                                                );
                                                const boughtVipSeatsInLine = vipSeatsInLine.filter(
                                                  (seat) => seat.seatStatusName === 'Ghế Hỏng'
                                                );
                                                const boughtDoubleSeatsInLine = doubleSeatsInLine.filter(
                                                  (seat) => seat.seatStatusName === 'Ghế Hỏng'
                                                );

                                                if (seatsInLine.length > 0) {
                                                  return (
                                                    <TableRow key={line}>
                                                      <TableCell>{line}</TableCell>
                                                      <TableCell>
                                                        {regularSeatsInLine.map((seat) => (
                                                          <span
                                                            key={seat.id}
                                                            style={{ color: boughtRegularSeatsInLine.includes(seat) ? 'red' : 'inherit' }}
                                                          >
                                                            <span style={{ fontWeight: 'bold' }}>
                                                              {line}
                                                              {seat.number}
                                                            </span>
                                                            -<span style={{ fontStyle: 'italic' }}>Ghế Thường</span>.
                                                          </span>
                                                        ))}
                                                        {vipSeatsInLine.map((seat) => (
                                                          <span
                                                            key={seat.id}
                                                            style={{ color: boughtVipSeatsInLine.includes(seat) ? '#990000' : '#CC0000' }}
                                                          >
                                                            <span style={{ fontWeight: 'bold' }}>
                                                              {line}
                                                              {seat.number}
                                                            </span>
                                                            -<span style={{ fontStyle: 'italic' }}>Ghế Vip</span>.
                                                          </span>
                                                        ))}
                                                        {doubleSeatsInLine.map((seat) => (
                                                          <span
                                                            key={seat.id}
                                                            style={{
                                                              color: boughtDoubleSeatsInLine.includes(seat) ? '#003399' : '#0033CC'
                                                            }}
                                                          >
                                                            <span style={{ fontWeight: 'bold' }}>
                                                              {line}
                                                              {seat.number}
                                                            </span>
                                                            -<span style={{ fontStyle: 'italic' }}>Ghế Đôi</span>.
                                                          </span>
                                                        ))}
                                                      </TableCell>
                                                    </TableRow>
                                                  );
                                                }
                                                return null;
                                              })}
                                            </>
                                          )}
                                        </TableBody>

                                        <TableCell>
                                          <IconButton aria-label="edit" size="small">
                                            <EditIcon onClick={() => showDataMovie(row.id)} />
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
                <Grid item xs={12}>
                  <MainCard title="THÊM DANH SÁCH GHẾ" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item style={{ marginLeft: '175px', marginRight: '25px' }}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                            Phòng
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Select
                            style={{ width: '250px' }}
                            placeholder="Chọn Phòng"
                            value={selectedRoom}
                            onChange={handleSelectCinema}
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
                        {rowSeats.map((row, index) => (
                          <Grid
                            container
                            item
                            xs={12}
                            spacing={0}
                            direction="row"
                            alignItems="center"
                            style={{ marginBottom: '10px' }}
                            key={index}
                          >
                            <Grid item style={{ marginLeft: '175px', marginRight: '30px' }}>
                              <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                                Hàng
                              </Typography>
                            </Grid>
                            <Grid>
                              <Select
                                defaultValue="A"
                                style={{
                                  width: 100
                                }}
                              >
                                {['A', 'B', 'C', 'D', 'G', 'H', 'I', 'J', 'Z'].map((value) => (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                ))}
                              </Select>
                            </Grid>
                            <Grid item xs={1}>
                              <Typography variant="subtitle1" gutterBottom alignItem="center" align="center" style={{ paddingTop: '15px' }}>
                                Loại Ghế
                              </Typography>
                            </Grid>
                            <Grid item xs={1}>
                              <Select
                                style={{ width: '150px' }}
                                placeholder="Chọn Loại Ghế"
                                value={selectedRoom}
                                onChange={handleSelectCinema}
                                displayEmpty
                              >
                                {addChoseSeatType.map((addChoseSeatType) => (
                                  <option key={addChoseSeatType.id} value={addChoseSeatType.id}>
                                    {addChoseSeatType.nameType}
                                  </option>
                                ))}
                              </Select>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                      <Grid container xs={12}>
                        {showAddButton ? (
                          <Grid
                            item
                            xs={1}
                            spacing={0}
                            direction="row"
                            alignItems="left"
                            style={{ marginBottom: '10px', cursor: 'pointer' }}
                            onClick={addSeatRow}
                          >
                            <PlusOutlined />
                            Thêm ghế
                          </Grid>
                        ) : (
                          <Grid
                            item
                            xs={1}
                            spacing={0}
                            direction="row"
                            alignItems="left"
                            style={{ marginBottom: '10px', cursor: 'pointer' }}
                            onClick={addSeatRow}
                          ></Grid>
                        )}
                        {showRemoveButton ? (
                          <Grid
                            item
                            spacing={0}
                            direction="row"
                            alignItems="right"
                            style={{ marginBottom: '10px', cursor: 'pointer', marginLeft: '535px' }}
                            onClick={removeSeatRow}
                          >
                            <MinusOutlined />
                            Xóa ghế
                          </Grid>
                        ) : (
                          <Grid
                            item
                            spacing={0}
                            direction="row"
                            alignItems="right"
                            style={{ marginBottom: '10px', cursor: 'pointer', marginLeft: '535px' }}
                            onClick={removeSeatRow}
                          ></Grid>
                        )}
                      </Grid>

                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="subtitle1" gutterBottom alignItem="center" align="center"></Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Button type="primary" danger onClick={addANewMovie}>
                            Thêm Danh Sách Ghế
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
                <Grid item xs={6}></Grid>
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
        <p>Bạn Có Chắc Chắn Muốn Xóa ?</p>
      </Modal>
    </>
  );
};

export default ComponentSeat;
