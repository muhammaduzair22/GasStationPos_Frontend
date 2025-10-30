import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableHead,
  IconButton,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

// inline component, same file
function EditRecordDialog({
  open,
  onClose,
  record,
  onChange,
  onSave,
  stations,
}) {
  const handleFieldChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  // update one expenditure row
  const handleExpenditureChange = (index, field, value) => {
    const newExps = [...(record.Expenditures || [])];
    newExps[index] = { ...newExps[index], [field]: value };
    onChange("Expenditures", newExps);
  };

  // add a new expenditure row
  const handleAddExpenditure = () => {
    const newExps = [
      ...(record.Expenditures || []),
      { description: "", category: "", amount: "" },
    ];
    onChange("Expenditures", newExps);
  };

  // remove a row
  const handleRemoveExpenditure = (index) => {
    const newExps = [...(record.Expenditures || [])];
    newExps.splice(index, 1);
    onChange("Expenditures", newExps);
  };

  // update one nozzle reading row
  const handleNozzleChange = (index, field, value) => {
    const newNozzles = [...(record.NozzleReadings || [])];
    newNozzles[index] = { ...newNozzles[index], [field]: value };
    onChange("NozzleReadings", newNozzles);
  };

  // add a new nozzle reading row
  const handleAddNozzle = () => {
    const newNozzles = [
      ...(record.NozzleReadings || []),
      {
        nozzleNumber: "",
        openingGirary: "",
        closingGirary: "",
        openingScreen: "",
        closingScreen: "",
      },
    ];
    onChange("NozzleReadings", newNozzles);
  };

  // remove a nozzle row
  const handleRemoveNozzle = (index) => {
    const newNozzles = [...(record.NozzleReadings || [])];
    newNozzles.splice(index, 1);
    onChange("NozzleReadings", newNozzles);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Master Record</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Date */}
          <Grid item xs={6}>
            <TextField
              label="Date"
              type="date"
              value={record.date || ""}
              onChange={handleFieldChange("date")}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>

          {/* Station */}
          <Grid item xs={6}>
            <TextField
              select
              label="Station"
              value={record.stationId || ""}
              onChange={handleFieldChange("stationId")}
              fullWidth
            >
              {stations.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Sales Fields */}
          <Grid item xs={6}>
            <TextField
              label="Total Sale (Kgs)"
              type="number"
              value={record.totalSaleKgs || ""}
              onChange={handleFieldChange("totalSaleKgs")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Total CNG Sale"
              type="number"
              value={record.totalCngSale || ""}
              onChange={handleFieldChange("totalCngSale")}
              fullWidth
            />
          </Grid>

          {/* Revenue & Expenditure */}
          <Grid item xs={6}>
            <TextField
              label="Other Revenue / Loan Return"
              type="number"
              value={record.otherRevenueLoanReturn || ""}
              onChange={handleFieldChange("otherRevenueLoanReturn")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Kitchen Expenses"
              type="number"
              value={record.kitchenExpensesAmount || ""}
              onChange={handleFieldChange("kitchenExpensesAmount")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="General Expenses"
              type="number"
              value={record.generalExpensesAmount || ""}
              onChange={handleFieldChange("generalExpensesAmount")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Diesel/Lube/Compressor"
              type="number"
              value={record.generatorCompressorDieselLubeAmount || ""}
              onChange={handleFieldChange(
                "generatorCompressorDieselLubeAmount"
              )}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Salary/Advance/Net Pay"
              type="number"
              value={record.salaryAdvanceNetPay || ""}
              onChange={handleFieldChange("salaryAdvanceNetPay")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Loan Repayment / Other Payments"
              type="number"
              value={record.loanRepaymentOtherPayments || ""}
              onChange={handleFieldChange("loanRepaymentOtherPayments")}
              fullWidth
            />
          </Grid>

          {/* Totals */}
          <Grid item xs={6}>
            <TextField
              label="Total Daily Expenditure"
              type="number"
              value={record.totalDailyExpenditure || ""}
              onChange={handleFieldChange("totalDailyExpenditure")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Net Sale"
              type="number"
              value={record.netSale || ""}
              onChange={handleFieldChange("netSale")}
              fullWidth
            />
          </Grid>

          {/* Remarks */}
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              value={record.remarks || ""}
              onChange={handleFieldChange("remarks")}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>

          {/* Deposit/Withdrawal */}
          <Grid item xs={6}>
            <TextField
              label="Depositable"
              type="number"
              value={record.depositable || ""}
              onChange={handleFieldChange("depositable")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Deposited"
              type="number"
              value={record.deposited || ""}
              onChange={handleFieldChange("deposited")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Withdrawal"
              type="number"
              value={record.withdrawal || ""}
              onChange={handleFieldChange("withdrawal")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="WD/Dep Date"
              type="date"
              value={record.wdDepDate || ""}
              onChange={handleFieldChange("wdDepDate")}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>

          {/* SNGPL Meter */}
          <Grid item xs={6}>
            <TextField
              label="SNGPL Meter Opening"
              type="number"
              value={record.sngplMeterOpening || ""}
              onChange={handleFieldChange("sngplMeterOpening")}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="SNGPL Meter Closing"
              type="number"
              value={record.sngplMeterClosing || ""}
              onChange={handleFieldChange("sngplMeterClosing")}
              fullWidth
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Nozzle Readings
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nozzle</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Opening</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Closing</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(record.NozzleReadings || []).map((nz, idx) => (
              <TableRow key={idx}>
                {/* Dropdown for nozzleNumber */}
                <TableCell sx={{ width: "20%" }}>
                  <TextField
                    select
                    value={nz.nozzleNumber || ""}
                    onChange={(e) =>
                      handleNozzleChange(idx, "nozzleNumber", e.target.value)
                    }
                    fullWidth
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <MenuItem key={n} value={n}>
                        Nozzle {n}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>

                {/* Opening */}
                <TableCell>
                  <TextField
                    type="number"
                    value={nz.opening || ""}
                    onChange={(e) =>
                      handleNozzleChange(idx, "opening", e.target.value)
                    }
                    fullWidth
                  />
                </TableCell>

                {/* Closing */}
                <TableCell>
                  <TextField
                    type="number"
                    value={nz.closing || ""}
                    onChange={(e) =>
                      handleNozzleChange(idx, "closing", e.target.value)
                    }
                    fullWidth
                  />
                </TableCell>

                {/* Remove button */}
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveNozzle(idx)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {/* Add button row */}
            <TableRow>
              <TableCell colSpan={4}>
                <Button
                  startIcon={<Add />}
                  onClick={handleAddNozzle}
                  size="small"
                >
                  Add Nozzle
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
          Expenditure Details
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {(record.Expenditures || []).map((ex, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <TextField
                    value={ex.description || ""}
                    onChange={(e) =>
                      handleExpenditureChange(
                        idx,
                        "description",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    select
                    value={ex.category || ""}
                    onChange={(e) =>
                      handleExpenditureChange(idx, "category", e.target.value)
                    }
                    fullWidth
                  >
                    {[
                      "kitchen",
                      "general",
                      "diesel",
                      "salary",
                      "loan",
                      "other",
                    ].map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={ex.amount || ""}
                    onChange={(e) =>
                      handleExpenditureChange(idx, "amount", e.target.value)
                    }
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveExpenditure(idx)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4}>
                <Button
                  startIcon={<Add />}
                  onClick={handleAddExpenditure}
                  size="small"
                >
                  Add Expenditure
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRecordDialog;
