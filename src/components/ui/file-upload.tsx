import { PhotoIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

export function FileUpload({
  handleSubmit,
  accept,
  isUploading,
}: {
  handleSubmit: (files: FileList | null) => void;
  accept?: string;
  currentPhotos: string[];
  isUploading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleSubmit(event.dataTransfer.files);
  };

  return (
    <div
      className="relative col-span-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-zinc-900/25 dark:border-zinc-300/25 px-6 py-10">
        <div className="text-center">
          {isUploading ? (
            <svg
              className="animate-spin h-12 w-12 text-emerald-600 dark:text-emerald-600 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <PhotoIcon
              aria-hidden="true"
              className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700"
            />
          )}
          <div className="mt-4 flex text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-600"
            >
              <button
                onClick={() => inputRef.current?.click()}
                className="px-1"
              >
                Upload a file
              </button>
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        max={5}
        accept={accept}
        onChange={(event) => handleSubmit(event.currentTarget.files)}
      />
    </div>
  );
}
