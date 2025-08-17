import React from 'react';
import File from './components/File';
import './App.css';

const initialData = {
  "name": "src",
  "isOpen": true,
  "files": [
    {
      "name": "App.js"
    },
    {
      "name": "components",
      "isOpen": false,
      "files": [{ "name": "File.js" }]
    }
  ]
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>File Explorer Component</h1>
      </header>
      <main>
        <File 
          files={initialData.files} 
          input-box={true}
        />
      </main>
    </div>
  );
}

export default App;