import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-18082.firebaseio.com/'
});

export default instance;