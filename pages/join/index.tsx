import {Box} from "@mui/system";
import {Button, TextField, Typography} from "@mui/material";
import {FormEvent, useState} from "react";
import {useRouter} from "next/router";
import {TeamCreationRequest} from "../api/teams/create";

export default function Join() {

    const [formSubmitting, setFormSubmitting] = useState(false)

    const router = useRouter()

    const createTeam = (teamName: string) => {
        fetch("/api/teams/create", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamName: teamName
            })
        })
    }

    const handleSubmit = (formEvent: FormEvent<HTMLFormElement>) => {
        setFormSubmitting(true)
        formEvent.preventDefault()
        const teamName = new FormData(formEvent.currentTarget).get("teamName") as string
        createTeam(teamName)
        setFormSubmitting(false)
        localStorage.setItem("teamName", teamName)
        router.push("/dashboard")
    }

    return (
        <Box component={"form"} noValidate onSubmit={handleSubmit}>

            <Typography sx={{color: 'darkgray', marginBottom: 2}}>Pick a name, and make it good.</Typography>

            <TextField
                name={"teamName"}
                required
                fullWidth
                id={"teamName"}
                label={"Team Name"}
                autoFocus
            >
            </TextField>

            <Button fullWidth type={'submit'} variant={'contained'} sx={{marginTop: 2}}
                    disabled={formSubmitting}>Go</Button>
        </Box>
    )
}