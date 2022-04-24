import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useEffect, useState} from "react";
import {LeaderboardRequest} from "../pages/api/leaderboard";

export type Leader = {
    teamName: string,
    currentScore: number
    recentTime: number
    // last location?
}

type LeadboardProps = {
    eventCode: string,
    highlightedTeam?: string,
}

export const millisInOneHour = 1000 * 60 * 60
export const millisInOneMinute = 1000 * 60
export const millisInOneSecond = 1000

const timeDeltaString = (previousTime: number, currentTime: number = new Date().getTime()): string => {

    const timeDeltaMillis = currentTime - previousTime

    const deltaHours = Math.floor(timeDeltaMillis / millisInOneHour)
    const remainderAfterHoursRemoved = timeDeltaMillis - (deltaHours * millisInOneHour)

    const deltaMinutes = Math.floor(remainderAfterHoursRemoved / millisInOneMinute)
    const reminderAfterMinutesRemoved = remainderAfterHoursRemoved - (deltaMinutes * millisInOneMinute)

    const deltaSeconds = Math.floor(reminderAfterMinutesRemoved / millisInOneSecond)

    const hoursString = deltaHours == 0 ? `` : `${deltaHours}h `
    const minutesString = deltaMinutes == 0 ? `` : `${deltaMinutes}m `
    const secondString = deltaSeconds == 0 ? `` : `${deltaSeconds}s`

    return hoursString + minutesString + secondString
}


export default function Leaderboard(props: LeadboardProps) {

    const [leaderboardData, setLeaderboardData] = useState<Leader[] | null>(null)

    const updateLeaderboard = async () => {
        const response = await fetch("/api/leaderboard", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventCode: props.eventCode,
            } as LeaderboardRequest)
        })

        const json = await response.json() as Leader[]
        setLeaderboardData(json)
    }

    useEffect(() => {
        // Immediately fetch and update the leaderboard
        updateLeaderboard()

        // Refresh the leaderboard every second
        const interval = setInterval(() => {
            updateLeaderboard()
        }, 5000);

        // Stop this interval when component is unmounted
        return () => clearInterval(interval);
    }, [])

    if (!leaderboardData) {
        return <>loading...</>
    }

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Team</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Last Check In</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboardData
                            .sort((a, b) => b.currentScore - a.currentScore) // sorts in desc order
                            .map((leader: Leader) => (
                                <TableRow key={leader.teamName}>
                                    {leader.teamName !== props.highlightedTeam ? (
                                        <TableCell>{leader.teamName}</TableCell>) : (
                                        <TableCell><strong>{leader.teamName}</strong></TableCell>)}
                                    <TableCell>{leader.currentScore}</TableCell>
                                    <TableCell>{timeDeltaString(leader.recentTime)}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
