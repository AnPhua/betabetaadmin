import { loginStart, loginSuccess, loginFailed } from '../../store/reducers/authSlice';
import axios from '../Customize-axios';
import { notification } from 'antd';

const loginUser = async (login, dispatch, navigateToHome) => {
  dispatch(loginStart());
  try {
    const res = await axios.post('api/auth/loginstaff', login);
    if (res.status === 200) {
      dispatch(loginSuccess(res.data));
      notification.success({
        message: 'Thành Công',
        description: 'Đăng Nhập Thành Công!'
      });
      navigateToHome('/main');
      //window.location.reload();
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      dispatch(loginFailed());
      notification.error({
        message: 'Lỗi',
        description: error.response.data.message
      });
    } else if (error.response && error.response.status === 500) {
      dispatch(loginFailed());
      notification.error({
        message: 'Lỗi',
        description: 'Tài Khoản Không Tồn Tại!'
      });
    } else {
      dispatch(loginFailed());
      notification.error({
        message: 'Lỗi',
        description: error.message
      });
    }
  }
};

export { loginUser };
