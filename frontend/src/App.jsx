import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { balanceAtom, isAuthenticatedAtom, usernameAtom } from "./atoms";

function App() {
  return (
    <RecoilRoot>
      <MainApp />
    </RecoilRoot>
  );
}

function MainApp() {
  const setUsername = useSetRecoilState(usernameAtom);
  const setBalance = useSetRecoilState(balanceAtom);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedAtom);
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
  useEffect(() => {
    try {
      localStorage.getItem("token");
      async function getProfile() {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localStorage.getItem("token")}`;
        const response = await axios.get("http://localhost:3000/api/v1/user/");
        const { username, balance } = response.data;
        setUsername(username);
        setBalance(balance);
        setIsAuthenticated(true);
      }
      getProfile();
    } catch (e) {
      console.log(e);
    }
  }, [isAuthenticated]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
