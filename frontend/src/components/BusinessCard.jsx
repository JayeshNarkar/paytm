import { Link } from "react-router-dom";
import { capitalize } from "../../basic_functions";

export function BusinessCard({ user }) {
  const { username, firstName, lastName, _id } = user;
  return (
    <div className="bg-white p-4 rounded-md shadow-md border-2 border-black">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{username}</h1>

        <Link
          to={`/sendMoney/${_id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
        >
          Send Money
        </Link>
      </div>
      <div className="flex justify-between">
        <p>{capitalize(firstName) + " " + capitalize(lastName)}</p>
        <Link
          to={`/sendRequest/${_id}`}
          className="bg-gray-500 hover:bg-gray-700 text-black font-bold py-2 px-4 rounded"
        >
          Request Money
        </Link>
      </div>
    </div>
  );
}
