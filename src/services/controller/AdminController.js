import axios from '../Customize-axios';
import { notification } from 'antd';
const GetAllBannersNoPagination = async () => {
  return axios.get(`https://localhost:7067/api/admin/GetAllBannersNoPagination`);
};
const GetAllBanner = async (pageNumber, pageSize) => {
  return axios.get(`https://localhost:7067/api/admin/GetAllBanners?PageNumber=${pageNumber}&PageSize=${pageSize}`);
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
    const res = await axios.delete(`api/admin/DeleteBanner/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.status === 400) {
      notification.error({
        message: 'Lỗi',
        description: res.data.message
      });
    } else if (res.status === 401) {
      notification.error({
        message: 'Lỗi',
        description: res.data.message
      });
    } else {
      notification.success({
        message: 'Thành Công',
        description: 'Xóa Banner Thành Công!'
      });
    }
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  }
};

export { GetAllBannersNoPagination, CreateBanner, DeleteBanner, GetAllBanner };
