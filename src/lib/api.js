import axios from 'axios';
import store from '../plugins/store'

const BASE_URL = "https://log.bula21.ch/_/";

export const api = axios.create({
  baseURL: BASE_URL,
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/authenticate", {
      "email": email,
      "password": password,
      "mode": "jwt"
    });
    const userData = response.data.data.user;
    userData['_token'] = response.data.data.token;
    store.commit('loginSucceeded', userData);
  } catch (err) {
    store.commit('loginFailed');
    if (err.response) {
      const resp = err.response;
      throw `${resp.request.status}: ${err.response.data.error.message}`;
    } else if (err.request) {
      throw 'Konnte den Server nicht erreichen';
    } else {
      throw 'Unbekannter Fehler';
    }
  }
}

export const apiAuthenticated = async (path) => {
  const config = {
    headers: {
      Authorization: `bearer ${store.state.user._token}`
    }
  };
  // TODO handle expired tokens
  const resp = await api.get(path, config);
  return resp.data.data;
}
