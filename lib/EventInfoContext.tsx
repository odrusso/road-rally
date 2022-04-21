import {createContext, useEffect, useState} from "react";
import {useRouter} from "next/dist/client/router";
import {EventInfoResponse} from "../pages/api/event/info/[eventCode]";
import {Button} from "@mui/material";
import Link from "next/link";

export async function fetchEventInfo(eventCode: string): Promise<{ status: number, info: EventInfoResponse | null }> {
    const request = await fetch(`/api/event/info/${eventCode}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })

    if (request.status != 200) return {status: request.status, info: null}

    const info = await request.json() as EventInfoResponse

    return {status: 200, info}
}

export const EventInfoContext = createContext(null);

export function EventInfoProvider({children}) {
    const router = useRouter()

    const [info, setInfo] = useState<EventInfoResponse | null>(null)

    const [error, setError] = useState<string | null>(null)

    const loadEventInfo = async () => {
        const {eventCode} = router.query

        const request = await fetchEventInfo(eventCode as string)

        if (request.status !== 200) {
            setError("Couldn't load event info")
        }

        setInfo(request.info)
    }

    useEffect(() => {
        if (!router.isReady) return
        loadEventInfo().catch(console.error)
    }, [router.isReady])

    if (error) {
        return <>
            Could not load event info for {router.query.eventCode}
            <Link href={"/"}>
                <Button fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}>
                    Back to homepahe
                </Button>
            </Link>
        </>
    }

    if (!info) {
        return <>loading...</>
    }

    return <EventInfoContext.Provider value={info}>{children}</EventInfoContext.Provider>
}
