import { useAuth } from "../context/AuthContext";
import MasterRecords from "./MasterRecords";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            Master Records
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">
              Logged in as <strong>{user?.username}</strong>
            </Typography>
            <Button
              color="inherit"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{ color: "white", borderColor: "white" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box p={3}>
        <MasterRecords />
      </Box>
    </div>
  );
};

export default Home;
