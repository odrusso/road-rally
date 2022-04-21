import {Box} from "@mui/system";
import {Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {EventInfoResponse} from "../../api/event/info/[eventCode]";
import {useRouter} from "next/dist/client/router";
import Countdown from "react-countdown";
import {countdownRenderer} from "../../index";

export default function ManageEvent() {

    const router = useRouter()

    const [info, setInfo] = useState<EventInfoResponse | null>(null)

    const loadEventInfo = async () => {
        const {eventCode} = router.query

        const request = await fetch(`/api/event/info/${eventCode}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        })

        // TODO Better error states
        if (request.status !== 200) throw Error("Could not load event info")

        setInfo(await request.json())
    }

    useEffect(() => {
        if (!router.isReady) return
        loadEventInfo().catch(console.error)
    }, [router.isReady])

    if (!info) {
        return <>loading...</>
    }

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>

            <Box>
                <Typography sx={{color: 'darkgray', marginBottom: 2}}>Manage {info.name}</Typography>

                <Typography>
                    Time until event: &nbsp;
                    <strong><Countdown date={new Date(Number(info.startTime))}
                                       renderer={countdownRenderer}
                                       overtime={true}/>
                    </strong>
                </Typography>

            </Box>

        </LocalizationProvider>
    )
}