import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import FeedIcon from "@mui/icons-material/Feed";
import TableChartIcon from "@mui/icons-material/TableChart";
import StoreIcon from "@mui/icons-material/Store";
import PeopleIcon from "@mui/icons-material/People";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Menu items
  const menuItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    {
      label: "Daily Details Form",
      path: "/dailydetail",
      icon: <FeedIcon />,
    },
  ];

  if (user?.role === "admin") {
    menuItems.push({
      label: "Master Records",
      path: "/masterrecord",
      icon: <TableChartIcon />,
    });
    menuItems.push({
      label: "Stations",
      path: "/stations",
      icon: <StoreIcon />,
    });
    menuItems.push({
      label: "Managers",
      path: "/managers",
      icon: <PeopleIcon />,
    });
    menuItems.push({
      label: "Monthly Summary",
      path: "/summary",
      icon: <SummarizeIcon />,
    });
  } else if (user?.role === "partner") {
    menuItems.push({
      label: "Master Records",
      path: "/masterrecord",
      icon: <TableChartIcon />,
    });
  }

  return (
    <div>
      {/* AppBar */}
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left side - Hamburger + Company Name */}
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Shalimar Energies
            </Typography>
          </Box>

          {/* Right side - User info + Logout */}
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

      {/* Drawer Menu */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Main content */}
      <Box sx={{ mt: 5, px: 3 }}>
        <Outlet />
      </Box>
    </div>
  );
};

export default Layout;
