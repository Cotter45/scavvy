import { UserCircleIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

import { Description, Field, Label } from "./fieldset";
import { Image } from "./image";
import { Input } from "./input";
import { Button } from "./button";

export function AvatarUpload({
  handleSubmit,
  accept,
  currentPhoto,
  isUploading,
  showLabel = true,
}: {
  handleSubmit: (files: FileList | null) => void;
  accept?: string;
  currentPhoto?: string;
  isUploading?: boolean;
  showLabel?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Field>
        <Label htmlFor="avatar">{showLabel ? "Avatar" : ""}</Label>
        {showLabel ? <Description>Upload a new avatar.</Description> : null}
        <Input
          ref={inputRef}
          id="avatar"
          type="file"
          accept={accept}
          onChange={(event) => handleSubmit(event.currentTarget.files)}
          className="hidden"
        />
      </Field>
      <div className="mt-2 flex items-center gap-x-4 sm:ml-auto">
        {currentPhoto ? (
          <Image src={currentPhoto} alt="" className="h-16 w-16 rounded-full" />
        ) : (
          <UserCircleIcon
            aria-hidden="true"
            className="h-16 w-16 text-zinc-300"
          />
        )}
        <Button
          onClick={() => {
            inputRef.current?.click();
          }}
          color="white"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : currentPhoto ? "Change" : "Upload"}
        </Button>
      </div>
    </>
  );
}
