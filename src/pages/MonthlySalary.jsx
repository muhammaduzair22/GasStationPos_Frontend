import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { getAllRecords } from "../api/masterRecords";

const numericFields = [
  "totalSaleKgs",
  "ratePerKg",
  "totalCngSale",
  "otherRevenueLoanReturn",
  "kitchenExpensesAmount",
  "generalExpensesAmount",
  "generatorCompressorDieselLubeAmount",
  "salaryAdvanceNetPay",
  "loanRepaymentOtherPayments",
  "totalDailyExpenditure",
  "netSale",
  "depositable",
  "deposited",
  "withdrawal",
];

const MonthlySummary = () => {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM")); // default: current month

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getAllRecords();
        setRecords(data);
      } catch (err) {
        console.error("Error fetching records:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (records.length > 0) {
      const selectedMonth = dayjs(month);
      const filteredData = records.filter((rec) =>
        dayjs(rec.date).isSame(selectedMonth, "month")
      );
      setFiltered(filteredData);
    }
  }, [month, records]);

  // Calculate monthly totals
  const monthlyTotals = numericFields.reduce((totals, field) => {
    totals[field] = filtered.reduce(
      (sum, rec) => sum + (Number(rec[field]) || 0),
      0
    );
    return totals;
  }, {});

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Monthly Summary Report
      </Typography>

      {/* Month selector */}
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Select Month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* Summary Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Metric</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Total</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {numericFields.map((field) => (
              <TableRow key={field}>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {field.replace(/([A-Z])/g, " $1")}{" "}
                  {/* make labels readable */}
                </TableCell>
                <TableCell align="right">
                  {monthlyTotals[field]?.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default MonthlySummary;
