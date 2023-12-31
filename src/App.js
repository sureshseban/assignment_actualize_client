import { useState, useRef } from 'react';
import * as  XLSX from 'xlsx';

import './App.css';

function App() {

    const [childrensData, setchildrensData] = useState([]);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const inputRef = useRef(null);

    // upload/save child data
    const handleClick = async (e) => {
        if (childrensData.length) {
            setMessage('File Uploading. Please wait!!');
            let result = await fetch("http://localhost:5000/save_children", {
                method: 'post',
                body: JSON.stringify(childrensData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            result = await result.json();
            if (result.error) {
                setIsError(true);
                setMessage(result.error);
            } else {
                setIsError(false);
                setMessage('File uploaded successfully!');
                setchildrensData([]);
                inputRef.current.value = null;
            }

        } else {
            setIsError(true);
            setMessage('Please select your file!!');
        }
    }

    // extracting the excel values
    const handleFileUpload = (e) => {
        setMessage('');
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            setchildrensData(parsedData);
        }
    }

    return (
        <div className="container">
            <input ref={inputRef} type="file" id="myFile" required accept='.xls,.xlsx' onChange={handleFileUpload} name="filename"></input>
            <button onClick={handleClick} >Upload</button>
            <div className="message">
                <span className={isError ? 'error' : 'success'}>{message}</span>
            </div>
        </div>
    );
}

export default App;
