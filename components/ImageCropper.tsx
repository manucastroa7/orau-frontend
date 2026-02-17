import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/canvasUtils';
import { Slider } from 'lucide-react';

interface ImageCropperProps {
    imageSrc: string;
    onCropComplete: (croppedBlob: Blob) => void;
    onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc, croppedAreaPixels, onCropComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl overflow-hidden w-full max-w-2xl flex flex-col h-[90vh]">
                <div className="p-4 border-b border-zinc-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-zinc-800">Ajustar Imagen</h3>
                    <button onClick={onCancel} className="text-zinc-500 hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="relative flex-1 bg-zinc-900">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={4 / 5}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={onZoomChange}
                    />
                </div>

                <div className="p-6 bg-white space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => {
                                setZoom(Number(e.target.value))
                            }}
                            className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-3 border border-zinc-200 text-zinc-600 font-medium rounded-lg hover:bg-zinc-50 transition-colors uppercase text-xs tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={showCroppedImage}
                            className="flex-1 py-3 bg-zinc-900 text-white font-bold rounded-lg hover:bg-black transition-colors uppercase text-xs tracking-widest shadow-lg"
                        >
                            Confirmar & Subir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
