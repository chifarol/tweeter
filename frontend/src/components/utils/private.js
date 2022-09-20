import React from "react";
import { Navigate } from "react-router-dom";

// checks if user is logged in if not redirect to login
function Private({ auth, children }) {
  if (auth) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default Private;
