import React from "react";

const DragBorder = ({ onDrag }) => {
  const handleMouseDown = (e) => {
    e.preventDefault();

    const startY = e.clientY;

    const onMouseMove = (moveEvent) => {
      const delta = Math.round((moveEvent.clientY - startY) / 20); // 감도 조정
      onDrag(delta);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      style={{
        height: "5px",
        cursor: "row-resize",
        backgroundColor: "#ccc",
      }}
      onMouseDown={handleMouseDown}
    />
  );
};

export default DragBorder;
