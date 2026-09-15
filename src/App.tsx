/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ReceiptPreview, ReceiptData } from './components/ReceiptPreview';
import { Download, Share2, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, ImageRun } from 'docx';

export default function App() {
  const [data, setData] = useState<ReceiptData>({
    date: '',
    amount: 5000,
    voucherNo: '2',
    receivedFrom: 'Sub Postmaster, Gooty - 515401',
    onAccountOf: 'Towards Contingent Gardener Allowance for the Month of June 2017 at Gooty SO',
  });
  
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Auto-detect date on mount
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    setData((prev) => ({ ...prev, date: formattedDate }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const generatePDFBlob = async (): Promise<Blob | null> => {
    const element = document.getElementById('printable-receipt');
    if (!element) return null;
    
    const canvas = await html2canvas(element, { 
      scale: 3, // Increase scale for higher quality text rendering
      useCORS: true, 
      backgroundColor: '#ffffff',
      onclone: (document) => {
        // Remove transform scaling from the clone so it doesn't squish the text
        const wrapper = document.getElementById('printable-receipt-wrapper');
        if (wrapper) {
          wrapper.style.transform = 'none';
        }
      }
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    let finalWidth = pageWidth;
    let finalHeight = (imgProps.height * finalWidth) / imgProps.width;
    
    if (finalHeight > pageHeight) {
      finalWidth = (finalWidth * pageHeight) / finalHeight;
      finalHeight = pageHeight;
    }
    
    const xOffset = (pageWidth - finalWidth) / 2;
    pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight, undefined, 'FAST');
    
    return pdf.output('blob');
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const blob = await generatePDFBlob();
      if (!blob) throw new Error('Could not generate PDF');
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ACG-17_Voucher_${data.voucherNo || 'New'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadDoc = async () => {
    const element = document.getElementById('printable-receipt');
    if (!element) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, { 
        scale: 3,
        useCORS: true, 
        backgroundColor: '#ffffff',
        onclone: (document) => {
          const wrapper = document.getElementById('printable-receipt-wrapper');
          if (wrapper) {
            wrapper.style.transform = 'none';
          }
        }
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgArrayBuffer = await (await fetch(imgData)).arrayBuffer();

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                },
              },
            },
            children: [
              new Paragraph({
                spacing: {
                  before: 0,
                  after: 0,
                },
                children: [
                  new ImageRun({
                    data: imgArrayBuffer,
                    type: "png",
                    transformation: {
                      width: 794,
                      height: 1123,
                    },
                  }),
                ],
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ACG-17_Voucher_${data.voucherNo || 'New'}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating DOCX:', error);
      alert('Failed to generate DOCX. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleWhatsAppShare = async () => {
    setIsExporting(true);
    try {
      const blob = await generatePDFBlob();
      if (!blob) throw new Error('Could not generate PDF');

      const file = new File([blob], `ACG-17_Voucher_${data.voucherNo || 'New'}.pdf`, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'India Post A.C.G. 17 Receipt',
          text: 'Here is the generated A.C.G. 17 Receipt.',
        });
      } else {
        // Fallback for desktop/unsupported browsers: generate a generic whatsapp link
        // WhatsApp Web does not accept file sharing via intent, so we tell the user.
        alert('Your browser does not support direct file sharing to WhatsApp. Please use "Export as PDF" and attach it in WhatsApp manually.');
        window.open('https://wa.me/?text=Please%20find%20the%20attached%20India%20Post%20A.C.G.%2017%20Receipt.', '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Ignore abort errors from user cancelling the share dialog
      if ((error as any).name !== 'AbortError') {
         alert('Failed to share PDF. Please download it instead.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar / Form */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col print:hidden h-screen overflow-y-auto">
        {/* India Post Branding Header */}
        <div className="bg-[#ce1126] p-6 text-white border-b-4 border-[#ffc20e]">
          <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
            India Post
          </h2>
          <p className="text-sm text-yellow-100 mt-1 opacity-90">A.C.G.-17 Generator</p>
          <p className="text-xs text-white/80 mt-2 italic">Prepared by Kalandi Charan Sahoo, PA, Dhenkanal RS SO</p>
        </div>
        
        <div className="p-6 space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={data.date.split('-').reverse().join('-')}
              onChange={(e) => {
                const parts = e.target.value.split('-');
                if (parts.length === 3) {
                  const formatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
                  setData((prev) => ({ ...prev, date: formatted }));
                } else {
                  setData((prev) => ({ ...prev, date: e.target.value }));
                }
              }}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ce1126] focus:border-[#ce1126]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Voucher No</label>
            <input
              type="text"
              name="voucherNo"
              value={data.voucherNo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ce1126] focus:border-[#ce1126]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
            <input
              type="number"
              name="amount"
              value={data.amount}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ce1126] focus:border-[#ce1126]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Received from</label>
            <input
              type="text"
              name="receivedFrom"
              value={data.receivedFrom}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ce1126] focus:border-[#ce1126]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">On Account of</label>
            <textarea
              name="onAccountOf"
              value={data.onAccountOf}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#ce1126] focus:border-[#ce1126] resize-none"
            />
          </div>
        </div>

        <div className="p-6 pt-4 border-t bg-gray-50 flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 disabled:opacity-50 font-semibold py-3 rounded flex items-center justify-center gap-1 transition-colors shadow-sm text-sm"
            >
              <Download size={18} className={isExporting ? 'animate-bounce text-[#ce1126]' : 'text-[#ce1126]'} />
              PDF
            </button>
            <button
              onClick={handleDownloadDoc}
              disabled={isExporting}
              className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 disabled:opacity-50 font-semibold py-3 rounded flex items-center justify-center gap-1 transition-colors shadow-sm text-sm"
            >
              <FileText size={18} className={isExporting ? 'animate-bounce text-blue-600' : 'text-blue-600'} />
              DOC
            </button>
            <button
              onClick={handleWhatsAppShare}
              disabled={isExporting}
              className="flex-1 bg-[#25D366] hover:bg-[#20b858] disabled:bg-[#7ce09f] text-white font-semibold py-3 rounded flex items-center justify-center gap-1 transition-colors shadow-sm text-sm"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-full md:w-2/3 lg:w-3/4 p-2 sm:p-4 md:p-8 overflow-y-auto overflow-x-hidden print:p-0 print:m-0 flex flex-col items-center bg-gray-200">
        <div className="w-full max-w-[210mm] mb-4 print:hidden flex justify-between items-center px-2">
          <h2 className="text-gray-500 font-semibold tracking-wide uppercase text-sm">Print Preview (A4)</h2>
        </div>
        
        {/* Responsive scaling container */}
        <div className="w-full max-w-full overflow-x-auto pb-8 flex justify-center">
          <div 
            id="printable-receipt-wrapper"
            className="shadow-2xl print:shadow-none border border-gray-200 print:border-none bg-white origin-top shrink-0" 
            style={{ 
              width: '210mm', 
              minHeight: '297mm',
              // On very small screens, scale it down using CSS transform so it fits in the view without excessive scrolling
              transform: 'scale(var(--preview-scale, 1))',
              marginBottom: 'calc(-297mm * (1 - var(--preview-scale, 1)))' 
            }}
          >
            <style>{`
              @media (max-width: 640px) {
                :root { --preview-scale: 0.45; }
              }
              @media (min-width: 641px) and (max-width: 768px) {
                :root { --preview-scale: 0.6; }
              }
              @media (min-width: 769px) and (max-width: 1024px) {
                :root { --preview-scale: 0.8; }
              }
              @media (min-width: 1025px) {
                :root { --preview-scale: 1; }
              }
              @media print {
                :root { --preview-scale: 1 !important; }
                body { margin: 0; padding: 0; }
              }
            `}</style>
            <ReceiptPreview data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
