import { atom, selector } from "recoil";
import axios from "axios";

export const firstNameAtom = atom({
  key: "firstName",
  default: "",
});

export const lastNameAtom = atom({
  key: "lastName",
  default: "",
});

export const userProfileSelector = selector({
  key: "userProfile",
  get: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get("/api/v1/user/");
      const { username, balance } = response.data;
      return { username, balance };
    } catch (err) {
      localStorage.removeItem("token");
      console.log(err);
      return null;
    }
  },
});

export const usernameAtom = atom({
  key: "username",
  default: "",
});

export const passwordAtom = atom({
  key: "password",
  default: "",
});

export const isAuthenticatedAtom = atom({
  key: "isAuthenticated",
  default: selector({
    key: "isAuthenticatedDefault",
    get: ({ get }) => {
      const userProfile = get(userProfileSelector);
      return userProfile !== null;
    },
  }),
});

export const balanceAtom = atom({
  key: "balance",
  default: selector({
    key: "balanceDefault",
    get: ({ get }) => {
      const userProfile = get(userProfileSelector);
      return userProfile ? userProfile.balance : 0;
    },
  }),
});

export const usersSelector = selector({
  key: "users",
  get: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return [];
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get("/api/v1/user/users");
    return response.data.users;
  },
});

export const myRequestsSelector = selector({
  key: "myRequests",
  get: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return [];
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get("/api/v1/account/myRequests");
    return response.data.requests;
  },
});
