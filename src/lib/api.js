import axios from "axios";
import store from "../plugins/store";

const BASE_URL = "https://log.bula21.ch";

export class ApiError extends Error {
  constructor(axiosError, ...params) {
    // noinspection JSCheckFunctionSignatures
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = "ApiError";

    this.statusCode = null;
    this.statusText = null;
    if (axiosError.response) {
      const resp = axiosError.response;

      this.statusCode = resp.request.status;
      this.statusText = resp.request.statusText;
      this.message = resp.data.error.message;
    } else if (axiosError.request) {
      this.message = "Konnte den Server nicht erreichen";
    } else {
      this.message = "Unbekannter Fehler";
    }
  }

  userMessage() {
    if (this.statusCode === null) {
      return this.message;
    }
    return `${this.statusCode} ${this.statusText} - ${this.message}`;
  }
}

export const api = axios.create({
  baseURL: `${BASE_URL}/_/`,
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/authenticate", {
      email: email,
      password: password,
      mode: "jwt",
    });
    const userData = response.data.data.user;
    userData["_token"] = response.data.data.token;
    store.commit("loginSucceeded", userData);
  } catch (err) {
    store.commit("loginFailed");
    throw new ApiError(err);
  }
};

export const refreshTokenPeriodic = async () => {
  setTimeout(refreshTokenPeriodic, 1000 * 60 * 5);

  if (store.state.user === null) {
    return;
  }

  const response = await api.post("/auth/refresh", {
    token: store.state.user._token,
  });
  store.commit("updateToken", response.data.data.token);
};
setTimeout(refreshTokenPeriodic, 1000 * 60 * 5);

export const apiAuthenticated = async (path, query = null) => {
  const config = {
    headers: {
      Authorization: `bearer ${store.state.user._token}`,
    },
  };

  if (query !== null) {
    config.params = query;
  }

  try {
    const resp = await api.get(path, config);
    return resp.data.data;
  } catch (err) {
    throw new ApiError(err);
  }
};

// https://docs.directus.io/reference/api/query/#filter
export const filter = (fieldName, op, value) => {
  if (Array.isArray(value)) {
    value = value.join(",");
  }
  return {
    [`filter[${fieldName}][${op}]`]: value,
  };
};

// https://docs.directus.io/reference/api/query/#limit
export const limit = (value) => {
  return { limit: value };
};

// https://docs.directus.io/reference/api/items/#create-an-item
export const apiAuthCreate = async (path, item) => {
  const config = {
    headers: {
      Authorization: `bearer ${store.state.user._token}`,
    },
  };
  try {
    const resp = await api.post(path, item, config);
    return resp.data.data;
  } catch (err) {
    throw new ApiError(err);
  }
};

export const directusAdminLink = (item, id) =>
  `${BASE_URL}/admin/#/_/collections/${item}/${id}`;
