import { useRecoilState } from "recoil";
import {
  firstNameAtom,
  isAuthenticatedAtom,
  lastNameAtom,
  passwordAtom,
  usernameAtom,
} from "../atoms";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect } from "react-router-dom";

export default function SignUp() {
  useEffect(() => {
    document.body.style.backgroundColor = "rgb(100, 116, 139)";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useRecoilState(usernameAtom);
  const [password, setPassword] = useRecoilState(passwordAtom);
  const [firstName, setFirstName] = useRecoilState(firstNameAtom);
  const [lastName, setLastName] = useRecoilState(lastNameAtom);
  const [isAuthenticated, setIsAuthenticated] =
    useRecoilState(isAuthenticatedAtom);

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("/api/v1/user/signup", {
        username,
        password,
        firstName,
        lastName,
      });
      console.log(response.data.message);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      setErrorMessage(null);
    } catch (error) {
      console.log(error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center bg-slate-500 p-4">
      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-md border-2 border-black"
      >
        <div className="mb-4">
          <label className="block mb-2 md:text-2xl font-bold">Username:</label>
          <input
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            placeholder={"johndoe123"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 md:text-2xl font-bold">
            First Name:
          </label>
          <input
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            placeholder={"John"}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 md:text-2xl font-bold">Last Name:</label>
          <input
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            placeholder={"Doe"}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 md:text-2xl font-bold">Password:</label>
          <input
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            type="password"
            placeholder={"********"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 py-2 mt-2 px-4 text-2xl text-white rounded-md"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
