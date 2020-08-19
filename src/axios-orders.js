import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-fc2ad.firebaseio.com/'
});

export default instance;