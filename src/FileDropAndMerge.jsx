import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import DragBorder from "./DragBorder";

const FileDropAndMerge = () => {
  const [fileNames, setFileNames] = useState([]);
  const [fileContents, setFileContents] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null); // 선택된 파일의 인덱스
  const [listHeight, setListHeight] = useState(200); // 파일 목록 높이
  const [contentHeight, setContentHeight] = useState(300); // 병합된 텍스트 영역 높이

  // 파일 드롭 이벤트 처리
  const onDrop = async (acceptedFiles) => {
    const sortedFiles = acceptedFiles.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const fileNamesInOrder = sortedFiles.map((file) => file.name);
    const fileContentsInOrder = await Promise.all(
      sortedFiles.map((file) => file.text())
    );

    setFileNames(fileNamesInOrder);
    setFileContents(fileContentsInOrder);
  };

  // 병합된 텍스트를 반환하는 함수
  const getMergedText = () => fileContents.join("\n");

  // 파일 순서 변경 함수
  const moveFile = (direction) => {
    if (selectedIndex === null) return;

    const newFileNames = [...fileNames];
    const newFileContents = [...fileContents];
    const targetIndex =
      direction === "up" ? selectedIndex - 1 : selectedIndex + 1;

    if (targetIndex < 0 || targetIndex >= fileNames.length) return;

    [newFileNames[selectedIndex], newFileNames[targetIndex]] = [
      newFileNames[targetIndex],
      newFileNames[selectedIndex],
    ];
    [newFileContents[selectedIndex], newFileContents[targetIndex]] = [
      newFileContents[targetIndex],
      newFileContents[selectedIndex],
    ];

    setFileNames(newFileNames);
    setFileContents(newFileContents);
    setSelectedIndex(targetIndex);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".txt",
    multiple: true,
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* 드래그 앤 드랍 영역 */}
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          backgroundColor: isDragActive ? "#f0f8ff" : "#f9f9f9",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>드롭하여 파일을 업로드하세요!</p>
        ) : (
          <p>여러 텍스트 파일을 드래그 앤 드랍하세요.</p>
        )}
      </div>

      {/* 파일 목록 영역 */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          height: `${listHeight}px`, // 동적으로 높이 조절
          overflowY: "auto",
        }}
      >
        {fileNames.length > 0 ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4>업로드된 파일 목록 (정렬된 순서):</h4>
              <div>
                <button
                  onClick={() => moveFile("up")}
                  disabled={selectedIndex === null || selectedIndex === 0}
                  style={{ marginRight: "5px" }}
                >
                  ▲
                </button>
                <button
                  onClick={() => moveFile("down")}
                  disabled={
                    selectedIndex === null || selectedIndex === fileNames.length - 1
                  }
                >
                  ▼
                </button>
              </div>
            </div>
            <ul>
              {fileNames.map((name, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      index === selectedIndex ? "#d3f3ff" : "transparent",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {name}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p style={{ textAlign: "center", margin: 0 }}>업로드된 파일이 없습니다.</p>
        )}
      </div>

      {/* 경계선 추가 */}
      <DragBorder onDrag={(delta) => setListHeight((h) => Math.max(100, h + delta))} />

      {/* 병합된 파일 내용 표시 */}
      <div
        style={{
          marginTop: "10px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#fff",
          whiteSpace: "pre-wrap",
          height: `${contentHeight}px`, // 동적으로 높이 조절
          overflowY: "auto",
        }}
      >
        {fileNames.length > 0
          ? getMergedText() || "병합된 파일 내용이 표시됩니다."
          : "병합된 파일 내용이 여기에 표시됩니다."}
      </div>

      {/* 병합된 파일 내용 영역 하단에 경계선 추가 */}
      <DragBorder onDrag={(delta) => setContentHeight((h) => Math.max(100, h + delta))} />
    </div>
  );
};

export default FileDropAndMerge;
