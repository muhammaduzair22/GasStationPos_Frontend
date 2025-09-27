import { useAuth } from "../context/AuthContext";
import { Typography, Container } from "@mui/material";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
      </Container>
      {user.role !== "manager" && <AnalyticsDashboard />}
    </div>
  );
};

export default Home;
