"use client";

import clsx from "clsx";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useIntersectionObserver } from "usehooks-ts";

import { Button } from "./button";
import { Dialog, DialogActions, DialogBody } from "./dialog";

export function Image({
  src,
  alt,
  className,
  containerClassName,
  modal = true,
  width,
  height,
  animate = true,
  deletePhoto,
}: {
  src: string;
  alt: string | undefined;
  className: string;
  containerClassName?: string;
  modal?: boolean;
  width?: string | number;
  height?: string | number;
  animate?: boolean;
  deletePhoto?: () => void;
}) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.99,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [objectUrl] = useState(() => {
    if (src.startsWith("blob:")) return src;
    return undefined;
  });

  useEffect(() => {
    if (objectUrl && !src.startsWith("blob:")) URL.revokeObjectURL(objectUrl);
  }, [objectUrl, src]);

  return (
    <>
      <div
        className={clsx("overflow-hidden rounded-lg", containerClassName)}
        onClick={() => modal && setIsOpen(true)}
      >
        <NextImage
          ref={ref}
          alt={alt || ""}
          width={Number(width) || 400}
          height={Number(height) || 400}
          className={clsx(
            "block object-cover object-center filter transition-all duration-300 hover:filter-none",
            animate ? "grayscale" : "filter-none",
            animate && isIntersecting ? "filter-none" : "grayscale",
            className,
            modal ? "cursor-pointer" : "cursor-default"
          )}
          src={src}
        />
      </div>

      <Dialog open={isOpen} onClose={setIsOpen} size="5xl">
        <DialogActions className="-mt-6 mb-6 relative">
          <Button
            plain
            onClick={() => setIsOpen(false)}
            className="md:absolute md:right-0 -top-5 md:-top-10 z-[1000]"
          >
            <XMarkIcon className="h-6 w-6 text-zinc-950" />
            <span className="md:sr-only">Close</span>
          </Button>

          {deletePhoto && (
            <Button
              color="red"
              onClick={deletePhoto}
              className="md:absolute md:left-0 -top-5 md:-top-10 z-[1000]"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
              <span>Delete</span>
            </Button>
          )}
        </DialogActions>

        <DialogBody className="!mt-0">
          <NextImage
            src={src}
            alt={alt || ""}
            width={1200}
            height={800}
            className="h-[80dvh] min-h-[80dvh] w-full object-contain rounded-md bg-zinc-950/80"
          />
        </DialogBody>
      </Dialog>
    </>
  );
}
