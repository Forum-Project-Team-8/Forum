// import React, { useState } from 'react';

// function FileUpload() {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState('');

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         setSelectedFile(file);
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setPreviewUrl(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleUpload = () => {
//         if (selectedFile) {
//             console.log('Uploading file:', selectedFile);
//             // Your upload logic
//         } else {
//             console.error('No file selected.');
//         }
//     };

//     return (
//         <div>
//             <input type="file" onChange={handleFileChange} />
//             <button onClick={handleUpload}>Upload</button>

//             {previewUrl && (
//                 <div>
//                     <h2>Preview:</h2>
//                     <img src={previewUrl} alt="Preview" style={{ maxWidth: '5%' }} />
//                 </div>
//             )}
//         </div>
//     );
// }

// export default FileUpload;

import React, { useState } from 'react';

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
                onUpload(reader.result); // Pass the dataURL to the onUpload function
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
                    <img src={previewUrl} alt="Preview" style={{ maxWidth: '5%' }} />
                </div>
            )}
        </div>
    );
}

export default FileUpload;

