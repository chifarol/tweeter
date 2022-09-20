import React, { useContext } from "react";
import AlertContext from "../contexts/alert";
import "./alert.scss";

const Alert = () => {
  const { alert } = useContext(AlertContext);
  return (
    <div className={!alert.active ? "hide" : "alert-container"}>
      <div className={alert.type + " alert"}>{alert.text}</div>
    </div>
  );
};

export default Alert;
