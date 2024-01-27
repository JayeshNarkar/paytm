import { useRecoilValue } from "recoil";
import { isAuthenticatedAtom } from "../atoms";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const isAuthenticated = useRecoilValue(isAuthenticatedAtom);
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
