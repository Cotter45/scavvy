"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GlobeAmericasIcon,
  HomeIcon,
  StarIcon,
} from "@heroicons/react/20/solid";

import { uuid } from "@/lib/uuid";
import { speak } from "@/lib/speak";
import { Button } from "./ui/button";
import { Subheading } from "./ui/heading";
import { usePersistantStore } from "@/lib/store";
import { Dialog, DialogActions, DialogBody } from "./ui/dialog";

export function NewGameModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const allItems = usePersistantStore((state) => state.allItems);
  const setActiveGame = usePersistantStore((state) => state.setActiveGame);

  const [numItems, setNumItems] = useState(10);
  const [location, setLocation] = useState<"inside" | "outside">("inside");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );

  const requestCameraPermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your device does not support camera access.");
      return false;
    }

    try {
      const result = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use rear camera if available
      });

      console.log("Camera permission granted");

      // Stop the camera stream immediately after testing permissions
      result.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error", err);

        if (err.name === "NotAllowedError") {
          alert(
            "Camera access is blocked. Please enable it in your browser settings."
          );
        } else if (err.name === "NotFoundError") {
          alert("No camera found on this device.");
        } else {
          alert("An unexpected error occurred: " + err.message);
        }
        return false;
      }

      console.error("Camera permission denied", err);
      return false;
    }
  };

  const createGame = async () => {
    const cameraGranted = await requestCameraPermission();
    if (!cameraGranted) {
      alert("Camera permission is required to play this game.");
      setIsOpen(false);
      return;
    }

    const items = allItems
      .filter(
        (item) => item.difficulty === difficulty && item.location === location
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, numItems);

    setActiveGame({
      id: uuid(),
      location: "outside",
      difficulty,
      date: new Date().toISOString(),
      items: items.map((item) => ({
        ...item,
        found: false,
      })),
    });

    router.push("/hunt");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={setIsOpen} size="2xl">
      <DialogBody className="sm:max-w-md mx-auto">
        <Subheading>Location</Subheading>
        <div className="flex justify-center p-6 gap-8">
          <Button
            color={location === "inside" ? "emerald" : "zinc"}
            onClick={() => {
              setLocation("inside");
              speak({ text: "Inside game" });
            }}
            className="mr-2"
          >
            <HomeIcon className="!size-12" />
          </Button>

          <Button
            color={location === "outside" ? "emerald" : "zinc"}
            onClick={() => {
              setLocation("outside");
              speak({ text: "Outside game" });
            }}
            className="mr-2"
          >
            <GlobeAmericasIcon className="!size-12" />
          </Button>
        </div>

        <Subheading>Difficulty</Subheading>
        <div className="flex justify-center p-6 gap-8">
          <Button
            color={difficulty === "easy" ? "emerald" : "zinc"}
            onClick={() => {
              setDifficulty("easy");
              speak({ text: "Easy difficulty" });
            }}
            className="mr-2"
          >
            <StarIcon className="!size-8" />
          </Button>

          <Button
            color={difficulty === "medium" ? "amber" : "zinc"}
            onClick={() => {
              setDifficulty("medium");
              speak({ text: "Medium difficulty" });
            }}
            className="mr-2"
          >
            <StarIcon className="!size-8" />
            <StarIcon className="!size-8" />
          </Button>

          <Button
            color={difficulty === "hard" ? "red" : "zinc"}
            onClick={() => {
              setDifficulty("hard");
              speak({ text: "Hard difficulty" });
            }}
            className="mr-2"
          >
            <StarIcon className="!size-8" />
            <StarIcon className="!size-8" />
            <StarIcon className="!size-8" />
          </Button>
        </div>

        <Subheading>Items</Subheading>
        <div className="flex justify-center p-6 gap-8">
          <Button
            color={numItems === 5 ? "emerald" : "zinc"}
            onClick={() => {
              setNumItems(5);
              speak({ text: "5 items" });
            }}
            className="mr-2 !text-3xl"
          >
            5
          </Button>
          <Button
            color={numItems === 10 ? "emerald" : "zinc"}
            onClick={() => {
              setNumItems(10);
              speak({ text: "10 items" });
            }}
            className="mr-2 !text-3xl"
          >
            10
          </Button>
          <Button
            color={numItems === 15 ? "emerald" : "zinc"}
            onClick={() => {
              setNumItems(15);
              speak({ text: "15 items" });
            }}
            className="mr-2 !text-3xl"
          >
            15
          </Button>
        </div>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button color="emerald" onClick={createGame}>
          Start Game
        </Button>
      </DialogActions>
    </Dialog>
  );
}
