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

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api/employee";
import { getStations } from "../api/stations";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [form, setForm] = useState({
    name: "",
    contactNumber: "",
    address: "",
    monthlySalary: "",
    currentAdvanceAmount: "",
    advanceDate: "",
    totalLoanAmount: "",
    remainingLoanAmount: "",
    monthlyInstallmentAmount: "",
    loanStartDate: "",
    loanEndDate: "",
    stationId: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch all employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch employees");
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
    fetchEmployees();
    fetchStations();
  }, []);

  // Handle form submit (add/update)
  const handleSubmit = async () => {
    try {
      if (editEmployee) {
        await updateEmployee(editEmployee.id, form);
      } else {
        await createEmployee(form);
      }
      setOpenFormDialog(false);
      setForm({
        name: "",
        contactNumber: "",
        address: "",
        monthlySalary: "",
        currentAdvanceAmount: "",
        advanceDate: "",
        totalLoanAmount: "",
        remainingLoanAmount: "",
        monthlyInstallmentAmount: "",
        loanStartDate: "",
        loanEndDate: "",
        stationId: "",
      });
      setEditEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to save employee");
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      await deleteEmployee(deleteId);
      setOpenDeleteDialog(false);
      setDeleteId(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "contactNumber", headerName: "Contact", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "monthlySalary", headerName: "Salary", flex: 1 },
    { field: "currentAdvanceAmount", headerName: "Advance", flex: 1 },
    { field: "totalLoanAmount", headerName: "Total Loan", flex: 1 },
    { field: "remainingLoanAmount", headerName: "Remaining Loan", flex: 1 },
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
              setEditEmployee(params.row);
              setForm({
                ...params.row,
                advanceDate: params.row.advanceDate || "",
                loanStartDate: params.row.loanStartDate || "",
                loanEndDate: params.row.loanEndDate || "",
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
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Employees</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditEmployee(null);
            setOpenFormDialog(true);
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* Table */}
      <DataGrid
        rows={employees}
        columns={columns}
        pageSize={5}
        loading={loading}
        disableSelectionOnClick
        autoHeight
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
        <DialogTitle>
          {editEmployee ? "Edit Employee" : "Add New Employee"}
        </DialogTitle>
        <DialogContent>
          {[
            "name",
            "contactNumber",
            "address",
            "monthlySalary",
            "currentAdvanceAmount",
            "totalLoanAmount",
            "remainingLoanAmount",
            "monthlyInstallmentAmount",
          ].map((field) => (
            <TextField
              key={field}
              margin="dense"
              label={field.replace(/([A-Z])/g, " $1")}
              fullWidth
              type={
                [
                  "monthlySalary",
                  "currentAdvanceAmount",
                  "totalLoanAmount",
                  "remainingLoanAmount",
                  "monthlyInstallmentAmount",
                  "contactNumber",
                ].includes(field)
                  ? "number" // numeric fields
                  : "text" // everything else
              }
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
          <TextField
            margin="dense"
            label="Advance Date"
            type="date"
            fullWidth
            value={form.advanceDate || ""}
            onChange={(e) => setForm({ ...form, advanceDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Loan Start Date"
            type="date"
            fullWidth
            value={form.loanStartDate || ""}
            onChange={(e) =>
              setForm({ ...form, loanStartDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Loan End Date"
            type="date"
            fullWidth
            value={form.loanEndDate || ""}
            onChange={(e) => setForm({ ...form, loanEndDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

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
            {editEmployee ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this employee? This action cannot be
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

export default Employees;
