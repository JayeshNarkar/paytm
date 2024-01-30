import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { balanceAtom, usersSelector } from "../atoms";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import axios from "axios";

export function SendRequest() {
  useEffect(() => {
    document.body.style.backgroundColor = "rgb(139 144 153)";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  if (id === undefined) navigate("/");
  const balance = useRecoilValue(balanceAtom);
  const [errorMessage, setErrorMessage] = useState(null);
  const [amount, setAmount] = useState(undefined);
  const usersLoadable = useRecoilValueLoadable(usersSelector);
  const [successMessage, setSuccessMessage] = useState(null);
  if (usersLoadable.state === "loading") {
    return <div>Loading...</div>;
  } else if (usersLoadable.state === "hasError") {
    return <div>Error: {usersLoadable.contents}</div>;
  } else {
    const users = usersLoadable.contents;
    const user = users.find((user) => user._id === id);
    if (!user) return <div>User not found</div>;
    const toUser = user.username;

    async function handleFormSubmit(e) {
      e.preventDefault();
      setIsLoading(true);
      console.log("id:", id);
      console.log("amount:", amount);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/account/sendRequest",
          {
            to: id,
            amount: amount,
          }
        );
        console.log(response.data);
        setErrorMessage(null);
        setSuccessMessage(response.data.message);
      } catch (error) {
        console.log(error);
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
                Request money from <strong>{toUser}</strong>:
              </label>
              <input
                name="amount"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder={"Amount to Request"}
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
