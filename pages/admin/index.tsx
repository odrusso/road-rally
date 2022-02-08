import {Button, TextField, Typography} from "@mui/material";
import Link from 'next/link'
import React, {ChangeEventHandler, useRef, useState} from "react";

export default function Admin() {

    const [password, setPassword] = useState<string>("")
    const [buttonEnabled, setButtonEnabled] = useState(true)

    const resetDatabase = () => {
        setButtonEnabled(false)

        if (password === "") {
            alert("You've gotta enter a password u numpty")
            setButtonEnabled(true)
            return
        }

        fetch("/api/admin/reset", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: password})
        }).then((res) => {
            if (res.status != 200) {
                console.error(res)
                alert("Something went wrong, sorry.")
            } else {
                alert("Success, DB was reset. Check the leaderboard.")
            }
            setButtonEnabled(true)
        })

    }

    return (
        <>
            <Typography component={"h1"} variant={"h5"} sx={{marginBottom: 4}}>
                🛠 Admin 🛠
            </Typography>

            <TextField
                name={"password"}
                required
                fullWidth
                id={"password"}
                label={"Admin Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
            >
            </TextField>

            <Button fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2}}
                    onClick={resetDatabase}
                    disabled={!buttonEnabled}
            >
                Reset DB
            </Button>

        </>
    )
}
