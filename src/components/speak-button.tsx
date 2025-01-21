"use client";

import { speak } from "@/lib/speak";
import { Button } from "./ui/button";
import { PlayIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export function SpeakButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const classes = clsx("flex", className);

  return (
    <Button plain onClick={() => speak({ text })} className={classes}>
      <PlayIcon className="w-4 h-4" />
    </Button>
  );
}
