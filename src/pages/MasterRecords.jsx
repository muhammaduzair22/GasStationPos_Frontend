import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Collapse,
  Grid,
} from "@mui/material";
import { Edit, Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useEffect, useState, useMemo } from "react";
import {
  getAllRecords,
  updateRecord,
  deleteRecord,
} from "../api/masterRecords";
import { getStations } from "../api/stations";
import EditRecordDialog from "../components/EditRecordDialog";
import dayjs from "dayjs";

const MasterRecords = () => {
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [openRow, setOpenRow] = useState(null);
  const [stations, setStations] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterStation, setFilterStation] = useState("");

  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };

  const formatNumber = (val) =>
    Number(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  const fetchRecords = async () => {
    try {
      const [recordsRes, stationsRes] = await Promise.all([
        getAllRecords(),
        getStations(),
      ]);

      setRecords(recordsRes.data);
      setStations(stationsRes.data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const stationMap = useMemo(() => {
    const map = {};
    stations.forEach((s) => {
      map[s.id] = s.name;
    });
    return map;
  }, [stations]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditedData({ ...record, Expenditures: record.Expenditures || [] });
    setIsModalOpen(true);
  };

  const handleModalChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDateForDb = (date) => {
    if (!date) return null;
    return dayjs(date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
  };

  const handleModalSave = async () => {
    const cleanData = {
      date: formatDateForDb(editedData.date),
      totalSaleKgs: editedData.totalSaleKgs,
      ratePerKg: editedData.ratePerKg,
      totalCngSale: editedData.totalCngSale,
      otherRevenueLoanReturn: editedData.otherRevenueLoanReturn,
      expenditureDetail: editedData.expenditureDetail,
      kitchenExpensesAmount: editedData.kitchenExpensesAmount,
      generalExpensesAmount: editedData.generalExpensesAmount,
      generatorCompressorDieselLubeAmount:
        editedData.generatorCompressorDieselLubeAmount,
      salaryAdvanceNetPay: editedData.salaryAdvanceNetPay,
      loanRepaymentOtherPayments: editedData.loanRepaymentOtherPayments,
      totalDailyExpenditure: editedData.totalDailyExpenditure,
      netSale: editedData.netSale,
      remarks: editedData.remarks,
      depositable: editedData.depositable,
      deposited: editedData.deposited,
      withdrawal: editedData.withdrawal,
      wdDepDate: formatDateForDb(editedData.wdDepDate),
      Expenditures: editedData.Expenditures,
    };

    await updateRecord(editingId, cleanData);
    setIsModalOpen(false);
    setEditingId(null);
    setEditedData({});
    fetchRecords();
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      let matches = true;

      // --- Filter by month (YYYY-MM) ---
      if (filterMonth) {
        const recMonth = new Date(r.date).toISOString().slice(0, 7); // "2025-08"
        if (recMonth !== filterMonth) matches = false;
      }

      // --- Filter by station ---
      if (filterStation) {
        if (String(r.stationId) !== String(filterStation)) matches = false;
      }

      return matches;
    });
  }, [records, filterMonth, filterStation]);

  const summary = filteredRecords.reduce(
    (acc, rec) => {
      acc.totalSaleKgs += rec.totalSaleKgs || 0;
      acc.totalCngSale += rec.totalCngSale || 0;
      acc.deposited += rec.deposited || 0;
      acc.withdrawal += rec.withdrawal || 0;
      acc.netSale += rec.netSale || 0;

      // Expenditures grouped by category
      (rec.Expenditures || []).forEach((exp) => {
        if (exp.category) {
          acc.expenditures[exp.category] =
            (acc.expenditures[exp.category] || 0) + (Number(exp.amount) || 0);
        }
      });

      return acc;
    },
    {
      totalSaleKgs: 0,
      totalCngSale: 0,
      deposited: 0,
      withdrawal: 0,
      netSale: 0,
      expenditures: {},
    }
  );

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Master Records</h2>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Filter by Month */}
        <Grid item xs={6} md={3}>
          <TextField
            label="Filter by Month"
            type="month"
            value={filterMonth}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            onChange={(e) => setFilterMonth(e.target.value)}
            fullWidth
          />
        </Grid>

        {/* Filter by Station */}
        <Grid item xs={6} md={3} sx={{ width: "12%" }}>
          <TextField
            select
            label="Filter by Station"
            onChange={(e) => setFilterStation(e.target.value)}
            fullWidth
          >
            <MenuItem value="">All Stations</MenuItem>
            {stations.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mb: 3, width: "80%" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0D47A1" }}>
              <TableCell
                colSpan={6}
                sx={{ color: "white", fontWeight: "bold" }}
              >
                SUMMARY
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>
                Total Sale (Kgs)
              </TableCell>
              <TableCell>{summary.totalSaleKgs.toLocaleString()}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total CNG Sale</TableCell>
              <TableCell>{summary.totalCngSale.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Deposit</TableCell>
              <TableCell>{summary.deposited.toLocaleString()}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Withdrawal</TableCell>
              <TableCell>{summary.withdrawal.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Net Sale</TableCell>
              <TableCell colSpan={3}>
                {summary.netSale.toLocaleString()}
              </TableCell>
            </TableRow>

            {/* Expenditure Breakdown */}
            <TableRow>
              <TableCell
                colSpan={4}
                sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
              >
                Expenditures by Category
              </TableCell>
            </TableRow>
            {Object.entries(summary.expenditures).map(([category, amount]) => (
              <TableRow key={category}>
                <TableCell sx={{ pl: 4 }}>{category}</TableCell>
                <TableCell colSpan={3}>{amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e3f2fd", whiteSpace: "nowrap" }}>
              <TableCell>Actions</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Station</TableCell>
              <TableCell>Total Sale (Kgs)</TableCell>
              <TableCell>Rate/Kg</TableCell>
              <TableCell>Total CNG Sale</TableCell>
              <TableCell>Deposit</TableCell>
              <TableCell>Withdrawal</TableCell>
              <TableCell>Net Sale</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Expenditures</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRecords.map((rec) => (
              <>
                <TableRow key={rec.id} sx={{ whiteSpace: "nowrap" }}>
                  {/* ACTIONS */}
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(rec)}
                      size="small"
                      color="primary"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setRecordToDelete(rec.id);
                        setConfirmOpen(true);
                      }}
                      size="small"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>

                  {/* MAIN DATA */}
                  <TableCell>{formatDate(rec.date)}</TableCell>
                  <TableCell>{stationMap[rec.stationId] || "—"}</TableCell>
                  <TableCell>{formatNumber(rec.totalSaleKgs)}</TableCell>
                  <TableCell>{formatNumber(rec.ratePerKg)}</TableCell>
                  <TableCell>{formatNumber(rec.totalCngSale)}</TableCell>
                  <TableCell>{formatNumber(rec.deposited)}</TableCell>
                  <TableCell>{formatNumber(rec.withdrawal)}</TableCell>
                  <TableCell>{formatNumber(rec.netSale)}</TableCell>
                  <TableCell>{rec.remarks}</TableCell>
                  <TableCell>
                    {formatNumber(
                      rec.Expenditures?.reduce((sum, e) => sum + e.amount, 0)
                    )}
                  </TableCell>

                  {/* EXPAND BUTTON */}
                  <TableCell>
                    <IconButton onClick={() => toggleRow(rec.id)}>
                      {openRow === rec.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* EXPANDABLE ROW */}
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={11}
                  >
                    <Collapse
                      in={openRow === rec.id}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography variant="subtitle2">
                          Nozzle Readings
                        </Typography>
                        <Table size="small" sx={{ mb: 2 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Nozzle</TableCell>
                              <TableCell>Opening</TableCell>
                              <TableCell>Closing</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rec.NozzleReadings?.map((nz) => (
                              <TableRow key={nz.id}>
                                <TableCell>{nz.nozzleNumber}</TableCell>
                                <TableCell>
                                  {formatNumber(nz.opening)}
                                </TableCell>
                                <TableCell>
                                  {formatNumber(nz.closing)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <Typography variant="subtitle2">
                          Expenditures
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Category</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rec.Expenditures?.map((ex) => (
                              <TableRow key={ex.id}>
                                <TableCell>{ex.category}</TableCell>
                                <TableCell>{ex.description}</TableCell>
                                <TableCell>{formatNumber(ex.amount)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditRecordDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={editedData}
        onChange={handleModalChange}
        onSave={handleModalSave}
        stations={stations}
      />
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this record?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              await deleteRecord(recordToDelete);
              setConfirmOpen(false);
              setRecordToDelete(null);
              fetchRecords();
            }}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MasterRecords;
