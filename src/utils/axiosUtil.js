import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000", // localhost
  baseURL: "https://jeff.adaptable.app/" // hosted
});

export default axiosInstance;
