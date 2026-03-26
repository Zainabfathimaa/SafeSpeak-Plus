import React, { useState } from 'react';
import { Upload, Link as LinkIcon, X, Eye } from 'lucide-react';
import toastService from '../../services/toastService';

export function Step3Evidence({ formData, updateFormData }) {
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (formData.files.length + files.length > 5) {
            toastService.error("You can only upload up to 5 files.");
            return;
        }

        const newFiles = [];
        let loadedCount = 0;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newFiles.push({
                    fileName: file.name,
                    fileType: file.type,
                    fileUrl: reader.result, // Base64 string
                    size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
                });
                loadedCount++;
                if (loadedCount === files.length) {
                    updateFormData({
                        files: [...formData.files, ...newFiles]
                    });
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (index) => {
        const newFiles = [...formData.files];
        newFiles.splice(index, 1);
        updateFormData({ files: newFiles });
    };

    const previewEvidence = (fileUrl) => {
        // Open file in new tab (works well for images and PDFs in base64 format)
        try {
            const win = window.open();
            if (win) {
                if (fileUrl.startsWith('data:application/pdf')) {
                    win.document.write('<iframe src="' + fileUrl + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                } else if (fileUrl.startsWith('data:image')) {
                    win.document.write('<img src="' + fileUrl + '" style="max-width: 100%; height: auto;" />');
                } else {
                    win.document.write('<p>Preview temporarily unavailable for this file type. However, the file is securely attached.</p>');
                }
            } else {
                toastService.error("Please allow popups to preview evidence.");
            }
        } catch (e) {
            toastService.error("Could not preview file. It may be too large for the browser to render inline.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Evidence (Optional)</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input
                    type="file"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                    accept="image/*,application/pdf"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                        <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium text-text-primary">Click to upload or drag and drop</p>
                    <p className="text-sm text-text-secondary">SVG, PNG, JPG or PDF. Max 5 files.</p>
                </div>
            </div>

            {formData.files.length > 0 && (
                <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium text-text-secondary mb-2">Attached Files ({formData.files.length}/5)</p>
                    {formData.files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <div className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => previewEvidence(file.fileUrl)} title="Preview File">
                                    <Eye className="w-4 h-4 text-primary" />
                                </div>
                                <div className="truncate cursor-pointer hover:text-primary transition-colors" onClick={() => previewEvidence(file.fileUrl)}>
                                    <p className="text-sm font-medium text-text-primary truncate" title={file.fileName}>{file.fileName}</p>
                                    <p className="text-xs text-text-secondary">{file.size}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFile(idx)}
                                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                title="Remove File"
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
