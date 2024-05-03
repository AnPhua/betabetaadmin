import axios from '../Customize-axios';
const GetMovieUnreference = () => {
  return axios.get('api/staff/GetMovieUnreference?PremiereDate=2024/04/09&pageSize=10&pageNumber=1');
};
const GetMovieShowing = () => {
  return axios.get('api/staff/GetMovieShowing?PremiereDate=2024%2F04%2F09&pageSize=10&pageNumber=1');
};
const GetSneakShow = () => {
  return axios.get('api/staff/GetAllMovie?MovieTypeId=6&pageSize=10&pageNumber=1');
};
const GetAllMovie = () => {
  return axios.get('api/staff/GetAllMovie?pageSize=13&pageNumber=1');
};
const GetMovieById = (movieId) => {
  return axios.get(`api/staff/GetMovieById?movieId=${movieId}`);
};

export { GetMovieUnreference, GetMovieShowing, GetSneakShow, GetAllMovie, GetMovieById };
