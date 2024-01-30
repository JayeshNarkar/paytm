import { useNavigate, useParams } from "react-router-dom";
import { balanceAtom, isAuthenticatedAtom, usersSelector } from "../atoms";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { useEffect, useState } from "react";
import axios from "axios";

export function SendMoney() {
  const navigate = useNavigate();
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);
  const { id } = useParams();
  useEffect(() => {
    document.body.style.backgroundColor = "rgb(139 144 153)";
    return () => {
      document.body.style.backgroundColor = ""; // Reset color on component unmount
    };
  }, []);
  if (id === undefined) return <div>Incorrect parameters</div>;
  const usersLoadable = useRecoilValueLoadable(usersSelector);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(null);
  const [balance, setBalance] = useRecoilState(balanceAtom);
  const [successMessage, setSuccessMessage] = useState(null);
  if (usersLoadable.state === "loading") {
    return <div>Loading...</div>;
  } else if (usersLoadable.state === "hasError") {
    return <div>Error: {usersLoadable.contents}</div>;
  } else {
    const users = usersLoadable.contents;
    console.log(users);
    const user = users.find((user) => user._id === id);
    if (!user) return <div>User not found</div>;
    const toUser = user.username;
    console.log(toUser);
    async function handleFormSubmit(e) {
      e.preventDefault();
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/account/transfer",
          {
            to: id,
            amount: amount,
          }
        );
        console.log(response.data);
        setSuccessMessage(response.data.message);
        setErrorMessage(null);
      } catch (error) {
        console.log(error.response.data);
        setSuccessMessage(null);
        setErrorMessage(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }

    return (
      <>
        <h1 className="text-xl text-black px-2 pt-2">
          Current Balance: <strong>{balance}</strong>
        </h1>
        <div className="flex items-center justify-center p-4 ">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-8 rounded-md shadow-md w-full max-w-md border-2 border-black "
          >
            <div className="mb-4">
              <label className="block mb-2 md:text-2xl font-bold">
                Send money to <strong>{toUser}</strong>:
              </label>
              <input
                name="amount"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder={"Amount to send"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              type="submit"
              name="submit"
              className="w-full bg-blue-600 py-2 mt-2 px-4 text-2xl text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </>
    );
  }
}
