import {useRouter} from "next/router";
import {Button, Dialog, DialogTitle, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Leaderboard from "../leaderboard";
import {Box} from "@mui/system";
import {TeamDeletionRequest} from "../api/teams/delete";
import { TeamCheckInRequest } from "../api/teams/checkin";

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

function CheckInDialog({onClose, open, teamName}) {
    const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null)
    const [bestGuessLocation, setBestGuessLocation] = useState(null)

    const allPossibleLocations = [
        {name: "McDonalds Hornby", lat: -43.54304296870422, long: 172.52214564692252},
        {name: "McDonalds Yaldhurst", lat: -43.51854457053837, long: 172.52655312884866},
        {name: "McDonalds Airport", lat: -43.49190459047476, long: 172.54817077829608},
        {name: "McDonalds Northlands Mall", lat: -43.49393625715611, long: 172.60897226129765},
        {name: "McDonalds Merivale", lat: -43.51122804056383, long: 172.62078650018253},
        {name: "McDonalds Riccarton", lat: -43.53050330422452, long: 172.59575156543735},
        {name: "McDonalds Riccarton Mall", lat: -43.53096216400504, long: 172.59912706226936},
        {name: "McDonalds Hillmorton", lat: -43.55109757133752, long: 172.59884577087882},
        {name: "McDonalds Sydenham", lat: -43.54820032973514, long: 172.63690170119102},
        {name: "McDonalds Moorhouse", lat: -43.54026717232563, long: 172.64327890485848},
        {name: "McDonalds South City", lat: -43.53864293264451, long: 172.63517813260276},
        {name: "McDonalds The Palms", lat: -43.50677399932114, long: 172.66456497650196},
        {name: "McDonalds Marshlands", lat: -43.47663925992795, long: 172.66016987670284},
        {name: "McDonalds Linwood", lat: -43.53352004381354, long: 172.67378606830638},
        {name: "McDonalds Ferry Road", lat: -43.54888740450512, long: 172.68076652096490},
    ]

    // Run every time the modal is opened
    useEffect(() => {
        if (!open) return
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation(position)
        })
    }, [open])

    useEffect(() => {
        // update what our best guess is
        if (!currentLocation) return
        const arrayByClosest = allPossibleLocations
            .map((possible) => (
                {
                    name: possible.name,
                    distance: distanceBetweenCoordinates(
                        currentLocation.coords.latitude,
                        currentLocation.coords.longitude,
                        possible.lat,
                        possible.long)
                }
            ))
            .sort((a, b) => a.distance - b.distance)

        if (arrayByClosest[0].distance > 0.25) {
            alert(`No Maccas within 250m, your closest is ${arrayByClosest[0].name} which is ${arrayByClosest[0].distance}km away`)
            onClose()
        } else {
            alert(`You have now checked in at ${arrayByClosest[0].name}!`)
            fetch("/api/teams/checkin", {
                method: "POST",
                body: JSON.stringify({
                    teamName: teamName,
                    location: arrayByClosest[0].name
                } as TeamCheckInRequest)
            }).then((res) => {
                if (res.status != 200) {
                    alert("You have already checked in here!")
                }
            })
            onClose()
        }
    }, [currentLocation])

    return (
        <Dialog
            onClose={onClose}
            open={open}
            maxWidth={'lg'}
            fullWidth={true}>
            <DialogTitle>Check in</DialogTitle>
            <Box>
                <Typography>Your location: {bestGuessLocation ?? "Waiting..."}</Typography>
            </Box>
        </Dialog>
    )
}

export default function Dashboard() {

    const [teamName, setTeamName] = useState<string | undefined>(undefined)
    const [checkInOpen, setCheckInOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setTeamName(localStorage.getItem("teamName"))
    }, [])

    const leaveTeam = () => {
        localStorage.removeItem("teamName")
        router.push("/")
    }

    const deleteTeam = () => {
        // delete team
        fetch("/api/teams/delete", {
            method: "POST",
            body: JSON.stringify(
                {teamName: teamName} as TeamDeletionRequest
            )
        })
        leaveTeam()
    }

    return (
        <>
            <Typography sx={{marginBottom: 2}}>Current team: {teamName}</Typography>
            <Button variant={"contained"} sx={{marginBottom: 2}} onClick={() => {
                setCheckInOpen(true)
            }}>Check in</Button>
            <Button variant={"outlined"} sx={{marginBottom: 2}} onClick={leaveTeam}>Leave team</Button>
            <Button variant={"outlined"} color={"error"} sx={{marginBottom: 2}} onClick={deleteTeam}>Delete
                team</Button>
            <Leaderboard highlightedTeam={teamName}/>

            <CheckInDialog onClose={() => setCheckInOpen(false)} open={checkInOpen} teamName={teamName}/>
        </>
    )
}
