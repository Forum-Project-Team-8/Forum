import  { useState } from 'react';

function FileUpload({ onUpload }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                onUpload(reader.result); 
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {previewUrl && (
                <div>
                    <h2>Preview:</h2>
                    <img src={previewUrl} alt="Preview" style={{ maxWidth: '25%' }} />
                </div>
            )}
        </div>
    );
}

export default FileUpload;

