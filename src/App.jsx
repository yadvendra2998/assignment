import { useEffect, useState } from "react";
import "./App.css";
import Title from "./components/Title";
import SaveBtn from "./components/SaveBtn";
import {
  ContentState,
  convertToRaw,
  EditorState,
  convertFromRaw,
} from "draft-js";
import DraftEditor from "./components/DraftEditor";

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem("editorContent");
      if (savedContent) {
        const contentState = convertFromRaw(JSON.parse(savedContent));
        setEditorState(EditorState.createWithContent(contentState));
      }
    } catch (error) {
      console.error("Failed to load editor content:", error);
    }
  }, []);

  const handleSave = () => {
    const content = editorState.getCurrentContent();
    const rawContent = convertToRaw(content);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
  };

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  return (
    <div className="editor-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div></div>
        <Title title="Yadvendra Yadav" />
        <SaveBtn handleSave={handleSave} />
      </div>
      <DraftEditor editorState={editorState} handleChange={handleChange} />
    </div>
  );
}

export default App;
