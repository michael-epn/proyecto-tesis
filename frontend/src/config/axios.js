import axios from 'axios'

const clienteAxios = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
})

clienteAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default clienteAxios