import axios from '../Customize-axios';
import { notification } from 'antd';
const GetAllBannersNoPagination = async () => {
  return axios.get(`https://localhost:7067/api/admin/GetAllBannersNoPagination`);
};
const token = localStorage.getItem('accesstoken');
const CreateBanner = async (formData) => {
  try {
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
  }
};
const DeleteBanner = async (id) => {
  try {
    await axios.delete(`api/admin/DeleteBanner/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    notification.success({
      message: 'Thành Công',
      description: 'Xóa Banner Thành Công!'
    });
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  }
};

export { GetAllBannersNoPagination, CreateBanner, DeleteBanner };
