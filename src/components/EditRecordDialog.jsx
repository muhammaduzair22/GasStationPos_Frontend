import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const EditRecordDialog = ({ open, onClose, record, onChange, onSave }) => {
  if (!record) return null;

  const fields = [
    { name: "ww_bill_code", label: "WW Bill" },
    { name: "invoice_no", label: "Invoice No" },
    { name: "bill_detail", label: "Bill Detail" },
    { name: "customer_name", label: "Customer Name" },
    { name: "head_of_account", label: "Head of Account" },
    { name: "sanctioned_amount", label: "Sanctioned Amount" },
    { name: "cheque_number", label: "Cheque Number" },
    { name: "cheque_amount", label: "Cheque Amount" },
    { name: "cash_value", label: "Cash Value" },
    { name: "profit", label: "Profit" },
    { name: "total_expenses", label: "Total Expenses" },
    { name: "income_tax_hardware", label: "Income Tax Hardware" },
    { name: "income_tax_service", label: "Income Tax Service" },
    { name: "sales_tax_gst_18", label: "GST @18%" },
    { name: "sales_tax_sst_16", label: "SST @16%" },
    { name: "one_fifth_gst", label: "1/5 GST" },
    { name: "date_of_bill", label: "Date of Bill", type: "date" },
    { name: "date_of_printing", label: "Date of Printing", type: "date" },
    { name: "received_date", label: "Received Date", type: "date" },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Record</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {fields.map(({ name, label, type }) => (
            <Grid item xs={6} key={name}>
              <TextField
                fullWidth
                label={label}
                type={type || "text"}
                InputLabelProps={type === "date" ? { shrink: true } : {}}
                value={record[name] || ""}
                onChange={(e) => onChange(name, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRecordDialog;
