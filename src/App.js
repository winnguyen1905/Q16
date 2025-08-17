import React from 'react';
import './App.css';
import 'h8k-components';
import File from "./components/File";

const title = "File Folder Structure";

const App = () => {
    return (
        <div className="App">
            <h8k-navbar header={title}></h8k-navbar>
            <File />
        </div>
    );
}

export default App;
