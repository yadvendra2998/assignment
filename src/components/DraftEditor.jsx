import { Editor, EditorState, Modifier, RichUtils } from "draft-js";
import React from "react";
import "draft-js/dist/Draft.css";

const customStyleMap = {
  RED: {
    color: "red",
    textDecoration: "none",
  },
  UNDERLINE: {
    textDecoration: "underline",
  },
};
const DraftEditor = ({ editorState, handleChange }) => {
  const handleKeyCommand = (command) => {
    console.log("comman", command);
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (chars) => {
    console.log("chars",chars)
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();
  
    if (chars === " ") {
      if (blockText.startsWith("#")) {
        // Remove `#` and apply heading style
        const updatedContent = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          blockText.substring(1).trim() // Strip '#'
        );
        const newEditorState = EditorState.push(
          editorState,
          updatedContent,
          "remove-range"
        );
        const headingState = RichUtils.toggleBlockType(
          newEditorState,
          "header-one"
        );
        handleChange(headingState);
        return "handled";
      }
  
      if (blockText.startsWith("*") && !blockText.startsWith("**")) {
        console.log("chars",chars)
        // Remove `*` and apply bold style
        const updatedContent = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          blockText.substring(1).trim() // Strip '*'
        );
        const newEditorState = EditorState.push(
          editorState,
          updatedContent,
          "remove-range"
        );
        const boldState = RichUtils.toggleInlineStyle(newEditorState, "BOLD");
        handleChange(boldState);
        return "handled";
      }
  
      if (blockText.startsWith("**") && !blockText.startsWith("***")) {
        console.log("chars",chars)
        // Remove `**` and apply red style
        const updatedContent = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          blockText.substring(2).trim() // Strip '**'
        );
        const newEditorState = EditorState.push(
          editorState,
          updatedContent,
          "remove-range"
        );
        const redState = RichUtils.toggleInlineStyle(newEditorState, "RED");
        handleChange(redState);
        return "handled";
      }
  
      if (blockText.startsWith("***")) {
        console.log("chars",chars)
        // Replace '***' and apply underline style
        const updatedContent = Modifier.replaceText(
          currentContent,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 3, // Remove '***'
          }),
          blockText.substring(3).trim() // Remove '***' and trim
        );
  
        // Create a new editor state with updated content
        const newEditorState = EditorState.push(
          editorState,
          updatedContent,
          "remove-range"
        );
  
        // Apply UNDERLINE style from the start of the block
        const underlineSelection = newEditorState.getSelection().merge({
          anchorOffset: 0,
          focusOffset: updatedContent.getBlockForKey(selection.getStartKey()).getText().length, // Select remaining text
        });
  
        const underlineState = RichUtils.toggleInlineStyle(
          EditorState.forceSelection(newEditorState, underlineSelection),
          "UNDERLINE"
        );
  
        handleChange(underlineState);
        return "handled";
      }
    }
  
    return "not-handled";
  };
  

  const handleReturn = (e) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    // Step 1: Split the current block into two blocks
    const newContent = Modifier.splitBlock(currentContent, selection);
    
    // Step 2: Push the new content state after splitting the block
    let newEditorState = EditorState.push(
      editorState,
      newContent,
      "split-block"
    );

    // Step 3: Remove all inline styles for the new block to avoid carrying over previous formatting
    newEditorState = EditorState.setInlineStyleOverride(
      newEditorState,
      new Set()
    );

    // Step 4: Reset block type to 'unstyled' to prevent carrying over any block styles (e.g., heading, list)
    newEditorState = RichUtils.toggleBlockType(newEditorState, "unstyled");
    // Step 5: Force the selection to the new block and set the cursor position at the beginning
    const newSelection = newEditorState.getSelection();
    const updatedSelection = newSelection.merge({
      anchorOffset: 0,
      focusOffset: 0,
    });

    // Step 6: Update the editor state with the correct cursor and block type
    newEditorState = EditorState.setInlineStyleOverride(
      newEditorState,
      updatedSelection
    );

    // Step 7: Update the editor state
    handleChange(newEditorState);

    return "handled";
  };

  return (
    <div className="editor">
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={handleChange}
        placeholder="Start Typing using #,*,** and ***"
        handleReturn={handleReturn}
        handleBeforeInput={handleBeforeInput}
        customStyleMap={customStyleMap}
      />
    </div>
  );
};

export default DraftEditor;
