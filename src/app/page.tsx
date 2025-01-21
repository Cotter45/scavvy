import Image from "next/image";

import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { PreviousGames } from "@/components/previous-games";
import { GetStartedButton } from "@/components/get-started-button";
import { PageContainer } from "@/components/ui/page-container";

export default function Home() {
  return (
    <PageContainer>
      <div className="min-h-[80vh] mx-auto flex flex-col items-center justify-center">
        <Image
          priority
          src="/images/search.svg"
          alt="Search"
          width={800}
          height={600}
          className="max-w-[90dvw] sm:max-w-lg mt-12"
        />

        <div className="flex flex-col items-center">
          <Heading level={1} className="mt-16 !text-5xl">
            Scavvy
          </Heading>
          <Text className="mt-1">
            The accessible scavenger hunt, fun for all ages.
          </Text>

          <div className="mt-8 flex items-center gap-5">
            <GetStartedButton />
          </div>
        </div>
      </div>

      <div className="mt-32" />

      <PreviousGames />
    </PageContainer>
  );
}
