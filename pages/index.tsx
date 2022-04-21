import {Button, Typography} from "@mui/material";
import Link from 'next/link'
import {useEffect, useState} from "react";
import Countdown from 'react-countdown';

export const countdownRenderer = ({days, hours, minutes, seconds, completed}) => {
    return <span>{completed ? '-' : ''}{days}d {hours}h {minutes}m {seconds}s</span>;
};

export default function Home() {

    const [teamName, setTeamName] = useState<string | null>(null)
    const [startOfEventTime] = useState(Date.parse('16 Apr 2022 09:30:00'))
    const [joinEnabled, setJoinEnabled] = useState<Boolean>(false)

    useEffect(() => {
        setTeamName(localStorage.getItem("teamName"))
    }, [])

    return (
        <>
            <Typography component={"h1"} variant={"h5"} sx={{marginBottom: 4}}>
                🍔 Maccas Road Rally 2022 🍔
            </Typography>

            <Typography>
                Time until event: &nbsp;
                <strong><Countdown date={startOfEventTime}
                                   renderer={countdownRenderer}
                                   onComplete={() => setJoinEnabled(true)}/>
                </strong>
            </Typography>

            <Link href={"/leaderboard"}>
                <Button fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}>
                    Leaderboard
                </Button>
            </Link>

            {teamName === null && (
                <>
                    <Link href={'/join-team'}>
                        <Button fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 1}}
                                disabled={!joinEnabled}>
                            Join as team
                        </Button>
                    </Link>

                    <Typography sx={{color: 'darkgray'}}>
                        Only one device per team should join at a time
                    </Typography>
                </>
            )}

            {teamName !== null && (
                <>
                    <Link href={'/dashboard'}>
                        <Button fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 1}}>
                            Enter {teamName} Dashboard
                        </Button>
                    </Link>
                </>
            )}

        </>
    )
}
