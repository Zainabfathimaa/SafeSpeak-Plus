import React from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';

export function Step3Evidence({ formData, updateFormData }) {
    // Mock file upload handler for visual purposes
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateFormData({
                    files: [
                        ...formData.files,
                        {
                            fileName: file.name,
                            fileType: file.type,
                            fileUrl: reader.result, // Base64 string
                            size: (file.size / 1024).toFixed(1) + ' KB'
                        }
                    ]
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = (index) => {
        const newFiles = [...formData.files];
        newFiles.splice(index, 1);
        updateFormData({ files: newFiles });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Evidence (Optional)</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                        <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium text-text-primary">Click to upload or drag and drop</p>
                    <p className="text-sm text-text-secondary">SVG, PNG, JPG or GIF (max. 3MB)</p>
                </div>
            </div>

            {formData.files.length > 0 && (
                <div className="space-y-2">
                    {formData.files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-100 rounded">
                                    <LinkIcon className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{file.fileName}</p>
                                    <p className="text-xs text-text-secondary">{file.size}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(idx)}
                                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
