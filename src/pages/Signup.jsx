import { useState, useEffect } from "react";
import { signup } from "../api/auth";
import { getStations } from "../api/stations";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  MenuItem,
} from "@mui/material";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "manager", // default role
    stationId: null,
  });

  const [stations, setStations] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");

    // Fetch stations for dropdown
    const fetchStations = async () => {
      try {
        const { data } = await getStations();
        setStations(data);
      } catch (err) {
        console.error("Failed to fetch stations", err);
      }
    };
    fetchStations();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: form.username,
        password: form.password,
        role: form.role,
        stationId: form.role === "manager" ? form.stationId : null,
      };

      await signup(payload);
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Create an Account
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              {/* Role Dropdown */}
              <TextField
                select
                label="Role"
                variant="outlined"
                fullWidth
                margin="normal"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value, stationId: null })
                }
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="partner">Partner</MenuItem>
              </TextField>

              {/* Station Dropdown (only for managers) */}
              {form.role === "manager" && (
                <TextField
                  select
                  label="Station"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={form.stationId || ""}
                  onChange={(e) =>
                    setForm({ ...form, stationId: Number(e.target.value) })
                  }
                >
                  {stations.map((station) => (
                    <MenuItem key={station.id} value={station.id}>
                      {station.name} - {station.location}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <Stack spacing={2} mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Sign Up
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Signup;
