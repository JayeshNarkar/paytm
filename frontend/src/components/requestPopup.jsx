import { useState } from "react";
import Popup from "reactjs-popup";
import { balanceAtom, usersSelector } from "../atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { capitalize } from "../../basic_functions";
import axios from "axios";

export function RequestPopup({ from, amount, id }) {
  const [showPopup, setShowPopup] = useState(true);
  const users = useRecoilValue(usersSelector);
  const fromUser = users.find((user) => user._id === from);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const setBalance = useSetRecoilState(balanceAtom);
  if (!fromUser) return null;
  const fullName =
    capitalize(fromUser.firstName) + " " + capitalize(fromUser.lastName);

  async function acceptRequestHandler() {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/v1/account/acceptRequest", {
        requestId: id,
        from,
        amount: amount,
      });
      console.log(response.data);
      setBalance(response.data.balance);
      setSuccessMessage(response.data.message);
      setErrorMessage(null);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowPopup(false);
    } catch (error) {
      console.log(error.response.data);
      setSuccessMessage(null);
      setErrorMessage(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  function denyRequestHandler() {}

  return (
    <Popup
      open={showPopup}
      closeOnDocumentClick={!isLoading}
      onClose={() => {
        if (!isLoading) {
          setShowPopup(false);
        }
      }}
      overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white border-2 border-black rounded-md p-4 text-3xl text-center">
        <div className="font-bold">Requested by:</div>
        <br />
        <div className="font-bold">{fullName}</div>
        <div>@{fromUser.username}</div>
        <br />
        <div>
          amount: <strong>{amount}</strong>
        </div>
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        {successMessage && (
          <div className="text-green-500">{successMessage}</div>
        )}
        <button
          className="bg-green-500 hover:bg-green-700 border-2 border-black rounded-md m-2 p-2"
          onClick={acceptRequestHandler}
          disabled={isLoading}
        >
          Accept
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 border-2 border-black rounded-md m-2 p-2"
          onClick={denyRequestHandler}
          disabled={isLoading}
        >
          Deny
        </button>
        <div>
          <button
            className="text-gray-500 hover:text-gray-700 hover:underline"
            onClick={() => setShowPopup(false)}
            disabled={isLoading}
          >
            Later
          </button>
        </div>
      </div>
    </Popup>
  );
}
