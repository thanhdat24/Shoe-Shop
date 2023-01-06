import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// config
import { HOST_API } from '../config';
// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

// axiosInstance.interceptors.response.use(async (config) => {
//   const currentUser = firebase.auth().currentUser;
//   if (currentUser) {
//     const accessToken = await currentUser.getIdToken();
//     config.headers.common.Authorization = `Bearer ${accessToken}`;
//   }
// });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
