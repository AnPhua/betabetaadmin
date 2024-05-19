/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody } from '@mui/material';
import { Button, notification, Modal, Spin, Select } from 'antd';
import MainCard from 'components/MainCard';
import { AddaListTickets, DeleteRoom, GetListForTicket, GetSchedulesNoPagination } from '../../services/controller/StaffController';
import { TablePagination, Checkbox } from '@mui/material';
const ComponentTicket = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);

  const [idToDelete, setIdToDelete] = useState('');

  // ADD A LIST TICKETS
  const [addChoseRoom, setChoseRoom] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState(null);
  const [isLoadingaddList, setIsLoadingaddList] = useState(false);

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const formattedDateTime = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    return formattedDateTime;
  };
  const formatTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const formattedDateTime = ` ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    return formattedDateTime;
  };
  const handleSelectSchedules = (selectedOption) => {
    setSelectedSchedules(selectedOption);
  };

  const addListSeat = async () => {
    let errorMessage = '';
    switch (true) {
      case !selectedSchedules:
        errorMessage = 'Hãy chọn suất chiếu !';
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

    await AddaListTickets(selectedSchedules, setIsLoadingaddList);
    await getAllRooms(metadt.PageNumber, metadt.PageSize);
    setSelectedSchedules(null);
  };

  //////////////////////////////////////////
  // UPDATE MOVIE
  //const [isUpdatingRoom, setIsUpdatingRoom] = useState(false);
  const showListRoomsandSeatType = async () => {
    const rescinema = await GetSchedulesNoPagination();
    if (rescinema) {
      setChoseRoom(rescinema);
    }
  };

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

  const getAllRooms = async (PageNumber, PageSize) => {
    let res = await GetListForTicket(PageNumber, PageSize);
    if (res && res.data) {
      setRows(res.data);
      setMetaDt({ totalItems: res.totalItems, PageNumber: res.pageNumber, PageSize: res.pageSize });
    }
  };
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150vh' }}>
        {isComponentVisible && (
          <Grid container spacing={3}>
            {isLoadingaddList ? (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Spin spinning={isLoadingaddList} delay={500} />
              </Grid>
            ) : (
              <>
                <Grid item xs={12}>
                  <MainCard title="CHI TIẾT LỊCH CHIẾU VÀ DANH SÁCH GHẾ" codeHighlight sx={{ borderWidth: 2, height: '1000px' }}>
                    <Grid container spacing={0} direction="row">
                      <div style={{ width: '100%', height: '100%' }}>
                        <Box
                          sx={{
                            overflowY: 'auto',
                            height: '850px',
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
                                    <TableCell align="center">Tên Suất Chiếu</TableCell>
                                    <TableCell align="center">Ghế Trống</TableCell>
                                    <TableCell align="center">Thời Gian Bắt Đầu</TableCell>
                                    <TableCell align="center">Thời Gian Kết Thúc</TableCell>
                                    <TableCell align="center" sx={{ width: '600px' }}>
                                      Hàng&Danh Sách Ghế
                                    </TableCell>
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
                                        <TableCell align="center">{row.roomName}</TableCell>
                                        <TableCell align="center">
                                          <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>
                                            Phim :{' '}
                                            <span
                                              style={{
                                                color: '#FF4433',
                                                fontFamily: 'Arial, sans-serif',
                                                fontSize: '18px',
                                                fontWeight: 'bold'
                                              }}
                                            >
                                              {row.movieName}
                                            </span>
                                          </span>
                                        </TableCell>
                                        <TableCell align="center">{row.emptySeat} ghế trống</TableCell>
                                        <TableCell align="center">
                                          <span style={{ fontWeight: 'bold' }}>{formatDateTime(row.startAt)}</span>
                                        </TableCell>
                                        <TableCell align="center">
                                          <span style={{ fontWeight: 'bold' }}>{formatDateTime(row.endAt)}</span>
                                        </TableCell>
                                        <TableBody>
                                          {row.dataResponsesTicketforsche.length > 0 && (
                                            <>
                                              <TableRow>
                                                <TableCell>Hàng</TableCell>
                                                <TableCell>Danh Sách Vé</TableCell>
                                              </TableRow>
                                              {/* {['A', 'B', 'C', 'D', 'G', 'H', 'I', 'J', 'Z'].map((line) => {
                                                const seatsInLine = row.dataResponsesTicketforsche.filter((seat) => seat.line === line);
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
                                                const seatsInLine = row.dataResponsesTicketforsche.filter((seat) => seat.line === line);
                                                const regularSeatsInLine = seatsInLine.filter(
                                                  (seat) => seat.seatTypeId !== 2 && seat.seatTypeId !== 3
                                                );
                                                const vipSeatsInLine = seatsInLine.filter((seat) => seat.seatTypeId === 2);
                                                const doubleSeatsInLine = seatsInLine.filter((seat) => seat.seatTypeId === 3);
                                                const boughtRegularSeatsInLine = regularSeatsInLine.filter(
                                                  (seat) => seat.isActive === false
                                                );
                                                const boughtVipSeatsInLine = vipSeatsInLine.filter((seat) => seat.isActive === false);
                                                const boughtDoubleSeatsInLine = doubleSeatsInLine.filter((seat) => seat.isActive === false);

                                                if (seatsInLine.length > 0) {
                                                  return (
                                                    <TableRow key={line}>
                                                      <TableCell>
                                                        <span style={{ fontWeight: 'bold' }}>{line}</span>
                                                      </TableCell>
                                                      <TableCell>
                                                        {regularSeatsInLine.map((seat) => (
                                                          <span
                                                            key={seat.id}
                                                            style={{
                                                              color: boughtRegularSeatsInLine.includes(seat) ? '#FF3131' : 'inherit',
                                                              textDecoration: boughtRegularSeatsInLine.includes(seat) ? 'line-through' : ''
                                                            }}
                                                          >
                                                            <span style={{ fontWeight: 'bold' }}>{seat.seatName}</span>-
                                                            <span style={{ fontStyle: 'italic' }}>Ghế Thường</span>.
                                                          </span>
                                                        ))}
                                                        {vipSeatsInLine.map((seat) => (
                                                          <span
                                                            key={seat.id}
                                                            style={{
                                                              color: boughtVipSeatsInLine.includes(seat) ? '#FF3131' : '#inherit',
                                                              textDecoration: boughtRegularSeatsInLine.includes(seat) ? 'line-through' : ''
                                                            }}
                                                          >
                                                            <span style={{ fontWeight: 'bold' }}>{seat.seatName}</span>-
                                                            <span style={{ fontStyle: 'italic' }}>Ghế Vip</span>.
                                                          </span>
                                                        ))}
                                                        {doubleSeatsInLine.map((seat) => (
                                                          <span
                                                            key={seat.id}
                                                            style={{
                                                              color: boughtDoubleSeatsInLine.includes(seat) ? '#FF3131' : '#inherit',
                                                              textDecoration: boughtRegularSeatsInLine.includes(seat) ? 'line-through' : ''
                                                            }}
                                                          >
                                                            <span style={{ fontWeight: 'bold' }}>{seat.seatName}</span>-
                                                            <span style={{ fontStyle: 'italic' }}>Ghế Đôi</span>.
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
                        <Grid item style={{ marginRight: '25px' }}>
                          <Select style={{ width: '500px' }} placeholder="Chọn Suất Chiếu" onChange={handleSelectSchedules} displayEmpty>
                            {addChoseRoom.map((addChoseRoom) => (
                              <option key={addChoseRoom.id} value={addChoseRoom.id}>
                                {addChoseRoom.name}-{formatTime(addChoseRoom.startAt)} | {formatTime(addChoseRoom.endAt)}
                              </option>
                            ))}
                          </Select>
                        </Grid>
                        <Grid item sx={2}>
                          <Button type="primary" danger onClick={addListSeat}>
                            Thêm Danh Sách Vé
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

export default ComponentTicket;
