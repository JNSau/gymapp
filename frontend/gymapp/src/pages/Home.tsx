import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to Gymersive! 💪</h1>
      {user ? (
        <p>Good to see you again, <strong>{user.username}</strong>. Ready for your workout?</p>
      ) : (
        <p>Log in to start building your training plan.</p>
      )}
    </div>
  );
};

export default Home;