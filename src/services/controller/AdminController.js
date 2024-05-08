import axios from '../Customize-axios';
import { notification } from 'antd';
import { dispatch } from 'store/index';
import { updateStart, updateSuccess, updateFailed } from 'store/reducers/adminSlice';
const GetAllBanner = async (pageNumber, pageSize) => {
  return axios.get(`https://localhost:7067/api/admin/GetAllBanners?PageNumber=${pageNumber}&PageSize=${pageSize}`);
};
const GetBannerById = async (Bannerid) => {
  return await axios.get(`https://localhost:7067/api/admin/GetBannerById/${Bannerid}`);
};

const token = localStorage.getItem('accesstoken');
const CreateBanner = async (formData, setIsLoading) => {
  try {
    setIsLoading(true);
    const res = await axios.post(`api/admin/CreateBanner`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: 'Thêm Banner Thành Công!'
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
const DeleteBanner = async (id) => {
  try {
    await axios.delete(`api/admin/DeleteBanner/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    //if (res.status === 200) {
    notification.success({
      message: 'Thành Công',
      description: 'Xóa Banner Thành Công!'
    });
    // } else if (res.status === 400) {
    //   notification.error({
    //     message: 'Lỗi',
    //     description: res.data.message
    //   });
    // } else if (res.status === 401) {
    //   notification.error({
    //     message: 'Lỗi',
    //     description: res.data.message
    //   });
    // } else {
    //   notification.error({
    //     message: 'Lỗi',
    //     description: 'Đã Có Lỗi Xảy Ra!'
    //   });
    // }
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  }
};
const UpdateBanner = async (formData, setIsUpdating) => {
  dispatch(updateStart());
  try {
    setIsUpdating(true);
    const res = await axios.put(`api/admin/UpdateBanner`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      dispatch(updateSuccess());
      notification.success({
        message: 'Thành Công',
        description: 'Cập Nhật Banner Thành Công!'
      });
    } else if (res.status === 400) {
      dispatch(updateFailed());
      notification.error({
        message: 'Lỗi',
        description: res.data.message
      });
    } else {
      dispatch(updateFailed());
      notification.error({
        message: 'Lỗi',
        description: 'Đã Xảy Ra Lỗi Không Xác Định.'
      });
    }
  } catch (error) {
    dispatch(updateFailed());
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  } finally {
    setIsUpdating(false);
  }
};
const UpdateBannerHaveString = async (formData, setIsUpdating) => {
  dispatch(updateStart());
  try {
    setIsUpdating(true);
    const res = await axios.put(`api/admin/UpdateBannerhavestring`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      dispatch(updateSuccess());
      notification.success({
        message: 'Thành Công',
        description: 'Cập Nhật Banner Thành Công!'
      });
    } else if (res.status === 400) {
      dispatch(updateFailed());
      notification.error({
        message: 'Lỗi',
        description: res.data.message
      });
    } else {
      dispatch(updateFailed());
      notification.error({
        message: 'Lỗi',
        description: 'Đã Xảy Ra Lỗi Không Xác Định.'
      });
    }
  } catch (error) {
    dispatch(updateFailed());
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  } finally {
    setIsUpdating(false);
  }
};
export { CreateBanner, DeleteBanner, GetAllBanner, UpdateBanner, GetBannerById, UpdateBannerHaveString };
