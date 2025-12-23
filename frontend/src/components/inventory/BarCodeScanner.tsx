import React, { useState, useEffect } from 'react';
// @ts-ignore - react-qr-reader types may not be available
import { QrReader } from 'react-qr-reader';
import '../../assets/style/inventory/barcodeScanner.css';
import { inventoryService } from '../../services/api/inventoryService';
interface BarCodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (data: { medicineId: string; medicineName: string; groupId: string }) => void;
}

const BarCodeScanner: React.FC<BarCodeScannerProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Request camera permission
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then(() => {
          setHasPermission(true);
          setError(null);
        })
        .catch((err) => {
          setHasPermission(false);
          setError('Permission denied');
          console.error('Camera permission error:', err);
        });
    } else {
      // Reset state when modal closes
      setHasPermission(null);
      setError(null);
      setScannedData(null);
      setScanning(true);
    }
  }, [isOpen]);

  const handleScan = (result: any, error: any) => {
    if (error) {
      console.error('QR Scanner error:', error);
      setError('Scanner Error');
      return;
    }

    if (result && result.text) {
      setScannedData(result.text);
      setScanning(false);
      if (onScanSuccess) {
        onScanSuccess(result.text);
      }
      // Auto close after successful scan (optional)
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleImageUpload = async () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        setIsProcessing(true);
        setError(null);
        setScanning(false);
        
        try {
          // Call backend to scan barcode image
          const result = await inventoryService.scanBarcode(file);
          
          setScannedData(`Found: ${result.medicineName}`);
          
          // Call success callback with medicine info
          if (onScanSuccess) {
            onScanSuccess(result);
          }
          
          // Auto close after successful scan (navigation will happen via callback)
          setTimeout(() => {
            onClose();
          }, 500);
        } catch (err: any) {
          console.error('Barcode scan error:', err);
          setError(err.message || 'Failed to scan barcode image. No matching medicine found.');
          setScanning(true);
        } finally {
          setIsProcessing(false);
        }
      }
    };
    input.click();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="scanner-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="scanner-modal">
        {/* Header */}
        <div className="scanner-header">
          <button className="header-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button className="header-btn menu-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button className="header-btn" onClick={handleImageUpload}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </button>
        </div>

        {/* Title Section */}
        <div className="scanner-title-section">
          <h2 className="scanner-title">QR Code Scanner</h2>
          <p className="scanner-subtitle">Scan any QR code to get started</p>
        </div>

        {/* Scanner Area */}
        <div className="scanner-area">
          {hasPermission === true && scanning && (
            <div className="scanner-viewfinder">
              <QrReader
                onResult={handleScan}
                constraints={{ facingMode: 'environment' }}
                containerStyle={{ width: '100%', height: '100%' }}
                videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                scanDelay={300}
              />
              <div className="scan-line"></div>
            </div>
          )}
          {hasPermission === false && (
            <div className="scanner-placeholder">
              <p>Camera permission required</p>
            </div>
          )}
          {hasPermission === null && (
            <div className="scanner-placeholder">
              <p>Requesting camera access...</p>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="scanner-status">
          <div className="status-indicator"></div>
          <span className="status-text">
            {isProcessing ? 'Processing image...' : scannedData ? 'Scan successful!' : scanning ? 'Ready to scan' : 'Scanning...'}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="scanner-error">
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <div className="error-content">
              <div className="error-title">Scanner Error</div>
              <div className="error-message">{error}</div>
            </div>
          </div>
        )}

        {/* Scanned Data Display (optional) */}
        {scannedData && (
          <div className="scanned-data">
            <p>Scanned: {scannedData}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default BarCodeScanner;

