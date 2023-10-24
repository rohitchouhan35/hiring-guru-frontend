import axios from 'axios';

// const API_BASE_URL = 'https://alphatech-server-qu3rhtmvnq-el.a.run.app';
const API_BASE_URL = 'http://localhost:3512';
const API_V1_BASE = `${API_BASE_URL}/api/v1`;
const USER_API_BASE = `${API_BASE_URL}/user`;
const PUBLIC_API_BASE = `${API_BASE_URL}/public`;
const AUTH_API_BASE = `${API_BASE_URL}/auth`;

const URLS = {
  home: API_BASE_URL,
  employeeSearch: `${API_V1_BASE}/employee/search`,
  createEmployee: `${API_V1_BASE}/employee`,
  userLogin: `${USER_API_BASE}/login`,
  masterData: `${API_BASE_URL}/api/empmaster`,
  authenticate: `${AUTH_API_BASE}/authenticate`,
  signup: `${AUTH_API_BASE}/signup`,
  upload: `${API_BASE_URL}/upload`,
  numberOfUsers: `${PUBLIC_API_BASE}/numberOfUsers`,
  isTokenValid: `${AUTH_API_BASE}/is-token-valid`,
  me: `${API_BASE_URL}/api/users/me`,
};

class HmeApis {

  static home(config) {
    return axios.get(URLS.home, config);
  }

  static isTokenValid(accessToken) {
    return axios.post(URLS.isTokenValid, accessToken);
  }

  static signup(user) {
    return axios.post(URLS.signup, user);
  }

  static authenticate(user) {
    return axios.post(URLS.authenticate, user);
  }

  static me(config) {
    return axios.get(URLS.me, config);
  }

  static sendEmail() {
    return true;
  }

  static numberOfUsers() {
    return axios.get(URLS.numberOfUsers);
  }

  static getAllEmpStatuses(config) {
    return axios.get(URLS.masterData, config);
  }

  static search(searchParameter, config) {
    return axios.post(URLS.employeeSearch, searchParameter, config);
  }

  static createEmployee(employeeInfo, config) {
    return axios.post(URLS.createEmployee, employeeInfo, config);
  }

  static login(user) {
    return axios.post(URLS.userLogin, user);
  }

  static uploadImage(image) {
    return null;
  }

}

export default HmeApis;
