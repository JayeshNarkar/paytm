import { atom } from "recoil";

export const usernameAtom = atom({
  key: "username",
  default: "",
});

export const firstNameAtom = atom({
  key: "firstName",
  default: "",
});

export const lastNameAtom = atom({
  key: "lastName",
  default: "",
});

export const passwordAtom = atom({
  key: "password",
  default: "",
});

export const isAuthenticatedAtom = atom({
  key: "isAuthenticated",
  default: false,
});

export const balanceAtom = atom({
  key: "balance",
  default: 0,
});
