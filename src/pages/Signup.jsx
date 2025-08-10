import { useState, useEffect } from "react";
import { signup } from "../api/auth";
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
} from "@mui/material";

const Signup = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      alert("Signup successful");
      navigate("/login"); // redirect after signup
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
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
              />
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
