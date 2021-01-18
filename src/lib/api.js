import axios from "axios";
import store from "../plugins/store";

const BASE_URL = "https://log.bula21.ch/_/";

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
  baseURL: BASE_URL,
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
  } else {
    config.params = { limit: -1 };
  }

  try {
    const resp = await api.get(path, config);
    return resp.data.data;
  } catch (err) {
    throw new ApiError(err);
  }
};

// https://docs.directus.io/api/query/filter.html
export const filter = (fieldName, op, value) => {
  if (Array.isArray(value)) {
    value = value.join(",");
  }
  return {
    [`filter[${fieldName}][${op}]`]: value,
  };
};
