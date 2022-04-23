import {useCallback, useEffect, useState} from "react";

export type Team = {
    name: string,
    id: number
}

export const useTeam = () => {
    // Undefined indicates still loading, null means no team set
    const [team, setTeam] = useState<Team | null | undefined>(undefined)

    const updateTeam = useCallback((team: Team | null) => {

        if (team === null) {
            localStorage.removeItem("teamName")
            localStorage.removeItem("teamId")
            setTeam(null)
            return
        }

        localStorage.setItem("teamName", team.name)
        localStorage.setItem("teamId", String(team.id))
        setTeam({name: team.name, id: team.id})
    }, [])

    useEffect(() => {
        const teamName = localStorage.getItem("teamName")
        const teamId = localStorage.getItem("teamId")

        if (!teamName || !teamId) return

        setTeam({name: teamName, id: Number(teamId)})
    }, [])

    return {team, updateTeam}
}
