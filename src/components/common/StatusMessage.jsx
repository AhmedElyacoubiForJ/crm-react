import React from "react";
import Spinner from "../common/Spinner";

const StatusMessage = ({ loading, error, children }) => {
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Erneut versuchen</button>
      </div>
    );
  }

  return children;
};

export default StatusMessage;
