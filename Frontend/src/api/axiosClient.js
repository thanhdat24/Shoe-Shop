import axios from "axios";
import { BASE_URL } from "../constants/config";
import firebase from "firebase/compat/app";
const axiosClient = axios.create({
  baseURL: BASE_URL,
});

// const getFirebaseToken = () => {
//   const currentUser = firebase.auth().currentUser;
//   if (currentUser) return currentUser.getIdToken();

//   // Not logged in
//   const hasRememberAccount = localStorage.getItem("user_login");
//   if (!hasRememberAccount) return null;

//   // Logged in but current user is not fetched -> wait (10s)
//   return new Promise((resolve, reject) => {
//     const unregisterAuthObserver = firebase
//       .auth()
//       .onAuthStateChanged(async (user) => {
//         if (!user) {
//           reject(null);
//         }
//         // console.log("Logged in user", user.displayName);
//         // console.log("Logged in user token", token);
//       });
//   });
// };
axiosClient.interceptors.request.use((config) => {
  //tất cả request đều phải qua đây
  const user = localStorage.getItem("user_login");
  if (user) {
    // nếu có đăng nhập thì thực hiện
    const { token } = JSON.parse(user);
    config.headers.common.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
