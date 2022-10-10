import React from "react";
import "./spinner.css";

/**
 * a spinning circle to show loading state
 * @return a spinning circle to show loading state
 */
export const Spinner = () => {
  return (
    <>
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    </>
  );
};
