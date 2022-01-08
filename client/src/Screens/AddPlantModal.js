import { Modal, Box, Typography, TextField, Button } from "@material-ui/core";
import React, { useState } from "react";

export default function AddPlantModal({ open, handleClose }) {
  const [name, setName] = useState("");
  const [i2cAddr, setI2cAddr] = useState("");
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: 300,
            width: 400,
            backgroundColor: "white",
            padding: 10,
          }}
        >
          <Box>
            <Typography style={{ fontSize: 22 }}>Add Plant</Typography>
            <Row label={"Name"} value={name} onChange={setName} />
            <Row label={"I2C address"} value={i2cAddr} onChange={setI2cAddr} />
          </Box>
          <Button>Submit</Button>
        </Box>
      </Box>
    </Modal>
  );
}

const Row = ({ label, value, onChange }) => {
  const handleTextChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <Box style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 5 }}>
      <Typography style={{ color: "black" }}>{label}</Typography>
      <TextField
        value={value}
        style={{ marginLeft: 5 }}
        onChange={handleTextChange}
        id="standard-basic"
        variant="standard"
      />
    </Box>
  );
};
