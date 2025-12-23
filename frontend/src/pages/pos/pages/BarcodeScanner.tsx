import { useState, useEffect, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import type{ Medicine } from '../types'; // adjust path to where your types.ts is

import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onClose: () => void;
  onScanSuccess: (barcode: string) => void;
  onAddMedicineToCart: (medicine: Medicine) => void;
}

export const BarcodeScanner = ({ onClose, onScanSuccess }: BarcodeScannerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');

        if (videoDevices.length === 0) {
          setHasCamera(false);
          setError('No Camera Found');
          return;
        }

        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        codeReaderRef.current = new BrowserMultiFormatReader();

        codeReaderRef.current.decodeFromVideoElementContinuously(
          videoRef.current!,
          (result, err) => {
            if (result) {
              const code = result.getText();
              setScannedBarcode(code); // ✅ 2. Save scanned barcode to state
              onScanSuccess(result.getText());
              // 5️⃣ OPTIONAL: stop camera after first scan
              stopCamera();
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error('Barcode scan error:', err);
            }
          }
        );

      } catch (err) {
        console.error('Camera error:', err);
        setHasCamera(false);
        setError('No Camera Found');
      }
    };

    startCamera();

   

    const stopCamera = () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset(); // stop scanner
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };

    // return () => {
    //   if (streamRef.current) {
    //     streamRef.current.getTracks().forEach((track) => track.stop());
    //   }
    // };
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const barcode = formData.get('barcode') as string;
    if (barcode) {
      setScannedBarcode(barcode.trim()); // ✅ 3. Update scanned barcode when manual input is used
      onScanSuccess(barcode.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Barcode Scanner</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {hasCamera ? (
          <div className="relative w-full max-w-2xl aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-green-500 rounded-lg"></div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white text-lg font-medium">
                Position barcode within the frame
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-white">
            <Camera className="w-24 h-24 mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold mb-2">No Camera Found</h3>
            <p className="text-gray-400 mb-6">
              Unable to access camera. Please check your device permissions.
            </p>
            {error && (
              <p className="text-red-400 mb-6">{error}</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-4">
      {scannedBarcode && (
          <div className="text-center text-green-400 font-bold mb-4">
            Scanned Barcode: {scannedBarcode}
          </div>
        )}

        <form onSubmit={handleManualInput} className="max-w-md mx-auto">
          <label className="block text-white text-sm font-medium mb-2">
            Or enter barcode manually:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="barcode"
              placeholder="Enter barcode number"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
