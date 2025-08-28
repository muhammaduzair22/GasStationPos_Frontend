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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  getStations,
  createStation,
  updateStation,
  deleteStation,
} from "../api/stations";

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editStation, setEditStation] = useState(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
    gasRatePerKg: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch all stations
  const fetchStations = async () => {
    setLoading(true);
    try {
      const { data } = await getStations();
      setStations(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stations");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Handle form submit (add/update)
  const handleSubmit = async () => {
    try {
      if (editStation) {
        await updateStation(editStation.id, form);
      } else {
        await createStation(form);
      }
      setOpenFormDialog(false);
      setForm({ name: "", location: "", gasRatePerKg: "" });
      setEditStation(null);
      fetchStations();
    } catch (err) {
      console.error(err);
      alert("Failed to save station");
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      await deleteStation(deleteId);
      setOpenDeleteDialog(false);
      setDeleteId(null);
      fetchStations();
    } catch (err) {
      console.error(err);
      alert("Failed to delete station");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Station Name", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "gasRatePerKg", headerName: "GasRatePerKg (Rs)", flex: 1 },
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
              setEditStation(params.row);
              setForm({
                name: params.row.name,
                location: params.row.location,
                gasRatePerKg: params.row.gasRatePerKg,
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
        <Typography variant="h5">Stations</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenFormDialog(true)}
        >
          Add Station
        </Button>
      </Box>

      {/* Table */}
      <DataGrid
        rows={stations}
        columns={columns}
        pageSize={5}
        loading={loading}
        disableSelectionOnClick
        autoHeight
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
        <DialogTitle>
          {editStation ? "Edit Station" : "Add New Station"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Station Name"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <TextField
            margin="dense"
            label="gasRatePerKg"
            fullWidth
            value={form.gasRatePerKg}
            onChange={(e) => setForm({ ...form, gasRatePerKg: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editStation ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Station</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this station? This action cannot be
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

export default Stations;
