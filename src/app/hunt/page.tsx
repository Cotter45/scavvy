"use client";

import clsx from "clsx";
import Confetti from "react-confetti";
import { useScreen } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CameraIcon } from "@heroicons/react/20/solid";

import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { usePersistantStore } from "@/lib/store";
import { Heading } from "@/components/ui/heading";
import { SpeakButton } from "@/components/speak-button";
import { BackButton } from "@/components/ui/back-button";
import { CameraDialog } from "@/components/camera-dialog";
import { NewGameModal } from "@/components/new-game-modal";
import { PageContainer } from "@/components/ui/page-container";
import { Dialog, DialogActions, DialogBody } from "@/components/ui/dialog";

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
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

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

  const handlePhotoCapture = (photo: string) => {
    if (selectedItemId) {
      addItemPhoto(selectedItemId, photo);
      markItemFound(selectedItemId);
    }
  };

  return (
    <PageContainer>
      <BackButton />

      <div className="flex flex-col items-center gap-4">
        <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
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
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setCameraDialogOpen(true);
                  }}
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
      <CameraDialog
        isOpen={cameraDialogOpen}
        onClose={() => setCameraDialogOpen(false)}
        onCapture={handlePhotoCapture}
      />
    </PageContainer>
  );
}
