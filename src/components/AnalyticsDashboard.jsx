import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";
import { getStations } from "../api/stations";
import { getAllRecords } from "../api/masterRecords";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#E91E63",
  "#9C27B0",
];

export default function AnalyticsDashboard() {
  const [records, setRecords] = useState([]);
  const [stations, setStations] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStation, setFilterStation] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, stationsRes] = await Promise.all([
          getAllRecords(),
          getStations(),
        ]);
        setRecords(recordsRes.data || []);
        setStations(stationsRes.data || []);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      }
    };
    fetchData();
  }, []);

  // --- Filtered Records ---
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      let matches = true;

      if (filterMonth) {
        const recMonth = dayjs(r.date).format("MM");
        if (recMonth !== filterMonth) matches = false;
      }
      if (filterYear) {
        const recYear = dayjs(r.date).format("YYYY");
        if (recYear !== filterYear) matches = false;
      }
      if (filterStation) {
        if (String(r.stationId) !== String(filterStation)) matches = false;
      }
      return matches;
    });
  }, [records, filterMonth, filterYear, filterStation]);

  // --- Aggregated Data ---
  const analyticsData = useMemo(() => {
    const grouped = {};
    const expenditureTotals = {};
    const stationTotals = {};

    filteredRecords.forEach((r) => {
      const month = dayjs(r.date).format("YYYY-MM");

      if (!grouped[month]) {
        grouped[month] = {
          month,
          totalSaleKgs: 0,
          totalCngSale: 0,
          deposited: 0,
          withdrawal: 0,
          netSale: 0,
          expenditures: 0,
        };
      }
      grouped[month].totalSaleKgs += r.totalSaleKgs || 0;
      grouped[month].totalCngSale += r.totalCngSale || 0;
      grouped[month].deposited += r.deposited || 0;
      grouped[month].withdrawal += r.withdrawal || 0;
      grouped[month].netSale += r.netSale || 0;

      // expenditures per month
      let expSum = 0;
      (r.Expenditures || []).forEach((exp) => {
        if (exp.category) {
          expenditureTotals[exp.category] =
            (expenditureTotals[exp.category] || 0) + (Number(exp.amount) || 0);
        }
        expSum += Number(exp.amount) || 0;
      });
      grouped[month].expenditures += expSum;

      // sales per station
      if (r.stationId) {
        stationTotals[r.stationId] =
          (stationTotals[r.stationId] || 0) + (r.totalCngSale || 0);
      }
    });

    // compute profit margin per month
    const monthly = Object.values(grouped)
      .map((m) => ({
        ...m,
        profit: m.netSale - m.expenditures,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // cumulative net sale trend
    let cumulative = 0;
    const cumulativeTrend = monthly.map((m) => {
      cumulative += m.netSale;
      return { month: m.month, cumulativeNetSale: cumulative };
    });

    return {
      monthly,
      expenditures: expenditureTotals,
      stationPerformance: Object.entries(stationTotals).map(([id, sale]) => ({
        stationId: id,
        sale,
      })),
      cumulativeTrend,
    };
  }, [filteredRecords]);

  // --- Charts ---
  const renderSalesTrend = () => (
    <LineChart width={500} height={300} data={analyticsData.monthly}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="totalSaleKgs"
        stroke="#0D47A1"
        name="Sale (Kgs)"
      />
      <Line
        type="monotone"
        dataKey="netSale"
        stroke="#43A047"
        name="Net Sale (PKR)"
      />
    </LineChart>
  );

  const renderDepositVsWithdrawal = () => (
    <BarChart width={500} height={300} data={analyticsData.monthly}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="deposited" fill="#4CAF50" name="Deposited" />
      <Bar dataKey="withdrawal" fill="#F44336" name="Withdrawal" />
    </BarChart>
  );

  const renderExpenditurePie = () => {
    const data = Object.entries(analyticsData.expenditures).map(
      ([cat, amt]) => ({ category: cat, value: amt })
    );
    return (
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  };

  const renderProfitMarginTrend = () => (
    <LineChart width={500} height={300} data={analyticsData.monthly}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="profit"
        stroke="#FF9800"
        name="Profit Margin"
      />
    </LineChart>
  );

  const renderCngVsDeposits = () => (
    <LineChart width={500} height={300} data={analyticsData.monthly}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="totalCngSale"
        stroke="#3F51B5"
        name="CNG Sale"
      />
      <Line
        type="monotone"
        dataKey="deposited"
        stroke="#009688"
        name="Deposited"
      />
    </LineChart>
  );

  const renderStationPerformance = () => (
    <BarChart width={500} height={300} data={analyticsData.stationPerformance}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="stationId" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="sale" fill="#2196F3" name="Total Sale (PKR)" />
    </BarChart>
  );

  const renderCumulativeNetSale = () => (
    <LineChart width={500} height={300} data={analyticsData.cumulativeTrend}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="cumulativeNetSale"
        stroke="#673AB7"
        name="Cumulative Net Sale"
      />
    </LineChart>
  );

  // --- UI ---
  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Business Analytics
      </Typography>

      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Year Filter */}
        <Grid item>
          <TextField
            select
            label="Filter by Year"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            sx={{ width: 200 }} // fixed width
          >
            <MenuItem value="">
              <em>All Years</em>
            </MenuItem>
            {[...new Set(records.map((r) => dayjs(r.date).format("YYYY")))].map(
              (y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              )
            )}
          </TextField>
        </Grid>

        {/* Month Filter */}
        <Grid item>
          <TextField
            select
            label="Filter by Month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            sx={{ width: 200 }}
          >
            <MenuItem value="">
              <em>All Months</em>
            </MenuItem>
            {Array.from({ length: 12 }, (_, i) =>
              dayjs().month(i).format("MM")
            ).map((m) => (
              <MenuItem key={m} value={m}>
                {dayjs()
                  .month(Number(m) - 1)
                  .format("MMMM")}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Station Filter */}
        <Grid item>
          <TextField
            select
            label="Filter by Station"
            value={filterStation}
            onChange={(e) => setFilterStation(e.target.value)}
            sx={{ width: 200 }}
          >
            <MenuItem value="">
              <em>All Stations</em>
            </MenuItem>
            {stations.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sales Trend</Typography>
              {renderSalesTrend()}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Deposited vs Withdrawal</Typography>
              {renderDepositVsWithdrawal()}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Expenditure Breakdown</Typography>
              {renderExpenditurePie()}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Profit Margin Trend</Typography>
              {renderProfitMarginTrend()}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">CNG Sale vs Deposits</Typography>
              {renderCngVsDeposits()}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Station Performance</Typography>
              {renderStationPerformance()}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Cumulative Net Sale</Typography>
              {renderCumulativeNetSale()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
