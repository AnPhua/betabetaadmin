import axios from '../Customize-axios';
import { notification } from 'antd';
const token = localStorage.getItem('accesstoken');

const GetAllMovie = (PageNumber, PageSize) => {
  return axios.get(`api/staff/GetAllMovie?PageNumber=${PageNumber}&PageSize=${PageSize}`);
};
const GetAllRooms = (pageNumber, pageSize) => {
  return axios.get(`api/admin/GetAllRooms?pageSize=${pageSize}&pageNumber=${pageNumber}`);
};
const GetMovieById = (movieId) => {
  return axios.get(`api/staff/GetMovieById?movieId=${movieId}`);
};
const GetAllMovieType = async (pageNumber, pageSize) => {
  return axios.get(`api/Member/GetAllMovieTypes?PageNumber=${pageNumber}&PageSize=${pageSize}`);
};
const GetMovieTypeById = (movieTypeid) => {
  return axios.get(`api/Member/GetMovieTypeById/${movieTypeid}`);
};
const CreateMovieType = async (formData, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await axios.post(`api/admin/CreateMovieType`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: 'Thêm Thể Loại Phim Thành Công!'
      });
    } else if (res.status === 400) {
      notification.error({
        message: 'Lỗi',
        description: res.data.message
      });
    } else {
      notification.error({
        message: 'Lỗi',
        description: 'Đã Xảy Ra Lỗi Không Xác Định.'
      });
    }
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  } finally {
    setIsLoading(false);
  }
};
const UpdateMovieType = async (formData, setIsUpdating) => {
  try {
    setIsUpdating(true);
    const res = await axios.put(`api/admin/UpdateMovieType`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: 'Cập Nhật Thể Loại Phim Thành Công!'
      });
    } else if (res.status === 400) {
      notification.error({
        message: 'Lỗi',
        description: res.data.message
      });
    } else {
      notification.error({
        message: 'Lỗi',
        description: 'Đã Xảy Ra Lỗi Không Xác Định.'
      });
    }
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  } finally {
    setIsUpdating(false);
  }
};
const DeleteMovieType = async (id) => {
  try {
    await axios.put(
      `api/admin/DeleteMovieType/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    notification.success({
      message: 'Thành Công',
      description: 'Xóa Thể Loại Thành Công!'
    });
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  }
};

const GetRoomById = (roomId) => {
  return axios.get(`api/admin/GetRoomById/${roomId}`);
};
const CreateRoom = async (addroom, setIsLoadingCreateRoom) => {
  try {
    setIsLoadingCreateRoom(true);
    const res = await axios.post(`api/admin/CreateRoom`, addroom, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: 'Thêm Phòng Thành Công!'
      });
    } else if (res.status === 400) {
      notification.error({
        message: 'Lỗi',
        description: res.data.message
      });
    } else {
      notification.error({
        message: 'Lỗi',
        description: 'Đã Xảy Ra Lỗi Không Xác Định.'
      });
    }
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  } finally {
    setIsLoadingCreateRoom(false);
  }
};
const UpdateRoom = async (udroom, setIsUpdatingRoom) => {
  try {
    setIsUpdatingRoom(true);
    const res = await axios.put(`api/admin/UpdateRoom`, udroom, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: 'Cập Nhật Phòng Thành Công!'
      });
    } else if (res.status === 400) {
      notification.error({
        message: 'Lỗi',
        description: res.message
      });
    } else {
      notification.error({
        message: 'Lỗi',
        description: 'Đã Xảy Ra Lỗi Không Xác Định.'
      });
    }
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  } finally {
    setIsUpdatingRoom(false);
  }
};
const DeleteRoom = async (id) => {
  try {
    await axios.put(
      `api/admin/DeleteRoom/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    notification.success({
      message: 'Thành Công',
      description: 'Xóa Phòng Thành Công!'
    });
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  }
};
const GetAllCinemaNoPagination = async () => {
  return axios.get(`api/admin/GetAllCinemaNoPagination`);
};
const GetAllRoomNoPagination = async () => {
  return axios.get(`api/admin/GetAllRoomNoPagination`);
};
const GetSeatTypes = async () => {
  return axios.get(`api/admin/GetSeatTypes`);
};
export {
  GetAllMovie,
  GetMovieById,
  GetMovieTypeById,
  CreateMovieType,
  GetAllMovieType,
  UpdateMovieType,
  DeleteMovieType,
  GetAllRooms,
  GetRoomById,
  CreateRoom,
  UpdateRoom,
  DeleteRoom,
  GetAllCinemaNoPagination,
  GetAllRoomNoPagination,
  GetSeatTypes
};
