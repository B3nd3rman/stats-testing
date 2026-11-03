import type { Team } from "@/types/Team";
import { Command as CommandPrimitive } from "cmdk";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import type { Event } from "@/types/Event"
import { useLocation } from '@tanstack/react-router'

type Props = {
    onSelectedTeam: (inputValue: string) => void;
    onSelectedEvent: (inputValue: string) => void;
    teams: Team[];
    events: Event[];
    isLoading?: boolean;
    emptyMessage?: string;
    placeholder?: string;
};

function NavSearchbar({
    onSelectedTeam,
    onSelectedEvent,
    teams,
    events,
    isLoading,
    emptyMessage = "No teams found.",
    placeholder = "Search for team/event",
}: Props) {

    const [open, setOpen] = useState(false);
    const [searchValue, onSearchValueChange] = useState('')


    const reset = () => {
        onSearchValueChange("");
    };

    const onSelectTeam = (inputValue: string) => {
        onSelectedTeam(inputValue)
        setOpen(false);
        reset();
    };

    const onSelectEvent = (inputValue: string) => {
        onSelectedEvent(inputValue)
        setOpen(false);
        reset();
    };

    const location = useLocation()

    if(location.pathname === "/EPA-Compare" || location.pathname === "/OPR-Compare") {
      return (
          <div className="h-12 mx-4 w-[200px] mt-[15px]">
              <Popover open={open} onOpenChange={setOpen}>
                  <Command shouldFilter={false}>
                      <PopoverTrigger>
                          <div className="relative w-full">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                              <Input value={searchValue} onChange={(e) => onSearchValueChange(e.target.value)} placeholder={"Search for team"} className="h-12 pl-10"/>
                          </div>
                      </PopoverTrigger>
                      {!open && <CommandList aria-hidden="true" className="hidden" />}
                      <PopoverContent
                          asChild
                          onOpenAutoFocus={(e) => e.preventDefault()}
                          onInteractOutside={(e) => {
                              if (
                                  e.target instanceof Element &&
                                  e.target.hasAttribute("cmdk-input")
                              ) {
                                  e.preventDefault();
                              }
                          }}
                          className=" p-0" //w-[--radix-popover-trigger-width]
                      >
                          <CommandList>
                              {isLoading && (
                                  <CommandPrimitive.Loading>
                                      <div className="p-1">
                                          <Skeleton className="h-12" />
                                      </div>
                                  </CommandPrimitive.Loading>
                              )}
                              {teams.length > 0 && !isLoading ? (
                                  <CommandGroup>
                                      {teams
                                          .filter((team) => team.team_number.toString().includes(searchValue) || team.team_name.toLowerCase().includes(searchValue.toLowerCase())) // Filter for relevant searches
                                          .sort((a, b) => {
                                              var numA = a.team_number;
                                              var numB = b.team_number;

                                              var nameA = a.team_name.toLowerCase();
                                              var nameB = b.team_name.toLowerCase();

                                              var nameSearch = false;

                                              // Checks if there are any letters in the search, and sorts based on name instead of number
                                              if(searchValue.toUpperCase() != searchValue.toLowerCase()) nameSearch = true;

                                              // Filters first for teams that start with the number searched, and then numerically
                                              let startsWithA;
                                              let startsWithB;
                                              if(nameSearch) {
                                                  startsWithA = nameA.startsWith(searchValue.toLowerCase());
                                                  startsWithB = nameB.startsWith(searchValue.toLowerCase());
                                              } else {
                                                  startsWithA = numA.toString().startsWith(searchValue);
                                                  startsWithB = numB.toString().startsWith(searchValue);
                                              }

                                              if(startsWithA && !startsWithB) return -1;
                                              if(!startsWithA && startsWithB) return 1;

                                              if(nameSearch){
                                                  const array = [numA,numB].sort();
                                                  if(array[0] == numA) return -1;
                                                  return 1;
                                              }
                                              return numA - numB;
                                          })
                                          .slice(0, 80) // Get first 80 elements
                                          .map((option) => ( // Map them onto an element

                                              <CommandItem
                                                  key={option.team_number}
                                                  value={option.team_number.toString()}
                                                  onMouseDown={(e) => e.preventDefault()}
                                                  onSelect={onSelectTeam}
                                              >
                                                  <div className="font-bold text-base">{option.team_number}</div> {option.team_name}
                                              </CommandItem>
                                          ))}
                                  </CommandGroup>
                              ) : null}
                              {!isLoading ? (
                                  <CommandEmpty>{emptyMessage ?? "No items."}</CommandEmpty>
                              ) : null}
                          </CommandList>
                      </PopoverContent>
                  </Command>
              </Popover>
          </div>
      )
    }

    return (
        <div className="h-12 mx-4 w-[200px] mt-[15px]">
            <Popover open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <PopoverTrigger>
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input value={searchValue} onChange={(e) => onSearchValueChange(e.target.value)} placeholder={placeholder} className="h-12 pl-10"/>
                        </div>
                    </PopoverTrigger>
                    {!open && <CommandList aria-hidden="true" className="hidden" />}
                    <PopoverContent
                        asChild
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                            if (
                                e.target instanceof Element &&
                                e.target.hasAttribute("cmdk-input")
                            ) {
                                e.preventDefault();
                            }
                        }}
                        className=" p-0" //w-[--radix-popover-trigger-width]
                    >
                        <CommandList>
                            {isLoading && (
                                <CommandPrimitive.Loading>
                                    <div className="p-1">
                                        <Skeleton className="h-12" />
                                    </div>
                                </CommandPrimitive.Loading>
                            )}
                            {teams.length > 0 && !isLoading ? (
                                <CommandGroup>
                                    {teams
                                        .filter((team) => team.team_number.toString().includes(searchValue) || team.team_name.toLowerCase().includes(searchValue.toLowerCase())) // Filter for relevant searches
                                        .sort((a, b) => {
                                            var numA = a.team_number;
                                            var numB = b.team_number;

                                            var nameA = a.team_name.toLowerCase();
                                            var nameB = b.team_name.toLowerCase();

                                            var nameSearch = false;

                                            // Checks if there are any letters in the search, and sorts based on name instead of number
                                            if(searchValue.toUpperCase() != searchValue.toLowerCase()) nameSearch = true;

                                            // Filters first for teams that start with the number searched, and then numerically
                                            let startsWithA;
                                            let startsWithB;
                                            if(nameSearch) {
                                                startsWithA = nameA.startsWith(searchValue.toLowerCase());
                                                startsWithB = nameB.startsWith(searchValue.toLowerCase());
                                            } else {
                                                startsWithA = numA.toString().startsWith(searchValue);
                                                startsWithB = numB.toString().startsWith(searchValue);
                                            }

                                            if(startsWithA && !startsWithB) return -1;
                                            if(!startsWithA && startsWithB) return 1;

                                            if(nameSearch){
                                                const array = [numA,numB].sort();
                                                if(array[0] == numA) return -1;
                                                return 1;
                                            }
                                            return numA - numB;
                                        })
                                        .slice(0, 80) // Get first 80 elements
                                        .map((option) => ( // Map them onto an element

                                            <CommandItem
                                                key={option.team_number}
                                                value={option.team_number.toString()}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onSelect={onSelectTeam}
                                            >
                                                <div className="font-bold text-base">{option.team_number}</div> {option.team_name}
                                            </CommandItem>
                                        ))}

                                    {events
                                        .filter((event) => event.event_name.toLowerCase().includes(searchValue.toLowerCase()) || event.event_code.toLowerCase().includes(searchValue.toLowerCase())) // Filter for relevant searches
                                        .sort((a, b) => {
                                            var nameA = a.event_name.toLowerCase();
                                            var nameB = b.event_name.toLowerCase();

                                            var startsWithA = nameA.startsWith(searchValue.toLowerCase());
                                            var startsWithB = nameB.startsWith(searchValue.toLowerCase());

                                            if(startsWithA && !startsWithB) return -1;
                                            if(!startsWithA && startsWithB) return 1;

                                            const array = [nameA,nameB].sort();
                                            if(array[0] == nameA) return -1;
                                            return 1;
                                        })
                                        .slice(0, 80) // Get first 80 elements
                                        .map((option) => ( // Map them onto an element

                                            <CommandItem
                                                key={option.event_code}
                                                value={option.event_name}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onSelect={() => onSelectEvent(option.team_list)}
                                            >
                                                <div className="font-bold text-base">{option.event_code}</div> {option.event_name}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            ) : null}
                            {!isLoading ? (
                                <CommandEmpty>{emptyMessage ?? "No items."}</CommandEmpty>
                            ) : null}
                        </CommandList>
                    </PopoverContent>
                </Command>
            </Popover>
        </div>
    );
}

export default NavSearchbar;