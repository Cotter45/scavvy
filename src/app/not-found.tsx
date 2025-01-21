import Image from "next/image";

import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { BackButton } from "@/components/ui/back-button";

export default function NotFound() {
  return (
    <div className="pt-16 p-4 container mx-auto">
      <Image
        priority
        width={800}
        height={800}
        src={"/images/not_found.svg"}
        alt="Not Found"
        className="w-1/2 max-w-md mx-auto"
      />

      <div className="mt-12 text-center">
        <Heading className="!text-5xl">404</Heading>
        <Text className="opacity-70">This page could not be found.</Text>
      </div>

      <div className="mt-12 flex items-center justify-center gap-8">
        <BackButton />
      </div>
    </div>
  );
}
