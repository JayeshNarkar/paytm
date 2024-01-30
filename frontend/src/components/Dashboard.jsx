import { useRecoilValue } from "recoil";
import {
  balanceAtom,
  isAuthenticatedAtom,
  myRequestsSelector,
  usernameAtom,
  usersSelector,
} from "../atoms";
import { Navigate } from "react-router-dom";
import { BusinessCard } from "./BusinessCard";
import { RequestPopup } from "./requestPopup";

export default function Dashboard() {
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  const users = useRecoilValue(usersSelector);
  const balance = useRecoilValue(balanceAtom);
  const username = useRecoilValue(usernameAtom);
  const myRequests = useRecoilValue(myRequestsSelector);
  const pendingRequests = myRequests.filter(
    (request) => request.status === "pending"
  );
  console.log(myRequests);

  return (
    <>
      {pendingRequests &&
        pendingRequests.map((myRequest) => (
          <RequestPopup
            key={myRequest._id}
            from={myRequest.from}
            amount={myRequest.amount}
            id={myRequest._id}
          />
        ))}
      <div>
        <div className="flex justify-between px-3 text-xl bg-slate-500 py-2 border-b-2 border-black">
          <div>
            <h1 className="mr-3">
              Welcome, <strong>{username}</strong>
            </h1>
          </div>
          <div>
            <h1>
              Your Balance: <strong>{balance}</strong>
            </h1>
          </div>
        </div>
        <div className="gap-4 grid p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {users &&
            users.map((user) => <BusinessCard user={user} key={user._id} />)}
        </div>
      </div>
    </>
  );
}
