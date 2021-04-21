import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, (error) => {
  //前面是success，後面是error，這裡只處理error的狀況
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    //400多表示是expected errors，所以不需要log出來，直接讓catch block去處理
    console.log("Logging the error", error);
    toast.error("An unexpected error occurred.");
  }
  return Promise.reject(error);
});

function setJwt(jwt) {
  //設定axios的預設headers，這裡.common表示所有request種類（get,post,delete,put,patch）,可以針對各個request進行設定（例如：axios.defaults.headers.get["x-auth-token"] = ...）
  axios.defaults.headers.common["x-auth-token"] = jwt; //如果jwt不存在則會是undefined, x-auth-token就不會被設定
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
