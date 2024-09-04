import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [downloadCount, setDownloadCount] = useState(0);

    const onFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        axios.post('https://d948-131-72-144-134.ngrok-free.app/upload', formData)
            .then(response => {
                setUploadResponse(response.data);
                fetchDownloadCount(response.data.fileName);
            })
            .catch(error => {
                console.error('Erro ao fazer o upload!', error);
            });
    };

    const fetchDownloadCount = (fileName) => {
        axios.get(`https://d948-131-72-144-134.ngrok-free.app/download-count/${fileName}`)
            .then(response => {
                setDownloadCount(response.data.count);
            })
            .catch(error => {
                console.error('Erro ao buscar o contador de downloads!', error);
            });
    };

    useEffect(() => {
        if (uploadResponse) {
            fetchDownloadCount(uploadResponse.fileName);
        }
    }, [uploadResponse]);

    return (
        <div className="App">
            <h2>Upload de Arquivo</h2>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>Upload</button>
            {uploadResponse && (
                <div>
                    <p>Arquivo salvo como: {uploadResponse.fileName}</p>
                    <p>URL: <a href={`https://d948-131-72-144-134.ngrok-free.app${uploadResponse.url}`} target="_blank" rel="noopener noreferrer">{uploadResponse.url}</a></p>
                    <p>Downloads: {downloadCount}</p>
                </div>
            )}
        </div>
    );
}

export default App;
