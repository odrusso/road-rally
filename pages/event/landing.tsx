import {Button, Typography} from "@mui/material";
import Link from 'next/link'
import {useContext, useState} from "react";
import Countdown from 'react-countdown';
import {countdownRenderer} from "../../lib/countdownRenderer";
import {EventInfoContext, EventInfoProvider} from "../../lib/EventInfoContext";
import {useTeam} from "../../lib/useTeam";
import {useRouter} from "next/router";

function EventLanding() {

    const info = useContext(EventInfoContext)
    const router = useRouter()
    const {team} = useTeam()
    const [joinEnabled, setJoinEnabled] = useState<Boolean>(true)

    if (!info) router.push("/")

    return (
        <>
            <Typography component={"h1"} variant={"h5"} sx={{marginBottom: 4}}>
                {info.name}
            </Typography>

            <Typography>
                Time until event: &nbsp;
                <strong><Countdown date={new Date(Number(info.startTime))}
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

            {!team && (
                <>
                    <Link href={`/event/join-team?eventCode=${info.code}`}>
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

            {team && (
                <>
                    <Link href={`/event/dashboard?eventCode=${info.code}`}>
                        <Button fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 1}}>
                            Enter {team.name} Dashboard
                        </Button>
                    </Link>
                </>
            )}

        </>
    )
}

export default function EventLandingWrapped() {
    return <EventInfoProvider><EventLanding/></EventInfoProvider>
}
