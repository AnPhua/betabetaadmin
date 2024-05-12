import axios from '../Customize-axios';
import { notification } from 'antd';
import { dispatch } from 'store/index';
import { updateStart, updateSuccess, updateFailed } from 'store/reducers/adminSlice';
const GetAllBanner = async (pageNumber, pageSize) => {
  return axios.get(`api/admin/GetAllBanners?PageNumber=${pageNumber}&PageSize=${pageSize}`);
};
const GetBannerById = async (bannerid) => {
  return await axios.get(`api/admin/GetBannerById/${bannerid}`);
};
const GetMovieById = async (movieid) => {
  return await axios.get(`api/staff/GetMovieById?movieId=${movieid}`);
};
const GetAllMovieType = async () => {
  return await axios.get(`api/admin/GetAllMovieTypesNoPagination`);
};
const GetAllRate = async () => {
  return await axios.get(`api/admin/GetAllRateNoPagination`);
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
const GetAllFoods = async (pageNumber, pageSize) => {
  return axios.get(`api/admin/GetAllFoods?PageNumber=${pageNumber}&PageSize=${pageSize}`);
};
const GetFoodById = async (foodid) => {
  return await axios.get(`https://localhost:7067/api/admin/GetFoodById/${foodid}`);
};
const CreateFood = async (formData, setIsLoadingFood) => {
  try {
    setIsLoadingFood(true);
    const res = await axios.post(`api/admin/CreateFood`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: 'Thêm Đồ Ăn Thành Công!'
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
    setIsLoadingFood(false);
  }
};
const DeleteFood = async (foodid) => {
  try {
    await axios.put(
      `api/admin/DeleteFood/${foodid}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    dispatch(updateSuccess());
    notification.success({
      message: 'Thành Công',
      description: 'Xóa Đồ Ăn Thành Công!'
    });
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  }
};
const UpdateFood = async (formData, setIsUpdatingFood) => {
  dispatch(updateStart());
  try {
    setIsUpdatingFood(true);
    const res = await axios.put(`api/admin/UpdateFood`, formData, {
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
    setIsUpdatingFood(false);
  }
};
const UpdateFoodHaveString = async (formData, setIsUpdatingFood) => {
  dispatch(updateStart());
  try {
    setIsUpdatingFood(true);
    const res = await axios.put(`api/admin/UpdateFoodHaveString`, formData, {
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
    setIsUpdatingFood(false);
  }
};
const CreateMovie = async (formData, setIsLoadingCreateMovie) => {
  try {
    setIsLoadingCreateMovie(true);
    const res = await axios.post(`api/admin/CreateMovie`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      notification.success({
        message: 'Thành Công',
        description: 'Thêm Phim Thành Công!'
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
    setIsLoadingCreateMovie(false);
  }
};
const DeleteMovie = async (movieid) => {
  try {
    await axios.put(
      `api/admin/DeleteMovie/${movieid}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    dispatch(updateSuccess());
    notification.success({
      message: 'Thành Công',
      description: 'Xóa Phim Thành Công!'
    });
  } catch (error) {
    notification.error({
      message: 'Lỗi',
      description: error.message || 'Đã xảy ra lỗi khi gọi API.'
    });
  }
};
const UpdateMovie = async (formData, setIsUpdatingMovie) => {
  dispatch(updateStart());
  try {
    setIsUpdatingMovie(true);
    const res = await axios.put(`api/admin/UpdateMovie`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      dispatch(updateSuccess());
      notification.success({
        message: 'Thành Công',
        description: 'Cập Nhật Phim Thành Công!'
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
    setIsUpdatingMovie(false);
  }
};
const UpdateMovieHaveString = async (formData, setIsUpdatingMovie) => {
  dispatch(updateStart());
  try {
    setIsUpdatingMovie(true);
    const res = await axios.put(`api/admin/UpdateMovieHaveString`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      dispatch(updateSuccess());
      notification.success({
        message: 'Thành Công',
        description: 'Cập Nhật Movie Thành Công!'
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
    setIsUpdatingMovie(false);
  }
};
const UpdateMovieImageString = async (formData, setIsUpdatingMovie) => {
  dispatch(updateStart());
  try {
    setIsUpdatingMovie(true);
    const res = await axios.put(`api/admin/UpdateMovieImageString`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      dispatch(updateSuccess());
      notification.success({
        message: 'Thành Công',
        description: 'Cập Nhật Movie Thành Công!'
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
    setIsUpdatingMovie(false);
  }
};
const UpdateMovieHeroString = async (formData, setIsUpdatingMovie) => {
  dispatch(updateStart());
  try {
    setIsUpdatingMovie(true);
    const res = await axios.put(`api/admin/UpdateMovieHeroString`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (res.status === 200) {
      dispatch(updateSuccess());
      notification.success({
        message: 'Thành Công',
        description: 'Cập Nhật Movie Thành Công!'
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
    setIsUpdatingMovie(false);
  }
};
export {
  CreateBanner,
  UpdateMovie,
  UpdateMovieHaveString,
  UpdateMovieImageString,
  UpdateMovieHeroString,
  DeleteBanner,
  GetMovieById,
  GetAllBanner,
  UpdateBanner,
  GetBannerById,
  UpdateBannerHaveString,
  GetAllFoods,
  GetFoodById,
  CreateFood,
  DeleteFood,
  UpdateFood,
  UpdateFoodHaveString,
  GetAllMovieType,
  GetAllRate,
  DeleteMovie,
  CreateMovie
};
