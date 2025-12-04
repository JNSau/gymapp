import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="container" style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Witaj w Gymersive! 💪</h1>
      {user ? (
        <p>Widzimy się znowu <strong>{user.username}</strong>. Gotowy na trening?</p>
      ) : (
        <p>Zaloguj się, aby zacząć układać plan.</p>
      )}
    </div>
  );
};

export default Home;