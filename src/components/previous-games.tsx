"use client";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";

import { usePersistantStore } from "@/lib/store";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "./ui/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

export function PreviousGames() {
  const router = useRouter();

  const previousGames = usePersistantStore((state) => state.previousGames);
  const setActiveGame = usePersistantStore((state) => state.setActiveGame);
  const removePreviousGame = usePersistantStore(
    (state) => state.removePreviousGame
  );

  if (!previousGames.length) {
    return null;
  }

  console.log(previousGames);

  return (
    <div className="mt-12">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Location</TableHeader>
            <TableHeader>Difficulty</TableHeader>
            <TableHeader>Completed</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {previousGames.map((game) => (
            <TableRow key={game.id}>
              <TableCell>
                {game.location[0].toUpperCase() + game.location.slice(1)}
              </TableCell>
              <TableCell>
                {game.difficulty === "easy" ? (
                  <Badge color="emerald">Easy</Badge>
                ) : null}
                {game.difficulty === "medium" ? (
                  <Badge color="amber">Medium</Badge>
                ) : null}
                {game.difficulty === "hard" ? (
                  <Badge color="red">Hard</Badge>
                ) : null}
              </TableCell>
              <TableCell>
                {game.items.every((item) => item.found) ? (
                  <Badge color="emerald">Yes</Badge>
                ) : (
                  <Badge color="red">No</Badge>
                )}
              </TableCell>
              <TableCell>{format(new Date(game.date), "MM/dd/yyyy")}</TableCell>
              <TableCell>
                <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                  <Dropdown>
                    <DropdownButton plain aria-label="More options">
                      <EllipsisHorizontalIcon />
                    </DropdownButton>
                    <DropdownMenu anchor="bottom end">
                      <DropdownItem
                        onClick={() => {
                          setActiveGame(game);
                          router.push("/hunt");
                        }}
                      >
                        Resume
                      </DropdownItem>
                      <DropdownItem onClick={() => removePreviousGame(game)}>
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
