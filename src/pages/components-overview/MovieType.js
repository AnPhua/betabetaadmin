/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, IconButton } from '@mui/material';
import { Input, Button, notification, Modal, Spin } from 'antd';
import MainCard from 'components/MainCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import {
  CreateMovieType,
  DeleteMovieType,
  GetAllMovieType,
  GetMovieTypeById,
  UpdateMovieType
} from '../../services/controller/StaffController';
import { TablePagination, Checkbox, CircularProgress } from '@mui/material';

const ComponentMovieType = () => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [deletemodal, setDeleteModal] = useState(false);
  const [editMovieType, setEditMovieType] = useState([{ movieTypeName: '' }]);
  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [addMovieTypeName, setAddMovieTypeName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [metadt, setMetaDt] = useState({ totalItems: 0, PageNumber: 1, PageSize: 10 });

  useEffect(() => {
    setIsComponentVisible(true);
    getAllMovieType(metadt.PageNumber, metadt.PageSize);
  }, []);

  const addANewBanner = async () => {
    const formData = new FormData();
    if (!addMovieTypeName) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập tiêu đề!'
      });
      return;
    }
    formData.append('MovieTypeName', addMovieTypeName);
    await CreateMovieType(formData, setIsLoading);
    await getAllMovieType(metadt.PageNumber, metadt.PageSize);
    setAddMovieTypeName('');
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleDeleteClick = async () => {
    if (idToDelete) {
      await DeleteMovieType(idToDelete);
      setDeleteModal(false);
      setIdToDelete('');
      await getAllMovieType(1, metadt.PageSize);
    }
  };
  const onPageChange = (e, newpage) => {
    getAllMovieType(newpage + 1, metadt.PageSize);
  };
  const onRowsPerPageChange = (e) => {
    getAllMovieType(1, e.target.value);
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
      const res = await GetMovieTypeById(id);
      if (res && res.data) {
        const { movieTypeName } = res.data;
        setEditMovieType([{ movieTypeName }]);
      }
    } catch (error) {
      console.error('Error while fetching banner by ID:', error);
    }
  };

  const updateabanner = async () => {
    const formData = new FormData();

    if (!editMovieType) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng nhập tên thể loại phim!'
      });
      return;
    }

    formData.append('Id', idToUpdate);
    formData.append('MovieTypeName', editMovieType[0].movieTypeName);

    await UpdateMovieType(formData, setIsUpdating);
    await getAllMovieType(metadt.PageNumber, metadt.PageSize);
    setIdToUpdate('');
    setEditMovieType('');
  };
  const getAllMovieType = async (PageNumber, PageSize) => {
    let res = await GetAllMovieType(PageNumber, PageSize);
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
                  <MainCard title="THỂ LOẠI PHIM" codeHighlight sx={{ borderWidth: 2 }}>
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
                                    <TableCell align="center">Tên Thể Loại Phim</TableCell>
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
                                        <TableCell align="center">{row.movieTypeName}</TableCell>
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
                  <MainCard title="THÊM THỂ LOẠI PHIM" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography
                            variant="submovieTypeName1"
                            gutterBottom
                            alignItem="center"
                            align="center"
                            style={{ paddingTop: '15px' }}
                          >
                            Tên Thể Loại Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input placeholder="Title" value={addMovieTypeName} onChange={(e) => setAddMovieTypeName(e.target.value)} />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="submovieTypeName1" gutterBottom alignItem="center" align="center"></Typography>
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
                  <MainCard title="CẬP NHẬT THỂ LOẠI PHIM" codeHighlight sx={{ borderWidth: 2 }}>
                    <Grid container spacing={0}>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography
                            variant="submovieTypeName1"
                            gutterBottom
                            alignItem="center"
                            align="center"
                            style={{ paddingTop: '15px' }}
                          >
                            Tên Thể Loại Phim
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Input
                            placeholder="Thể Loại Phim"
                            value={editMovieType[0]?.movieTypeName}
                            onChange={(e) => setEditMovieType([{ movieTypeName: e.target.value }])}
                          />
                        </Grid>
                      </Grid>
                      <Grid container item xs={12} spacing={0} direction="row" alignItems="center" style={{ marginBottom: '10px' }}>
                        <Grid item xs={2}>
                          <Typography variant="submovieTypeName1" gutterBottom alignItem="center" align="center"></Typography>
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
        movieTypeName="Xóa Banner !"
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

export default ComponentMovieType;
