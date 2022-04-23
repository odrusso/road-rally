import {Box} from "@mui/system";
import {Button, TextField, Typography} from "@mui/material";
import {FormEvent, useContext, useState} from "react";
import {useRouter} from "next/router";
import {EventInfoContext, EventInfoProvider} from "../../lib/EventInfoContext";
import {useTeam} from "../../lib/useTeam";
import {TeamCreationRequest, TeamCreationRequestResponse} from "../api/teams/create";
import Link from "next/link";

function JoinEventTeam() {

    const info = useContext(EventInfoContext)
    const {updateTeam} = useTeam()
    const [formSubmitting, setFormSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    const createTeam = async (teamName: string): Promise<number> => {
        const response = await fetch("/api/teams/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamName: teamName,
                eventCode: info.code
            } as TeamCreationRequest)
        })

        if (response.status !== 200) {
            console.error(response)
            setError("Cannot join team")
            setFormSubmitting(false)
            return
        }

        const responseBody = await response.json() as TeamCreationRequestResponse
        return responseBody.teamId
    }

    const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
        setFormSubmitting(true)
        setError(null)
        formEvent.preventDefault()

        const teamName = new FormData(formEvent.currentTarget).get("teamName") as string
        const teamId = await createTeam(teamName)

        updateTeam({name: teamName, id: teamId})

        router.push(`/event/dashboard?eventCode=${info.code}`)
    }

    return (
        <Box component={"form"} noValidate onSubmit={handleSubmit}>

            <Typography sx={{color: 'darkgray', marginBottom: 2}}>Pick a name, and make it good.</Typography>

            {error && (
                <Typography sx={{color: 'red', marginBottom: 2}}>{error}</Typography>
            )}

            <TextField
                name={"teamName"}
                required
                fullWidth
                id={"teamName"}
                label={"Team Name"}
                autoFocus
                disabled={formSubmitting}
            >
            </TextField>

            <Button fullWidth type={'submit'} variant={'contained'} sx={{marginTop: 2}}
                    disabled={formSubmitting}>Go</Button>
        </Box>
    )
}

export default function JoinEventTeamWrapped() {
    return <EventInfoProvider><JoinEventTeam/></EventInfoProvider>
}
