import axios from 'axios';

class Signal {

  static saveOffer(offer) {
    return axios.post('http://localhost:8080/save-offer', offer);
  }

  static getOffer(key) {
    const modUrl = "http://localhost:8080/get-offer?sessionStorageId=" + key;
    return axios.get(modUrl);
  }

  static saveAnswer(answer) {
    return axios.post('http://localhost:8080/save-answer', answer);
  }

  static getAnswer(key) {
    const modUrl = "http://localhost:8080/get-answer?sessionStorageId=" + key;
    return axios.get(modUrl);
  }

}

export default Signal