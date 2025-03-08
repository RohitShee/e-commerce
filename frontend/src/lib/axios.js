import axios from "axios";

const axiosInstance = axios.create({
    baseURL : import.meta.mode === "development" ? "http://localhost:5000" : "/api",
    withCredentials : true //send cookies with request
})

export default axiosInstance;