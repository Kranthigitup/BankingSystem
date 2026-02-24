import React from "react";

function LoadingScreen() {
  return (
    <div className="app-shell">
      <div className="container-xl">
        <div className="glass-card">
          <div className="skeleton title" />
          <div className="skeleton line" />
          <div className="skeleton line" />
          <div className="skeleton line short" />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
