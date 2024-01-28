import React from "react";
import { Link , useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthenticatedAtom } from "../atoms";

function Navbar() {
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between py-3 bg-gray-800 text-white border-b-2 border-black">
      <Link to="/" className="flex items-center">
        <img
          src="https://pwebassets.paytm.com/commonwebassets/paytmweb/header/images/logo.svg"
          alt="logo"
          className="h-10 w-auto mr-2"
        />
      </Link>
      <div className="flex items-center pr-2">
        {!isAuthenticated && (
          <div className="flex space-x-4">
            <Link
              to="/signup"
              className="bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded border-2 border-black"
            >
              Sign Up
            </Link>
            <Link
              to="/signin"
              className="bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded border-2 border-black"
            >
              Sign In
            </Link>
          </div>
        )}
        {isAuthenticated && (
          <button
            className="bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded border-2 border-black text"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/signin");
              window.location.reload();
            }}
          >
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
