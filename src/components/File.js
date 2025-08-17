import React from 'react'
import initialData from '../utils/initialData'
import FileList from './FileList';

function File() {
  return (
    <div className='layout-row justify-content-between'>
        <ul data-testid="files">
           <FileList />
        </ul>
        <input data-testid="input-box" className='mt-15 mr-35 w-15' style={{borderColor: "black"}} type="text" placeholder='Enter an item' value="Filename" />
    </div>
  )
}

export default File