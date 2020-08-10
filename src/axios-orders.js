import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://my-burger-builder-5cbf8.firebaseio.com/'
})

export default instance;