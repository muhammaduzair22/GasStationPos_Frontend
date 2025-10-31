import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { createRecord } from "../api/masterRecords";
import { getStations } from "../api/stations";
import categorySubcategories from "../utils/categorySubcategories";

const DailyDetailForm = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userRole = storedUser?.role;
  const userStationId = storedUser?.stationId;

  const categoryDisplayNames = {
    kitchen: "Kitchen Expenses",
    general: "General Expenses",
    generatordieselelubecompressor:
      "Generator/Compressor Diesel/Lube Amount (Rs.)",
    salary: "Salary Advance/Net Pay",
    premisesrent: "Premises Rent",
    pettycash: "Petty Cash",
    shahzebkhanallowence: "Shahzeb Khan Allowence",
    kgandjaws: "KG & JAWS Dastarkhwan",
    loansgivenreturnedtostation: "Loans   Given/Returned to CNG Station",
    machineryrepair: "Machinery Repair/Maintenance",
    loansexpenditurebyakeknknk:
      "Loans/Expenditures By Aurangzeb Khan/ Ejaz Khan/Dr. Nasir Khan/Nadeem Khan",
    other: "Other",
  };

  const [formData, setFormData] = useState({
    date: "",
    totalSaleKgs: "",
    totalCngSale: "",
    otherRevenueLoanReturn: "",
    totalDailyExpenditure: "",
    Expenditures: [
      { description: "", amount: "", category: "", subcategory: "" },
    ],
    netSale: "",
    remarks: "",
    depositable: "",
    deposited: "",
    withdrawal: "",
    gasRatePerKg: "",
    wdDepDate: "",
    stationId: userRole === "manager" ? userStationId : "",
    sngplMeterOpening: "",
    sngplMeterClosing: "",
    NozzleReadings: [
      {
        nozzleNumber: "",
        openingGirary: "",
        closingGirary: "",
        openingScreen: "",
        closingScreen: "",
      },
    ],
  });

  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const { data } = await getStations();
        setStations(data);

        // if manager, set gasRatePerKg automatically
        if (userRole === "manager") {
          const selectedStation = data.find((s) => s.id === userStationId);
          if (selectedStation) {
            setFormData((prev) => ({
              ...prev,
              stationId: userStationId,
              gasRatePerKg: selectedStation.gasRatePerKg || 0,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };
    fetchStations();
  }, [userRole, userStationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "stationId") {
      const stationId = parseInt(value, 10);
      const selectedStation = stations.find((s) => s.id === stationId);
      setFormData({
        ...formData,
        stationId,
        gasRatePerKg: selectedStation?.gasRatePerKg || 0,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleNozzleChange = (index, field, value) => {
    const updated = [...formData.NozzleReadings];
    updated[index][field] = value;
    setFormData({ ...formData, NozzleReadings: updated });
  };

  const handleExpenditureChange = (index, field, value) => {
    const updated = [...formData.Expenditures];
    const current = updated[index];
    updated[index] = {
      ...current,
      [field]: value,
      ...(field === "category" ? { subcategory: "" } : {}), // reset subcategory when category changes
    };

    const updatedTotal = updated.reduce(
      (sum, exp) => sum + (parseFloat(exp.amount) || 0),
      0
    );
    setFormData({
      ...formData,
      Expenditures: updated,
      totalDailyExpenditure: updatedTotal,
    });
  };

  const addExpenditureRow = () => {
    setFormData({
      ...formData,
      Expenditures: [
        ...formData.Expenditures,
        { description: "", amount: "", category: "", subcategory: "" },
      ],
    });
  };

  const removeExpenditureRow = (index) => {
    const updated = formData.Expenditures.filter((_, i) => i !== index);
    const updatedTotal = updated.reduce(
      (sum, exp) => sum + (parseFloat(exp.amount) || 0),
      0
    );
    setFormData({
      ...formData,
      Expenditures: updated,
      totalDailyExpenditure: updatedTotal,
    });
  };

  // place this above handleSubmit
  const cleanPayload = (data) => {
    const toNumberOrNull = (v) => {
      if (v === "" || v === undefined || v === null) return null;
      return typeof v === "string" && !isNaN(v) ? Number(v) : v;
    };

    const TEXT_KEYS = new Set([
      "date",
      "wdDepDate",
      "expenditureDetail",
      "remarks",
    ]);

    const out = { ...data };

    // force stationId to number (or null)
    out.stationId = data.stationId ? Number(data.stationId) : null;

    // clean top-level keys
    Object.entries(out).forEach(([k, v]) => {
      if (k === "NozzleReadings" || k === "Expenditures") return;

      if (TEXT_KEYS.has(k)) {
        out[k] = v === "" || v === undefined ? null : v;
      } else {
        out[k] = toNumberOrNull(v);
      }
    });

    // nested NozzleReadings
    out.NozzleReadings = Array.isArray(data.NozzleReadings)
      ? data.NozzleReadings.filter(
          (n) =>
            n &&
            (n.nozzleNumber ||
              n.openingGirary ||
              n.closingGirary ||
              n.openingScreen ||
              n.closingScreen)
        ).map((n) => ({
          nozzleNumber: n.nozzleNumber ? Number(n.nozzleNumber) : null,
          openingGirary: toNumberOrNull(n.openingGirary),
          closingGirary: toNumberOrNull(n.closingGirary),
          openingScreen: toNumberOrNull(n.openingScreen),
          closingScreen: toNumberOrNull(n.closingScreen),
        }))
      : [];

    // nested Expenditures
    out.Expenditures = Array.isArray(data.Expenditures)
      ? data.Expenditures.filter(
          (e) => e && (e.description || e.amount || e.category || e.subcategory)
        ).map((e) => ({
          description: e.description || "",
          category: e.category || "other",
          subcategory: e.subcategory || "",
          amount: toNumberOrNull(e.amount),
        }))
      : [];

    return out;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = cleanPayload(formData);
      await createRecord(payload);
      alert("Record created successfully");

      // Reset form
      setFormData({
        date: "",
        totalSaleKgs: "",
        totalCngSale: "",
        otherRevenueLoanReturn: "",
        totalDailyExpenditure: "",
        expenditureDetail: "",
        kitchenExpensesAmount: "",
        generalExpensesAmount: "",
        generatorCompressorDieselLubeAmount: "",
        salaryAdvanceNetPay: "",
        loanRepaymentOtherPayments: "",
        netSale: "",
        remarks: "",
        depositable: "",
        deposited: "",
        withdrawal: "",
        gasRatePerKg: "",
        wdDepDate: "",
        stationId: "",
        sngplMeterOpening: "",
        sngplMeterClosing: "",
        NozzleReadings: [
          {
            nozzleNumber: "",
            openingGirary: "",
            closingGirary: "",
            openingScreen: "",
            closingScreen: "",
          },
        ],
        Expenditures: [{ description: "", amount: "", category: "" }],
      });
    } catch (err) {
      console.error("Error creating record:", err);
      alert("Failed to create record");
    }
  };

  const renderStationField = () => {
    if (userRole === "manager") {
      const station = stations.find((s) => s.id === userStationId);
      return (
        <TextField
          label="Station"
          value={station ? station.name : ""}
          fullWidth
          disabled
        />
      );
    }

    // Admin / Partner → dropdown
    return (
      <TextField
        select
        label="Station"
        name="stationId"
        value={formData.stationId}
        onChange={handleChange}
        required
      >
        {stations.map((station) => (
          <MenuItem key={station.id} value={station.id}>
            {station.name}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const totalExpenditureAmount = formData.Expenditures.reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0),
    0
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Daily Detail Form
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "grid", gap: 2 }}
        >
          <TextField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          {renderStationField()}

          <TextField
            label="Gas Rate per Kg"
            name="gasRatePerKg"
            type="number"
            value={formData.gasRatePerKg}
            slotProps={{
              input: { readOnly: true },
              inputLabel: { shrink: true },
            }}
          />

          <TextField
            label="SNGPL Meter Opening"
            name="sngplMeterOpening"
            type="number"
            value={formData.sngplMeterOpening}
            onChange={handleChange}
          />

          <TextField
            label="SNGPL Meter Closing"
            name="sngplMeterClosing"
            type="number"
            value={formData.sngplMeterClosing}
            onChange={handleChange}
          />

          <TextField
            label="Total Sale (Kgs)"
            name="totalSaleKgs"
            type="number"
            value={formData.totalSaleKgs}
            onChange={handleChange}
            required
          />

          <TextField
            label="Total CNG Sale (Rs)"
            name="totalCngSale"
            type="number"
            value={formData.totalCngSale}
            onChange={handleChange}
            required
          />

          <TextField
            label="Other Revenue / Loan Return"
            name="otherRevenueLoanReturn"
            type="number"
            value={formData.otherRevenueLoanReturn}
            onChange={handleChange}
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            Expenditures
          </Typography>
          {formData.Expenditures.map((exp, index) => {
            // Determine subcategories based on selected category
            const subcategories = categorySubcategories[exp.category] || [];

            return (
              <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                <Grid item xs={3}>
                  <TextField
                    label="Description"
                    value={exp.description}
                    onChange={(e) =>
                      handleExpenditureChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    fullWidth
                  />
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    label="Category"
                    select
                    value={exp.category}
                    onChange={(e) =>
                      handleExpenditureChange(index, "category", e.target.value)
                    }
                    fullWidth
                    slotProps={{
                      input: {
                        sx: { minWidth: 180 }, // ensures TextField width
                      },
                      select: {
                        MenuProps: {
                          PaperProps: {
                            sx: { minWidth: 200 }, // ensures dropdown width
                          },
                        },
                      },
                    }}
                  >
                    {Object.keys(categoryDisplayNames).map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {categoryDisplayNames[cat]}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    label="Subcategory"
                    select
                    value={exp.subcategory}
                    onChange={(e) =>
                      handleExpenditureChange(
                        index,
                        "subcategory",
                        e.target.value
                      )
                    }
                    fullWidth
                    disabled={!exp.category}
                    slotProps={{
                      input: { sx: { minWidth: 180 } },
                      select: {
                        MenuProps: {
                          PaperProps: { sx: { minWidth: 200 } },
                        },
                      },
                    }}
                  >
                    {subcategories.map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    label="Amount"
                    type="number"
                    value={exp.amount}
                    onChange={(e) =>
                      handleExpenditureChange(index, "amount", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>

                <Grid
                  item
                  xs={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    color="error"
                    onClick={() => removeExpenditureRow(index)}
                  >
                    X
                  </Button>
                </Grid>
              </Grid>
            );
          })}

          <Button onClick={addExpenditureRow} sx={{ mt: 1 }}>
            + Add Expenditure
          </Button>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={3}>
              <TextField
                label="Total Daily Expenditure"
                value={formData.totalDailyExpenditure || 0}
                slotProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
          </Grid>

          <TextField
            label="Net Sale"
            name="netSale"
            type="number"
            value={formData.netSale}
            onChange={handleChange}
          />

          <TextField
            label="Remarks"
            name="remarks"
            multiline
            rows={2}
            value={formData.remarks}
            onChange={handleChange}
          />

          <TextField
            label="Depositable"
            name="depositable"
            type="number"
            value={formData.depositable}
            onChange={handleChange}
          />

          <TextField
            label="Deposited"
            name="deposited"
            type="number"
            value={formData.deposited}
            onChange={handleChange}
          />

          <TextField
            label="Withdrawal"
            name="withdrawal"
            type="number"
            value={formData.withdrawal}
            onChange={handleChange}
          />

          <TextField
            label="WD/Dep Date"
            type="date"
            name="wdDepDate"
            value={formData.wdDepDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <Typography variant="h6" sx={{ mt: 3 }}>
            Nozzle Readings
          </Typography>

          {formData.NozzleReadings.map((nozzle, index) => (
            <Grid item xs={12} key={index}>
              <Grid container spacing={2} alignItems="center">
                {/* Nozzle Number Selector */}
                <Grid item xs={4} sx={{ width: "20%" }}>
                  <TextField
                    select
                    label="Nozzle Number"
                    value={nozzle.nozzleNumber || ""}
                    onChange={(e) =>
                      handleNozzleChange(index, "nozzleNumber", e.target.value)
                    }
                    fullWidth
                  >
                    {Array.from({ length: 6 }, (_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        Nozzle {i + 1}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Opening Girary */}
                <Grid item xs={3}>
                  <TextField
                    label="Opening Girary"
                    type="number"
                    value={nozzle.openingGirary}
                    onChange={(e) =>
                      handleNozzleChange(index, "openingGirary", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>

                {/* Closing Girary */}
                <Grid item xs={3}>
                  <TextField
                    label="Closing Girary"
                    type="number"
                    value={nozzle.closingGirary}
                    onChange={(e) =>
                      handleNozzleChange(index, "closingGirary", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>

                {/* Opening Screen */}
                <Grid item xs={3}>
                  <TextField
                    label="Opening Screen"
                    type="number"
                    value={nozzle.openingScreen}
                    onChange={(e) =>
                      handleNozzleChange(index, "openingScreen", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>

                {/* Closing Screen */}
                <Grid item xs={3}>
                  <TextField
                    label="Closing Screen"
                    type="number"
                    value={nozzle.closingScreen}
                    onChange={(e) =>
                      handleNozzleChange(index, "closingScreen", e.target.value)
                    }
                    fullWidth
                  />
                </Grid>

                {/* Remove Button */}
                <Grid item xs={2}>
                  <Button
                    color="error"
                    onClick={() => {
                      const updated = [...formData.NozzleReadings];
                      updated.splice(index, 1);
                      setFormData({ ...formData, NozzleReadings: updated });
                    }}
                  >
                    X
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ))}

          {/* Add Row Button */}
          <Button
            onClick={() =>
              setFormData({
                ...formData,
                NozzleReadings: [
                  ...formData.NozzleReadings,
                  {
                    nozzleNumber: "",
                    openingGirary: "",
                    closingGirary: "",
                    openingScreen: "",
                    closingScreen: "",
                  },
                ],
              })
            }
          >
            + Add Nozzle
          </Button>

          <Button type="submit" variant="contained" color="primary">
            Save Record
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DailyDetailForm;
