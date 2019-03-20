import axios from 'axios';

const instance = axios.create({
  baseURL: '----firebaseURL-----'
});

export default instance;