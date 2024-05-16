import axios from '../Customize-axios';
import { notification } from 'antd';
const token = localStorage.getItem('accesstoken');
const GetAllSchedules = async (pageNumber, pageSize) => {
  return axios.get(`api/Member/getAllSchedules?PageNumber=${pageNumber}&PageSize=${pageSize}`);
};
const GetAllMovieNoPagination = async () => {
  return axios.get(`api/admin/GetAllMovieNoPagination`);
};
const GetAllRoomNoPagination = async () => {
  return axios.get(`api/admin/GetAllRoomNoPagination`);
};
const CreateSchedule = async (addschedules, setIsLoadingCreateSchedule) => {
  try {
    setIsLoadingCreateSchedule(true);
    const res = await axios.post(`api/Member/createSchedule`, addschedules, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: 'Thêm Lịch Chiếu Thành Công!'
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
    setIsLoadingCreateSchedule(false);
  }
};
const DeleteSchedule = async (id) => {
  try {
    const res = await axios.put(
      `api/staff/deleteSchedule/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: res.message
      });
    } else if (res.status === 400) {
      notification.error({
        message: 'Lỗi',
        description: res.message
      });
    }
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  }
};
const GetSchedulesById = (schId) => {
  return axios.get(`api/admin/GetSchedulesById/${schId}`);
};
const UpdateSchedules = async (udsch, setIsUpdatingSchedules) => {
  try {
    setIsUpdatingSchedules(true);
    const res = await axios.put(`api/Member/updateSchedule`, udsch, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: 'Cập Nhật Lịch Chiếu Thành Công!'
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
    setIsUpdatingSchedules(false);
  }
};
export {
  GetAllSchedules,
  GetAllMovieNoPagination,
  GetAllRoomNoPagination,
  CreateSchedule,
  DeleteSchedule,
  GetSchedulesById,
  UpdateSchedules
};
