import { Link } from "react-router-dom";
import { capitalize } from "../../basic_functions";

export function BusinessCard({ user }) {
  const { username, firstName, lastName, _id } = user;
  return (
    <div className="bg-white p-4 rounded-md shadow-md border-2 border-black">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{username}</h1>

        <Link
          to={`/send/${_id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send Money
        </Link>
      </div>
      <p>{capitalize(firstName) + " " + capitalize(lastName)}</p>
    </div>
  );
}
