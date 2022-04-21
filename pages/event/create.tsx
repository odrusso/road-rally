import {Box} from "@mui/system";
import {Button, TextField, Typography} from "@mui/material";
import {FormEvent, useState} from "react";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {EventCreationRequest, EventCreationRequestResponse} from "../api/event/create";
import {Moment} from "moment";
import {useRouter} from "next/router";

export default function CreateEvent() {

    const router = useRouter();
    const [formSubmitting, setFormSubmitting] = useState(false)
    const [startTime, setStartTime] = useState<Moment | null>(null)
    const [errorText, setErrorText] = useState<string | null>(null)

    const createEvent = async (eventName: string, adminCode: string): Promise<EventCreationRequestResponse> => {
        const body: EventCreationRequest = {
            eventName: eventName,
            adminCode: adminCode,
            startTime: startTime.unix() * 1000,
        }

        const request = await fetch("/api/event/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        return await request.json()
    }

    const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault()
        setFormSubmitting(true)
        setErrorText(null)

        const eventName = new FormData(formEvent.currentTarget).get("eventName") as string
        if (!eventName || eventName === "") {
            setErrorText("Event Name cannot be empty")
            setFormSubmitting(false)
            return
        }

        if (!startTime || startTime.isBefore()) {
            setErrorText("Start Time cannot be empty, must be in the future, and can be changed later")
            setFormSubmitting(false)
            return
        }

        const adminCode = new FormData(formEvent.currentTarget).get("adminCode") as string
        if (!adminCode || adminCode === "" || adminCode.length < 4) {
            setErrorText("Password must be at least 4 characters")
            setFormSubmitting(false)
            return
        }

        const eventCode = await createEvent(eventName, adminCode);

        await router.push(`/event/manage?eventCode=${eventCode.eventCode}`)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>

            <Box component={"form"} noValidate onSubmit={handleSubmit}>

                <Typography sx={{color: 'darkgray', marginBottom: 2}}>Create an event.</Typography>

                {errorText && (
                    <Typography sx={{color: 'red', marginBottom: 2}}>{errorText}</Typography>
                )}

                <TextField
                    name={"eventName"}
                    required
                    fullWidth
                    id={"eventName"}
                    label={"Event Name"}
                    autoFocus
                    disabled={formSubmitting}
                >
                </TextField>

                <br/>
                <br/>

                <DateTimePicker
                    label={"Start Time *"}
                    value={startTime}
                    onChange={(v) => setStartTime(v)}
                    renderInput={(params) => <TextField {...params} />}
                    disabled={formSubmitting}
                />

                <br />
                <br />

                <TextField
                    name={"adminCode"}
                    required
                    fullWidth
                    id={"adminCode"}
                    label={"New Password"}
                    disabled={formSubmitting}
                >
                </TextField>

                <Button fullWidth type={'submit'} variant={'contained'} sx={{marginTop: 2}}
                        disabled={formSubmitting}>Create</Button>

            </Box>

        </LocalizationProvider>
    )
}