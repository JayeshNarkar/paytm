import { useState, useEffect } from "react";
import { passwordAtom, usernameAtom } from "../atoms";
import axios from "axios";
import { useRecoilState } from "recoil";
import { isAuthenticatedAtom } from "../atoms";
import { redirect } from "react-router-dom";

export default function SignIn() {
  const [isAuthenticated, setIsAuthenticated] =
    useRecoilState(isAuthenticatedAtom);
  const [username, setUsername] = useRecoilState(usernameAtom);
  const [password, setPassword] = useRecoilState(passwordAtom);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "rgb(100, 116, 139)";
    return () => {
      document.body.style.backgroundColor = ""; // Reset color on component unmount
    };
  }, []);

  async function handleFormSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/v1/user/signin", {
        username,
        password,
      });
      console.log(response.data.message);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      setErrorMessage(null); // Clear any previous error messages
      redirect("/");
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response.data.error); // Set the error message
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
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
