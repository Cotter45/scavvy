"use client";

import { useState } from "react";

import { Button } from "./ui/button";
import { NewGameModal } from "./new-game-modal";

export function GetStartedButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        color="emerald"
        onClick={() => setIsOpen(true)}
        className="!px-12"
      >
        Get Started
      </Button>

      <NewGameModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
