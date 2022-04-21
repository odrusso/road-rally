import {Box} from "@mui/system";
import {Alert, Button, Typography} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import Countdown from "react-countdown";
import {countdownRenderer} from "../../lib/countdownRenderer";
import {EventInfoContext, EventInfoProvider} from "../../lib/EventInfoContext";
import {useContext} from "react";
import Link from "next/link";


function ManageEvent() {

    const info = useContext(EventInfoContext)

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>

            <Box>
                <Typography
                    sx={{color: 'darkgray', marginBottom: 2}}>Manage {info.name}
                </Typography>

                <Alert severity="success">Your team code is <strong>{info.code}</strong></Alert>

                <br/>

                <Typography>
                    Time until event: &nbsp;
                    <strong><Countdown date={new Date(Number(info.startTime))}
                                       renderer={countdownRenderer}
                                       overtime={true}/>
                    </strong>
                </Typography>

                <Link href={`/event/dashboard?eventCode=${info.code}`}>
                    <Button fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}>
                        Dashboard
                    </Button>
                </Link>

            </Box>

        </LocalizationProvider>

    )
}

export default function ManageEventWrapped() {
    return <EventInfoProvider>
        <ManageEvent/>
    </EventInfoProvider>
}
