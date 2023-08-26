import { useState } from 'react';
import * as  XLSX from 'xlsx';
import './App.css';

function App() {

    const [childrensData, setchildrensData] = useState([]);

    // upload/save child data
    const handleClick = async (e) => {
        if (childrensData.length) {
            let result = await fetch("http://localhost:5000/save_children", {
                method: 'post',
                body: JSON.stringify(childrensData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            result = await result.json();
            console.log(result);
        } else {
            console.log('Please select your file!!');
        }
    }

    // extracting the excel values
    const handleFileUpload = (e) => {
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
            <input type="file" id="myFile" required accept='.xls,.xlsx' onChange={handleFileUpload} name="filename"></input>
            <button onClick={handleClick} >Upload</button>
        </div>
    );
}

export default App;
