import {useRouter} from "next/router";
import {Button, Typography} from "@mui/material";
import {useContext, useState} from "react";
import Leaderboard from "../../lib/leaderboard";
import {TeamDeletionRequest} from "../api/teams/delete";
import {TeamCheckInRequest} from "../api/teams/checkin";
import {useTeam} from "../../lib/useTeam";
import {EventInfoContext, EventInfoProvider} from "../../lib/EventInfoContext";
import {EventLocation} from "../api/event/info/[eventCode]";

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
const distanceBetweenCoordinates = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number): number => {
        return value * Math.PI / 180;
    }

    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

const attemptCheckIn = async (setAttempting: (attempting) => void, locations: EventLocation[], teamId: number) => {
    setAttempting(true)

    const checkInHandler = async (currentLocation: GeolocationPosition) => {
        // update what our best guess is
        if (!currentLocation) {
            alert("Unable to get current location")
            setAttempting(false)
            return
        }

        const arrayByClosest = locations
            .map((possible) => (
                {
                    name: possible.name,
                    distance: distanceBetweenCoordinates(
                        currentLocation.coords.latitude,
                        currentLocation.coords.longitude,
                        possible.latitude,
                        possible.longitude)
                }
            ))
            .sort((a, b) => a.distance - b.distance)

        if (arrayByClosest[0].distance > 0.25) {
            alert(`No location within 250m, your closest is ${arrayByClosest[0].name} which is ${arrayByClosest[0].distance}km away`)
            setAttempting(false)
            return
        }

        const res = await fetch("/api/teams/checkin", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                teamId: teamId,
                location: arrayByClosest[0].name
            } as TeamCheckInRequest)
        })

        if (res.status != 200) alert("You have already checked in here!")
        if (res.status == 200) alert(`You have now checked in at ${arrayByClosest[0].name}!`)
        setAttempting(false)
    }

    navigator.geolocation.getCurrentPosition((position) => {
        checkInHandler(position)
    }, () => {
        alert("Unable to get current location")
    })
}

function EventDashboard() {

    const info = useContext(EventInfoContext)
    const {team, updateTeam} = useTeam()
    const router = useRouter()
    const [attemptingCheckin, setAttemptingCheckin] = useState<false>(false)

    const leaveTeam = async () => {
        updateTeam(null)
        await router.push("/")
    }

    const deleteTeam = async () => {
        if (!team) return

        // delete team
        fetch("/api/teams/delete", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {teamId: team!.id!} as TeamDeletionRequest
            )
        })

        await leaveTeam()
    }

    if (!info || team === null) {
        router.push("/")
        return null
    }

    if (team === undefined) return <>loading...</>

    return (
        <>
            <Typography component={"h1"} variant={"h5"} sx={{marginBottom: 4}}>
                {info.name}
            </Typography>

            <Typography component={"h1"} variant={"h5"} sx={{marginBottom: 2}}>Current
                team: <strong>{team.name}</strong>
            </Typography>

            <Button
                variant={"contained"}
                sx={{marginBottom: 2}}
                disabled={attemptingCheckin}
                onClick={() => attemptCheckIn(setAttemptingCheckin, info.locations, team.id)}
            >
                Check in
            </Button>

            <Leaderboard highlightedTeam={team.name} eventCode={info.code}/>

            <Button variant={"outlined"} sx={{marginTop: 2, marginBottom: 2}} onClick={leaveTeam}>Leave team</Button>

            <Button variant={"outlined"} color={"error"} sx={{marginBottom: 2}} onClick={deleteTeam}>
                Delete team
            </Button>
        </>
    )
}

export default function EventDashboardWrapped() {
    return <EventInfoProvider><EventDashboard/></EventInfoProvider>
}
