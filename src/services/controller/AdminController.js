import axios from '../Customize-axios';
import { notification } from 'antd';
import queryString from 'query-string';
const GetAllBanners = () => {
  return axios.get('api/admin/GetAllBanners');
};
const token = localStorage.getItem('accesstoken');
const CreateBanner = async (imageUrl, title) => {
  try {
    const queryParams = queryString.stringify({
      ImageUrl: imageUrl,
      Title: title
    });

    const res = await axios.post(
      `api/admin/CreateBanner?${queryParams}`,
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
        description: 'Đã xảy ra lỗi không xác định khi tạo banner.'
      });
    }
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  }
};

export { GetAllBanners, CreateBanner };
