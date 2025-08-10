import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Edit, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getAllRecords, updateRecord, deleteRecord } from "../api/records";
import EditRecordDialog from "../components/EditRecordDialog";
import * as XLSX from "xlsx";
import ExcelUpload from "../components/ExcelUpload";
import dayjs from "dayjs";

const MasterRecords = () => {
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWW, setFilterWW] = useState("");
  const [filterHead, setFilterHead] = useState("");
  const [filterReceivedDate, setFilterReceivedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");

  const columnOptions = [
    { label: "Master #", key: "master_counter" },
    { label: "WW Bill", key: "ww_bill_code" },
    { label: "Sub #", key: "sub_no" },
    { label: "Invoice No", key: "invoice_no" },
    { label: "Bill Detail", key: "bill_detail" },
    { label: "Customer Name", key: "customer_name" },
    { label: "Head of Account", key: "head_of_account" },
    { label: "Sanctioned", key: "sanctioned_amount" },
    { label: "Cheque No", key: "cheque_number" },
    { label: "Cheque Amount", key: "cheque_amount" },
    { label: "Cash", key: "cash_value" },
    { label: "Profit", key: "profit" },
    { label: "Total Expenses", key: "total_expenses" },
    { label: "Income Tax Hardware", key: "income_tax_hardware" },
    { label: "Income Tax Service", key: "income_tax_service" },
    { label: "GST @18%", key: "sales_tax_gst_18" },
    { label: "SST @16%", key: "sales_tax_sst_16" },
    { label: "1/5 GST", key: "one_fifth_gst" },
    { label: "Date of Bill", key: "date_of_bill" },
    { label: "Date of Printing", key: "date_of_printing" },
    { label: "Received Date", key: "received_date" },
  ];

  const gstColumns = [
    "ww_bill_code",
    "invoice_no",
    "customer_name",
    "sanctioned_amount",
    "cheque_number",
    "cheque_amount",
    "income_tax_hardware",
    "income_tax_service",
    "sales_tax_gst_18",
    "sales_tax_sst_16",
    "one_fifth_gst",
    "received_date",
  ];

  const customerColumns = [
    "master_counter",
    "sub_no",
    "ww_bill_code",
    "invoice_no",
    "customer_name",
    "head_of_account",
    "bill_detail",
    "sanctioned_amount",
    "cheque_amount",
    "cash_value",
    "profit",
    "date_of_bill",
    "date_of_printing",
    "received_date",
  ];

  const [selectedColumns, setSelectedColumns] = useState(
    columnOptions.map((c) => c.key)
  );

  const fetchRecords = async () => {
    const res = await getAllRecords();
    setRecords(res.data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditedData({ ...record });
    setIsModalOpen(true);
  };

  const handleModalChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) => {
    if (!date) return null;
    return dayjs(date).format("DD-MM-YYYY");
  };

  const formatDateForDb = (date) => {
    if (!date) return null;
    return dayjs(date, ["DD-MM-YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
  };

  const handleModalSave = async () => {
    const cleanData = {
      ww_bill_code: editedData.ww_bill_code,
      invoice_no: editedData.invoice_no,
      bill_detail: editedData.bill_detail,
      head_of_account: editedData.head_of_account,
      sanctioned_amount: editedData.sanctioned_amount,
      customer_name: editedData.customer_name,
      cheque_number: editedData.cheque_number,
      cheque_amount: editedData.cheque_amount,
      cash_value: editedData.cash_value,
      profit: editedData.profit,
      total_expenses: editedData.total_expenses,
      income_tax_hardware: editedData.income_tax_hardware,
      income_tax_service: editedData.income_tax_service,
      sales_tax_gst_18: editedData.sales_tax_gst_18,
      sales_tax_sst_16: editedData.sales_tax_sst_16,
      one_fifth_gst: editedData.one_fifth_gst,
      date_of_bill: formatDateForDb(editedData.date_of_bill),
      date_of_printing: formatDateForDb(editedData.date_of_printing),
      received_date: formatDateForDb(editedData.received_date),
    };
    await updateRecord(editingId, cleanData);
    setIsModalOpen(false);
    setEditingId(null);
    setEditedData({});
    fetchRecords();
  };

  const handleDownload = () => {
    const dataToDownload = filteredRecords.length ? filteredRecords : records;

    const selectedDefs = columnOptions.filter((c) =>
      selectedColumns.includes(c.key)
    );

    const formattedData = dataToDownload.map((rec) => {
      const row = {};
      selectedDefs.forEach(({ key, label }) => {
        let val = rec[key];
        if (
          ["date_of_bill", "date_of_printing", "received_date"].includes(key)
        ) {
          val = formatDate(val);
        }
        row[label] = val;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MasterRecords");
    XLSX.writeFile(workbook, "MasterRecords.xlsx");
  };

  const filteredRecords = records.filter((rec) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      rec.invoice_no?.toLowerCase().includes(search) ||
      rec.bill_detail?.toLowerCase().includes(search) ||
      rec.head_of_account?.toLowerCase().includes(search) ||
      rec.ww_bill_code?.toLowerCase().includes(search) ||
      String(rec.sanctioned_amount).includes(search);

    const matchesWW = filterWW ? rec.ww_bill_code === filterWW : true;
    const matchesHead = filterHead ? rec.head_of_account === filterHead : true;

    const hasReceivedDate =
      rec.received_date && rec.received_date.trim() !== "";

    const matchesReceivedDate =
      filterReceivedDate === "hasDate"
        ? hasReceivedDate
        : filterReceivedDate === "noDate"
        ? !hasReceivedDate
        : true;

    // Month filter
    const matchesMonth = filterMonth
      ? (() => {
          try {
            const recordDate = new Date(rec.received_date);
            const recordMonth = recordDate.toISOString().slice(0, 7); // "YYYY-MM"
            return recordMonth === filterMonth;
          } catch {
            return false;
          }
        })()
      : true;

    return (
      matchesSearch &&
      matchesWW &&
      matchesHead &&
      matchesReceivedDate &&
      matchesMonth
    );
  });

  const summary = filteredRecords.reduce(
    (acc, rec) => {
      acc.sanctioned += Number(rec.sanctioned_amount || 0);
      acc.cash += Number(rec.cash_value || 0);
      acc.cheque += Number(rec.cheque_amount || 0);
      acc.profit += Number(rec.profit || 0);
      return acc;
    },
    { sanctioned: 0, cash: 0, cheque: 0, profit: 0 }
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
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 2,
            mb: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button variant="contained" color="success" onClick={handleDownload}>
            Download Excel
          </Button>

          <ExcelUpload />
        </Box>
      </Box>
      <div style={{ marginBottom: 16, display: "flex", gap: "12px" }}>
        <TextField
          size="small"
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          size="small"
          value={filterWW}
          onChange={(e) => setFilterWW(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All WW Bills</MenuItem>
          {[...new Set(records.map((r) => r.ww_bill_code))].map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          value={filterHead}
          onChange={(e) => setFilterHead(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Heads</MenuItem>
          {[...new Set(records.map((r) => r.head_of_account))].map((head) => (
            <MenuItem key={head} value={head}>
              {head}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          value={filterReceivedDate}
          onChange={(e) => setFilterReceivedDate(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Records</MenuItem>
          <MenuItem value="hasDate">With Received Date</MenuItem>
          <MenuItem value="noDate">Without Received Date</MenuItem>
        </Select>
        <TextField
          size="small"
          type="month"
          label="Filter by Month"
          InputLabelProps={{ shrink: true }}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
      </div>

      <Accordion sx={{ mt: 2, mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight="bold">Select Columns to Export</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup row sx={{ flexWrap: "wrap" }}>
            {columnOptions.map((col) => (
              <FormControlLabel
                key={col.key}
                control={
                  <Checkbox
                    checked={selectedColumns.includes(col.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedColumns((prev) => [...prev, col.key]);
                      } else {
                        setSelectedColumns((prev) =>
                          prev.filter((key) => key !== col.key)
                        );
                      }
                    }}
                  />
                }
                label={col.label}
                sx={{ minWidth: "180px" }}
              />
            ))}
          </FormGroup>
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                setSelectedColumns(columnOptions.map((c) => c.key))
              }
            >
              Select All
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedColumns([])}
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedColumns(gstColumns)}
            >
              Select For GST
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedColumns(customerColumns)}
            >
              Select for Customer
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
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
              <TableCell>Sanctioned Amount</TableCell>
              <TableCell>PKR</TableCell>
              <TableCell>{summary.sanctioned.toLocaleString()}</TableCell>
              <TableCell
                sx={{ backgroundColor: "#e0f2f1", fontWeight: "bold" }}
              >
                Approx. Profit
              </TableCell>
              <TableCell>PKR</TableCell>
              <TableCell>{summary.profit.toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Approx Cash Value</TableCell>
              <TableCell>PKR</TableCell>
              <TableCell>{summary.cash.toLocaleString()}</TableCell>
              <TableCell
                sx={{ backgroundColor: "#a5d6a7", fontWeight: "bold" }}
              >
                Total Paid
              </TableCell>
              <TableCell>PKR</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Approx Cheque Amount</TableCell>
              <TableCell>PKR</TableCell>
              <TableCell>{summary.cheque.toLocaleString()}</TableCell>
              <TableCell
                sx={{ backgroundColor: "#ef9a9a", fontWeight: "bold" }}
              >
                Total Unpaid
              </TableCell>
              <TableCell>PKR</TableCell>
              <TableCell>{summary.sanctioned.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                whiteSpace: "nowrap",
                backgroundColor: "#e3f2fd",
                fontWeight: "bold",
              }}
            >
              <TableCell sx={{ fontWeight: "bold" }}>Master #</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>WW Bill</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sub #</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Invoice No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Bill Detail</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Head of Account</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sanctioned</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cheque No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cheque Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Cash</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Profit</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Expenses</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Income Tax Hardware
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Income Tax Service
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>GST @18%</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>SST @16%</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>1/5 GST</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date of Bill</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Date of Printing
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Received Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRecords.map((rec) => (
              <TableRow key={rec.id} sx={{ whiteSpace: "nowrap" }}>
                <TableCell>{rec.master_counter}</TableCell>
                <TableCell>{rec.ww_bill_code}</TableCell>
                <TableCell>{rec.sub_no}</TableCell>
                <TableCell>{rec.invoice_no}</TableCell>
                <TableCell>{rec.bill_detail}</TableCell>
                <TableCell>{rec.customer_name}</TableCell>
                <TableCell>{rec.head_of_account}</TableCell>
                <TableCell>
                  {Number(rec.sanctioned_amount || 0).toLocaleString()}
                </TableCell>
                <TableCell>{rec.cheque_number}</TableCell>
                <TableCell>
                  {Number(rec.cheque_amount || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Number(rec.cash_value || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Number(rec.profit || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Number(rec.total_expenses || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Number(rec.income_tax_hardware || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Number(rec.income_tax_service || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Number(rec.sales_tax_gst_18 || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Number(rec.sales_tax_sst_16 || 0).toLocaleString()}
                </TableCell>
                <TableCell>
                  {Number(rec.one_fifth_gst || 0).toLocaleString()}
                </TableCell>
                <TableCell>{formatDate(rec.date_of_bill)}</TableCell>
                <TableCell>{formatDate(rec.date_of_printing)}</TableCell>
                <TableCell>{formatDate(rec.received_date)}</TableCell>
                <TableCell>
                  <>
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
                  </>
                </TableCell>
              </TableRow>
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
