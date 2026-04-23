import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Forms';
import { FileText, Upload, MoreVertical, Eye, Download, Trash2 } from 'lucide-react';

export const CandidateCVManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cvs, setCvs] = useState([
    { id: 1, name: 'Frontend_Developer_CV_2026.pdf', date: 'Oct 21, 2026', size: '2.4 MB', isDefault: true },
    { id: 2, name: 'John_Doe_Resume_Alt.pdf', date: 'Sep 15, 2026', size: '1.8 MB', isDefault: false },
  ]);

  const handleDelete = (id) => {
    setCvs(cvs.filter(cv => cv.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">CV Management</h1>
          <p className="text-slate-500 mt-1">Upload and manage your resumes to apply for jobs quickly.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex text-sm"><Upload className="h-4 w-4 mr-2" /> Upload New CV</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cvs.map((cv) => (
          <Card key={cv.id} className="relative group border-2 hover:border-[var(--color-primary-light)] transition-all">
            {cv.isDefault && (
              <div className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg rounded-tr-lg z-10">
                Default
              </div>
            )}
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-slate-800 truncate w-full mb-1" title={cv.name}>{cv.name}</h3>
              <p className="text-xs text-slate-500 mb-6">Uploaded {cv.date} • {cv.size}</p>
              
              <div className="flex items-center justify-center space-x-2 w-full pt-4 border-t border-slate-100 opacity-80 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-500 hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-md transition-colors" title="View">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors" title="Download">
                  <Download className="h-4 w-4" />
                </button>
                {!cv.isDefault && (
                  <button 
                    onClick={() => handleDelete(cv.id)}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 focus:outline-none hidden group-hover:block">
              <MoreVertical className="h-5 w-5" />
            </button>
          </Card>
        ))}

        <div 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-[var(--color-primary)] transition-all flex flex-col items-center justify-center cursor-pointer min-h-[220px] text-slate-500 group"
        >
          <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
            <Upload className="h-5 w-5 text-slate-400 group-hover:text-[var(--color-primary)] transition-colors" />
          </div>
          <span className="font-medium text-sm group-hover:text-[var(--color-primary)] transition-colors">Click to upload new CV</span>
          <span className="text-xs mt-1">PDF, DOCX up to 5MB</span>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Upload CV"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Upload File</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[var(--color-primary-light)] bg-blue-50/50 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-[var(--color-primary)] mb-3" />
            <p className="text-sm font-medium text-slate-700 mb-1">Drag and drop your file here</p>
            <p className="text-xs text-slate-500 mb-4">Files supported: PDF, DOC, DOCX. Max size: 5MB</p>
            <Button variant="secondary" size="sm">Browse Files</Button>
          </div>
          
          <Input label="Document Name (Optional)" placeholder="e.g. Designer_Resume_2026" />
        </div>
      </Modal>
    </div>
  );
};
