import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { uploadExcel } from "../api/upload";

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(selectedFile.type)
    ) {
      setFile(selectedFile);
    } else {
      setSnackbar({
        open: true,
        message: "Invalid file type. Please upload an Excel file.",
        severity: "error",
      });
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({
        open: true,
        message: "Please select a file first.",
        severity: "warning",
      });
      return;
    }

    setUploading(true);
    try {
      const response = await uploadExcel(file);
      setSnackbar({
        open: true,
        message: response.data.message || "Upload successful!",
        severity: "success",
      });
      setFile(null);
      setOpenDialog(false); // close dialog on success
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Upload failed.",
        severity: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Open Upload Dialog Button */}
      <Box
        textAlign="center"
        mt={4}
        sx={{
          mt: 0,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Upload Excel File
        </Button>
      </Box>

      {/* Upload Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Excel File</DialogTitle>
        <DialogContent dividers>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  color="primary"
                >
                  Choose Excel File
                  <input
                    type="file"
                    hidden
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                  />
                </Button>

                {file && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {file.name}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={!file || uploading}
          >
            {uploading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Upload"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExcelUpload;
