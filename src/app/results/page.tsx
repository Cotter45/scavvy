"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { usePersistantStore } from "@/lib/store";
import { Heading } from "@/components/ui/heading";
import { SpeakButton } from "@/components/speak-button";
import { BackButton } from "@/components/ui/back-button";
import { NewGameModal } from "@/components/new-game-modal";
import { PageContainer } from "@/components/ui/page-container";

export default function Page() {
  const activeGame = usePersistantStore((state) => state.activeGame);
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

  return (
    <PageContainer>
      <BackButton />

      <div className="flex flex-col items-center gap-4">
        <div className="mt-12 w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                />
              ) : null}
              <span className="flex items-center gap-2">
                {item.name}
                <SpeakButton text={item.name} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
