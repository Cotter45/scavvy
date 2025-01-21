"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useScreen } from "usehooks-ts";
import { isMobile } from "react-device-detect";
import { CameraIcon } from "@heroicons/react/20/solid";

import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { usePersistantStore } from "@/lib/store";
import { Heading } from "@/components/ui/heading";
import { compressImageToBase64 } from "@/lib/image";
import { SpeakButton } from "@/components/speak-button";
import { BackButton } from "@/components/ui/back-button";
import { NewGameModal } from "@/components/new-game-modal";
import { PageContainer } from "@/components/ui/page-container";
import { Dialog, DialogActions, DialogBody } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function Page() {
  const screen = useScreen();
  const router = useRouter();

  const activeGame = usePersistantStore((state) => state.activeGame);
  const addItemPhoto = usePersistantStore((state) => state.addItemPhoto);
  const markItemFound = usePersistantStore((state) => state.markItemFound);
  const deleteItemPhoto = usePersistantStore((state) => state.deleteItemPhoto);
  const updatePreviousGame = usePersistantStore(
    (state) => state.updatePreviousGame
  );

  const items = activeGame?.items || [];

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (activeGame && items.every((item) => item.found)) {
      updatePreviousGame(activeGame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGame]);

  if (!activeGame) {
    return (
      <PageContainer>
        <div className="min-h-[80dvh] flex flex-col items-center justify-center gap-3">
          <Heading>No active game</Heading>
          <Button color="emerald" onClick={() => setIsOpen(true)}>
            New Game
          </Button>
        </div>

        <NewGameModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </PageContainer>
    );
  }

  const handleCapturePhoto = async (itemId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isMobile ? { facingMode: { exact: "environment" } } : true,
      });

      const video = document.createElement("video");
      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
      await new Promise((resolve) => setTimeout(resolve, 250));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas context is null");
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to Blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );

      // Stop the video stream
      stream.getTracks().forEach((track) => track.stop());

      if (blob instanceof Blob) {
        const file = new File([blob], "captured.jpg", { type: "image/jpeg" });

        // Compress and convert to Base64
        const compressedBase64 = await compressImageToBase64(file);

        // Update the item's photo
        addItemPhoto(itemId, compressedBase64);
        markItemFound(itemId);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  return (
    <PageContainer>
      <BackButton />

      <div className="flex flex-col items-center gap-4">
        <Heading>Items</Heading>

        <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={clsx(
                "col-span-1 flex flex-col items-center gap-2 p-4 rounded-lg bg-white shadow-md dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
                item.found
                  ? "!bg-emerald-500/15 !border-emerald-100 dark:!bg-emerald-500/10 dark:!border-emerald-800"
                  : "border-zinc-200 dark:border-zinc-800"
              )}
            >
              {item.photo ? (
                <Image
                  src={item.photo}
                  alt={item.name}
                  className="size-20 mx-auto"
                  deletePhoto={() => {
                    deleteItemPhoto(item.id);
                    markItemFound(item.id);
                  }}
                />
              ) : (
                <Button
                  plain
                  className="mx-auto"
                  onClick={() => handleCapturePhoto(item.id)}
                >
                  <CameraIcon className="!size-14" />
                </Button>
              )}
              <span className="flex items-center gap-2">
                {item.name}
                <SpeakButton text={item.name} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {items.every((item) => item.found) && (
        <>
          <Confetti width={screen.width} height={screen.height} />

          <Dialog
            open={true}
            onClose={() => {}}
            size="2xl"
            className="z-[10000]"
          >
            <DialogBody>
              <div className="flex flex-col items-center gap-6 p-8">
                <Heading>Congratulations!!</Heading>
              </div>
            </DialogBody>

            <DialogActions>
              <Button color="emerald" onClick={() => setIsOpen(true)}>
                New Game
              </Button>

              <Button onClick={() => router.push("/")}>Home</Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      <NewGameModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </PageContainer>
  );
}
