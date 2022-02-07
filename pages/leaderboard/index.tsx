import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useState} from "react";
import useSWR from "swr";

export type Leader = {
    teamName: string,
    currentScore: number
    // Last updated time?
    // last location?
}

type LeadboardProps = {
    highlightedTeam?: string
}

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Leaderboard(props: LeadboardProps) {

    const leaderboardData = useSWR('/api/leaderboard', fetcher, { refreshInterval: 1000 });

    const refreshLeaders = () => {
        leaderboardData.mutate()
    }

    if (leaderboardData === undefined || !leaderboardData.data) {
        return <>loading...</>
    }

    console.log(leaderboardData.data)

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Team</TableCell>
                            <TableCell>Score</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboardData.data
                            .sort((a, b) => b.currentScore - a.currentScore) // sorts in desc order
                            .map((leader) => (
                                <TableRow key={leader.teamName}>
                                    {leader.teamName !== props.highlightedTeam ? (
                                        <TableCell>{leader.teamName}</TableCell>) : (
                                        <TableCell><strong>{leader.teamName}</strong></TableCell>)}
                                    <TableCell>{leader.currentScore}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button variant={'outlined'} onClick={refreshLeaders} sx={{marginTop: 2}}>
                Refresh
            </Button>
        </>
    )
}