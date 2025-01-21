"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

import { Button } from "./button";
import { SpeakButton } from "../speak-button";

export function BackButton() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        plain
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Go Back
      </Button>

      <SpeakButton text="Go back" />
    </div>
  );
}
