import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Typography,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { getUsers, createUser, updateUser, deleteUser } from "../api/users";
import { getStations } from "../api/stations";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editManager, setEditManager] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    stationId: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch all managers
  const fetchManagers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      // filter only managers
      const onlyManagers = data.filter((u) => u.role === "manager");
      setManagers(onlyManagers);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch managers");
    }
    setLoading(false);
  };

  // Fetch stations for dropdown
  const fetchStations = async () => {
    try {
      const { data } = await getStations();
      setStations(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stations");
    }
  };

  useEffect(() => {
    fetchManagers();
    fetchStations();
  }, []);

  // Handle form submit (add/update)
  const handleSubmit = async () => {
    try {
      if (editManager) {
        await updateUser(editManager.id, form);
      } else {
        await createUser({ ...form, role: "manager" }); // enforce role manager
      }
      setOpenFormDialog(false);
      setForm({ username: "", password: "", stationId: "" });
      setEditManager(null);
      fetchManagers();
    } catch (err) {
      console.error(err);
      alert("Failed to save manager");
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(deleteId);
      setOpenDeleteDialog(false);
      setDeleteId(null);
      fetchManagers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete manager");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "username", headerName: "Username", flex: 1 },
    {
      field: "stationId",
      headerName: "Station",
      flex: 1,
      renderCell: (params) => {
        const station = stations.find((s) => s.id === params.row.stationId);
        return station ? station.name : "-";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => {
              setEditManager(params.row);
              setForm({
                username: params.row.username,
                password: "", // empty on edit
                stationId: params.row.stationId || "",
              });
              setOpenFormDialog(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              setDeleteId(params.row.id);
              setOpenDeleteDialog(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Managers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenFormDialog(true)}
        >
          Add Manager
        </Button>
      </Box>

      {/* Table */}
      <DataGrid
        rows={managers}
        columns={columns}
        pageSize={5}
        loading={loading}
        disableSelectionOnClick
        autoHeight
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
        <DialogTitle>
          {editManager ? "Edit Manager" : "Add New Manager"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          {!editManager && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
          <TextField
            margin="dense"
            select
            label="Station"
            fullWidth
            value={form.stationId}
            onChange={(e) => setForm({ ...form, stationId: e.target.value })}
          >
            {stations.map((station) => (
              <MenuItem key={station.id} value={station.id}>
                {station.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editManager ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Manager</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this manager? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Managers;
