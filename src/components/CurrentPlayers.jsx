import UserCard from "./UserCard";


export default function CurrentPlayers({ users }) {
  return (
    <div>
      {users.map((user, index) => (
        <UserCard key={index} user={user} classNames="my-2" />
      ))}
    </div>
  );
}
