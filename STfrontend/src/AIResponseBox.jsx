import React from "react";
import "./AIResponseBox.css";

const AIResponseBox = ({ message }) => {
  return (
    <div className="response-container">
      <div className="ai-box">
        <div className="ai-header">
          <span className="ai-icon">✨</span>
          <span className="ai-name">Gemini</span>
        </div>
        <div className="ai-content">
          {message || "Generating response..."}
        </div>

        {/* Action Buttons on borders */}
        <button className="border-btn btn-left" title="Add left">
          +
        </button>
        <button className="border-btn btn-right" title="Add right">
          +
        </button>
        <button className="border-btn btn-bottom" title="Add below">
          +
        </button>
      </div>
    </div>
  );
};

export default AIResponseBox;
