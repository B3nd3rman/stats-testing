import { useNavigate } from "@tanstack/react-router";
import NavbarDropdown from "./navbar-dropdown";
import NavSearchbar from "./navbar-searchbar";
import { useSuspenseQuery } from '@tanstack/react-query'
import { getAllTeamData } from '@/queries/getTeamData'
import { getEventData } from '@/queries/getEventData'
import type { Team } from "@/types/Team"
import type { Event } from "@/types/Event"

function Navbar() {
    const navigate = useNavigate({ from: '/teams' })

    const TeamResponse = useSuspenseQuery(getAllTeamData)
    const EventResponse = useSuspenseQuery(getEventData);

    const TeamData: Team[] = TeamResponse.data
    const EventData: Event[] = EventResponse.data

    const handleTeamSearch = (value: string) => {
        navigate({ to: `/teams/${value}` })
    }

    const handleEventSearch = (value: number[]) => {
        var teamList: Team[] = TeamData.filter((team) => {
            return value.includes(team.team_number)
        })

        navigate({to:'/EPA-Compare', state: { teams: teamList }})
    }

    return (
        <div className="flex items-center justify-between p-4 bg-popover text-popover-foreground w-full fixed top-0 left-0 z-50 h-[80px] shadow-sm border-b">
            <div className="flex items-center">
                <NavbarDropdown />
                <a href="https://team24124.github.io" className="size-12 flex items-center justify-center ml-2">
                    <img src="nthsbird.png" alt="logo" className="h-10 w-auto" />
                </a>
            </div>
            <div className="mr-4">
                <NavSearchbar onSelectedTeam={handleTeamSearch} onSelectedEvent={handleEventSearch} teams={TeamData} events={EventData} />
            </div>
        </div>
    );
}

export default Navbar;