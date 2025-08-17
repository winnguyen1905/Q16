import React, { useState } from 'react';
import FileList from './FileList';
import './File.css';

const File = ({ files: initialFiles, 'input-box': inputBoxProp }) => {
  const [files, setFiles] = useState(initialFiles || []);
  
  // Stata for the input box value
  const [inputValue, setInputValue] = useState('');
  
  // State fỏ showing validation messages
  const [showMessage, setShowMessage] = useState(false);

  // Function to add new file/folder
  const handleAddItem = () => {
    if (inputValue.trim() === '') {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    const newItem = {
      name: inputValue.trim()
    };

    setFiles(prevFiles => [...prevFiles, newItem]);
    setInputValue('');
    setShowMessage(false);
  };

  const updateItem = (path, updatedItem) => {
    setFiles(prevFiles => updateItemRecursively(prevFiles, path, updatedItem));
  };

  const updateItemRecursively = (items, path, updatedItem) => {
    if (path.length === 1) {
      return items.map((item, index) => 
        index === path[0] ? updatedItem : item
      );
    }

    return items.map((item, index) => {
      if (index === path[0]) {
        return {
          ...item,
          files: updateItemRecursively(item.files || [], path.slice(1), updatedItem)
        };
      }
      return item;
    });
  };

  // handle inputr changing
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle Enter key press```
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div className="file-explorer">
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter file or folder name"
          className="file-input"
        />
        <button onClick={handleAddItem} className="add-button">
          +
        </button>
      </div>
      
      {showMessage && (
        <div className="message">
          Please enter a name
        </div>
      )}
      
      <div className="file-tree">
        <FileList 
          files={files} 
          onUpdateItem={updateItem}
          basePath={[]}
        />
      </div>
    </div>
  );
};

export default File;