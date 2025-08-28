import { useAuth } from "../context/AuthContext";
import { Typography, Container } from "@mui/material";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Use the button below to manage your master records.
        </Typography>
      </Container>
    </div>
  );
};

export default Home;
