import {Box} from "@mui/system";
import {Typography} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import Countdown from "react-countdown";
import {countdownRenderer} from "../../lib/countdownRenderer";
import {EventInfoContext, EventInfoProvider} from "../../lib/EventInfoContext";
import {useContext} from "react";


function ManageEvent() {

    const info = useContext(EventInfoContext)

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>

            <Box>
                <Typography
                    sx={{color: 'darkgray', marginBottom: 2}}>Manage {info.name}</Typography>

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

export default function ManageEventWrapped() {
    return <EventInfoProvider>
        <ManageEvent/>
    </EventInfoProvider>
}
