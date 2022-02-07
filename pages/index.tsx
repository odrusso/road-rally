import {Button, Typography} from "@mui/material";
import Link from 'next/link'
import {useEffect, useState} from "react";

export default function Home() {

    const [teamName, setTeamName] = useState<string | null>(null)

    useEffect(() => {
        setTeamName(localStorage.getItem("teamName"))
    }, [])

    return (
        <>
            <Typography component={"h1"} variant={"h5"} sx={{marginBottom: 4}}>
                🍔 Maccas Road Rally 2022 🍔
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
                    <Link href={'/join'}>
                        <Button fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 1}}>
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
