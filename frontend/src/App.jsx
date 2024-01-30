import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { balanceAtom, userProfileSelector, usernameAtom } from "./atoms";
import { SendMoney } from "./components/sendMoney";
import { SendRequest } from "./components/sendRequest";

function App() {
  return (
    <RecoilRoot>
      <MainApp />
    </RecoilRoot>
  );
}

function RedirectToRoot() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
}

function MainApp() {
  const userProfile = useRecoilValue(userProfileSelector);
  const setUsername = useSetRecoilState(usernameAtom);
  const setBalance = useSetRecoilState(balanceAtom);

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username);
      setBalance(userProfile.balance);
    }
  }, [userProfile]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/sendMoney/:id" element={<SendMoney />} />
        <Route path="/sendRequest/:id" element={<SendRequest />} />
        <Route path="*" element={<RedirectToRoot />} />
      </Routes>
    </>
  );
}

export default App;
