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

import { getLoans, createLoan, updateLoan, deleteLoan } from "../api/loan";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editLoan, setEditLoan] = useState(null);
  const [form, setForm] = useState({
    date: "",
    personName: "",
    amount: 0,
    timePeriod: "",
    purpose: "",
    returnAmount: 0,
    returnDate: "",
    remarks: "",
    loanType: "taken",
    status: "active",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch all loans
  const fetchLoans = async () => {
    setLoading(true);
    try {
      const { data } = await getLoans();
      // Add dynamic remainingLoan
      const withRemaining = data.map((loan) => ({
        ...loan,
        remainingLoan:
          (Number(loan.amount) || 0) - (Number(loan.returnAmount) || 0),
      }));
      setLoans(withRemaining);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch loans");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Handle form submit (add/update)
  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        amount: form.amount ? parseFloat(form.amount) : 0, // ensure number
        returnAmount: form.returnAmount ? parseFloat(form.returnAmount) : 0, // null if empty
        returnDate:
          form.returnDate && !isNaN(new Date(form.returnDate).getTime())
            ? form.returnDate
            : null,
        date:
          form.date && !isNaN(new Date(form.date).getTime())
            ? form.date
            : new Date().toISOString().split("T")[0], // fallback to today
      };
      if (editLoan) {
        await updateLoan(editLoan.id, payload);
      } else {
        await createLoan(payload);
      }
      setOpenFormDialog(false);
      setForm({
        date: "",
        personName: "",
        amount: 0,
        timePeriod: "",
        purpose: "",
        returnAmount: "",
        returnDate: 0,
        remarks: "",
        loanType: "taken",
        status: "active",
      });
      setEditLoan(null);
      fetchLoans();
    } catch (err) {
      console.error(err);
      alert("Failed to save loan");
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    try {
      await deleteLoan(deleteId);
      setOpenDeleteDialog(false);
      setDeleteId(null);
      fetchLoans();
    } catch (err) {
      console.error(err);
      alert("Failed to delete loan");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "personName", headerName: "Person Name", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "timePeriod", headerName: "Time Period", flex: 1 },
    { field: "purpose", headerName: "Purpose", flex: 1 },
    { field: "returnAmount", headerName: "Return Amount", flex: 1 },
    { field: "returnDate", headerName: "Return Date", flex: 1 },
    { field: "remarks", headerName: "Remarks", flex: 1 },
    { field: "loanType", headerName: "Loan Type", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "remainingLoan",
      headerName: "Remaining Loan",
      flex: 1,
      renderCell: (params) => (
        <span>{Number(params.row.remainingLoan).toFixed(2)}</span>
      ),
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
              setEditLoan(params.row);
              setForm({
                date: params.row.date,
                personName: params.row.personName,
                amount: params.row.amount,
                timePeriod: params.row.timePeriod,
                purpose: params.row.purpose,
                returnAmount: params.row.returnAmount,
                returnDate: params.row.returnDate,
                remarks: params.row.remarks,
                loanType: params.row.loanType,
                status: params.row.status,
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
    <Box sx={{ height: 600, width: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Loans</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditLoan(null); // clear edit mode
            setForm({
              date: "",
              personName: "",
              amount: 0,
              timePeriod: "",
              purpose: "",
              returnAmount: 0,
              returnDate: "",
              remarks: "",
              loanType: "taken",
              status: "active",
            }); // reset form
            setOpenFormDialog(true);
          }}
        >
          Add Loan
        </Button>
      </Box>

      {/* Table */}
      <DataGrid
        rows={loans}
        columns={columns}
        pageSize={5}
        loading={loading}
        disableSelectionOnClick
        autoHeight
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
        <DialogTitle>{editLoan ? "Edit Loan" : "Add New Loan"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Person Name"
            fullWidth
            value={form.personName}
            onChange={(e) => setForm({ ...form, personName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Time Period"
            fullWidth
            value={form.timePeriod}
            onChange={(e) => setForm({ ...form, timePeriod: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Purpose"
            fullWidth
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Return Amount"
            type="number"
            fullWidth
            value={form.returnAmount}
            onChange={(e) => setForm({ ...form, returnAmount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Return Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.returnDate}
            onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Remarks"
            fullWidth
            multiline
            rows={2}
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Loan Type"
            select
            fullWidth
            value={form.loanType}
            onChange={(e) => setForm({ ...form, loanType: e.target.value })}
          >
            <MenuItem value="taken">Taken</MenuItem>
            <MenuItem value="given">Given</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Status"
            select
            fullWidth
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFormDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editLoan ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Loan</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this loan? This action cannot be
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

export default Loans;
