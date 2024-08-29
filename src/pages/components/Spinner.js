import React from "react";
import { PulseLoader } from "react-spinners";

export default function Spinner() {
  return (
    <PulseLoader
      color="#444444"
      loading
      margin={2}
      size={3}
      speedMultiplier={0.7}
    />
  );
}
