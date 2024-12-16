import React from "react";

const SaveBtn = ({ handleSave }) => {
  return (
    <button className="save-button" onClick={handleSave}>
      Save
    </button>
  );
};

export default SaveBtn;
