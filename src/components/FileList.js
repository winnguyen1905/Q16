import React from 'react';

function FileData() {
    return (
      <>
        <li>
        <button
        >
          public<span>[+]</span>
        </button>
      </li>
      <li>
          <button
          >
            node_modules<span>[+]</span>
          </button>
        </li>
      <li>
        <button
        >
          src<span>[+]</span>
        </button>
      </li>
      <li>
        <button
        >
          Git<span>[+]</span>
        </button>
      </li>
      </>
    );
  }

function FileList() {
    return (
        <ul>
        <FileData />
      <li>
        <button>+</button>
    </li>
    </ul>
  )
}

export default FileList;