import Axios from 'axios';

let baseurl = process.env.NODE_ENV === 'production' ? 'https://www.yansk.cn' : 'http://192.168.199.147:3000';
Axios.defaults.baseURL = baseurl;

export function fetch(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        resolve(response.data);
      })
  })
}