import {Box} from "@mui/system";
import {Button, TextField, Typography} from "@mui/material";
import {FormEvent, useState} from "react";
import {useRouter} from "next/router";
import {fetchEventInfo} from "../../lib/EventInfoContext";

export default function JoinEvent() {

    const router = useRouter()
    const [formSubmitting, setFormSubmitting] = useState(false)
    const [errorText, setErrorText] = useState<string | null>(null)

    const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault()
        setFormSubmitting(true)
        setErrorText(null)

        const eventCode = new FormData(formEvent.currentTarget).get("eventCode") as string
        if (!eventCode || eventCode === "" || eventCode.length !== 7) {
            setErrorText("Event code must be 7 characters")
            setFormSubmitting(false)
            return
        }

        const eventInfo = await fetchEventInfo(eventCode)

        if (!eventInfo.info) {
            setErrorText(`Cannot find event ${eventCode}`)
            setFormSubmitting(false)
            return
        }

        await router.push(`/event/landing?eventCode=${eventCode}`)
    }

    return (
        <Box component={"form"} noValidate onSubmit={handleSubmit}>

            <Typography sx={{color: 'darkgray', marginBottom: 2}}>Join an event.</Typography>

            {errorText && (
                <Typography sx={{color: 'red', marginBottom: 2}}>{errorText}</Typography>
            )}

            <TextField
                name={"eventCode"}
                required
                fullWidth
                id={"eventCode"}
                label={"Event Code"}
                disabled={formSubmitting}
            >
            </TextField>

            <Button fullWidth type={'submit'} variant={'contained'} sx={{marginTop: 2}}
                    disabled={formSubmitting}>Join</Button>
        </Box>

    )
}