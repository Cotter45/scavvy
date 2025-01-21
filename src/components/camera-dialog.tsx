"use client";

import { isMobile } from "react-device-detect";
import { useState, useRef, useEffect } from "react";

import { compressImageToBase64 } from "@/lib/image";
import { Dialog, DialogBody } from "@/components/ui/dialog";

export function CameraDialog({
  isOpen,
  onClose,
  onCapture,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photo: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: isMobile ? { facingMode: { exact: "environment" } } : true,
      });
      setStream(videoStream);
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photoBlob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg")
        );

        if (photoBlob) {
          const photoFile = new File([photoBlob], "captured.jpg", {
            type: "image/jpeg",
          });
          const compressedPhoto = await compressImageToBase64(photoFile);
          onCapture(compressedPhoto); // Pass the compressed photo
        }
      }
    }
    stopCamera();
    onClose();
  };

  if (isOpen && !stream) {
    startCamera();
  }

  if (!isOpen && stream) {
    stopCamera();
  }

  return (
    <Dialog open={isOpen} onClose={onClose} size="lg" className="z-[10000]">
      <DialogBody className="relative flex flex-col items-center p-0 bg-black">
        <video
          ref={videoRef}
          autoPlay
          className="w-full h-auto object-cover"
        ></video>
        <div className="absolute bottom-6 flex items-center justify-center w-full">
          <button
            onClick={capturePhoto}
            className="w-16 h-16 bg-white/70 rounded-full border-4 border-zinc-900/80"
          ></button>
        </div>
      </DialogBody>
    </Dialog>
  );
}
