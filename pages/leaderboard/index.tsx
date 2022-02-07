import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useState} from "react";

type Leader = {
    teamName: string,
    currentScore: number
    // Last updated time?
    // last location?
}

type LeadboardProps = {
    highlightedTeam?: string
}

export default function Leaderboard(props: LeadboardProps) {


    const getLeaders = (): Leader[] => {
        // TODO: Have this fetch from an API fr
        const mockLeaders = [
            {teamName: 'big-mac', currentScore: 4},
            {teamName: 'qtr-pndr', currentScore: 3},
        ]
        return mockLeaders
    }

    const [leaders, setLeaders] = useState<Leader[]>(getLeaders())

    const refreshLeaders = () => {
        setLeaders(getLeaders())
    }

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
                        {leaders
                            .sort((a, b) => b.currentScore - a.currentScore) // sorts in desc order
                            .map((leader) => (
                                <TableRow key={leader.teamName}>
                                    {leader.teamName !== props.highlightedTeam ? (<TableCell>{leader.teamName}</TableCell>) : (<TableCell><strong>{leader.teamName}</strong></TableCell>) }
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