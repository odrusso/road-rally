import {Box} from "@mui/system";
import {
    Alert,
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import Countdown from "react-countdown";
import {countdownRenderer} from "../../lib/countdownRenderer";
import {EventInfoContext, EventInfoProvider} from "../../lib/EventInfoContext";
import {FormEvent, useContext, useState} from "react";
import Link from "next/link";
import {EventLocation} from "../api/event/info/[eventCode]";
import {LocationRemoveRequest} from "../api/event/delete-location";
import {EventCreationRequest} from "../api/event/create";
import {LocationCreationRequest} from "../api/event/create-location";

type LocationsTableProps = {
    locations: EventLocation[]
    removeLocation: (locationId: number) => void
}

const LocationsTable = (props: LocationsTableProps) => {
    return (
        <>
            <Typography component={"h1"} variant={"h5"} sx={{marginTop: 4}}>
                Event Locations:
            </Typography>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell>Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.locations.map((location) => (
                            <TableRow key={location.id}>
                                <TableCell><strong>{location.name}</strong></TableCell>
                                <TableCell>{location.longitude}</TableCell>
                                <TableCell>{location.latitude}</TableCell>
                                <TableCell>
                                    <Button fullWidth
                                            variant="outlined"
                                            color={"error"}
                                            sx={{mt: 3, mb: 2}}
                                            onClick={() => props.removeLocation(location.id)}>
                                        -
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

type CreateLocationDialog = {
    dialogOpen: boolean,
    setDialogOpen: (open: boolean) => void,
    eventId: number,
    onSuccess: () => void
}

export const validLong = (value: string): boolean => {
    let valueAsNumber;
    try {
        valueAsNumber = Number(value)
    } catch (e) {
        return false
    }

    return valueAsNumber >= -90 && valueAsNumber <= 90

}

export const validLat = (value: string): boolean => {
    let valueAsNumber;
    try {
        valueAsNumber = Number(value)
    } catch (e) {
        return false
    }

    return valueAsNumber >= -180 && valueAsNumber <= 180

}

const CreateLocationDialog = (props: CreateLocationDialog) => {

    const [submitting, setSubmitting] = useState<boolean>(false)
    const [errorText, setErrorText] = useState<string | null>(null)

    const createLocation = async (name: string, long: number, lat: number) => {
        const body: LocationCreationRequest = {
            name: name,
            eventId: props.eventId,
            longitude: long,
            latitude: lat
        }

        const request = await fetch("/api/event/create-location", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        return request.status === 200;
    }

    const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault()
        setSubmitting(true)
        setErrorText(null)

        const locationName = new FormData(formEvent.currentTarget).get("locationName") as string
        if (!locationName || locationName === "") {
            setErrorText("Location Name cannot be empty")
            setSubmitting(false)
            return
        }

        const longitude = new FormData(formEvent.currentTarget).get("locationLong") as string
        if (!longitude || longitude === "" || !validLong(longitude)) {
            setErrorText("Invalid longitude, bust be between -90 and 90")
            setSubmitting(false)
            return
        }

        const latitude = new FormData(formEvent.currentTarget).get("locationLat") as string
        if (!latitude || latitude === "" || !validLat(latitude)) {
            setErrorText("Invalid longitude, bust be between -180 and 180")
            setSubmitting(false)
            return
        }

        const success = await createLocation(locationName, Number(longitude), Number(latitude))

        if (!success) {
            setSubmitting(false)
            setErrorText("Unable to create event")
            return
        }

        setErrorText(null)
        setSubmitting(false)
        props.onSuccess()
        props.setDialogOpen(false)
    }

    return (
        <Dialog
            open={props.dialogOpen}
            onClose={() => props.setDialogOpen(false)}
            component={"form"}
            // @ts-ignore
            onSubmit={handleSubmit}
        >
            <DialogTitle>Create Location</DialogTitle>

            <DialogContent>

                {errorText && (
                    <Typography sx={{color: 'red', marginBottom: 2}}>{errorText}</Typography>
                )}

                <TextField
                    name={"locationName"}
                    required
                    fullWidth
                    id={"locationName"}
                    label={"Location Name"}
                    disabled={submitting}
                />

                <br/><br/>

                <TextField
                    name={"locationLong"}
                    required
                    fullWidth
                    id={"locationLong"}
                    label={"Longitude"}
                    disabled={submitting}
                />

                <br/><br/>

                <TextField
                    name={"locationLat"}
                    required
                    fullWidth
                    id={"locationLat"}
                    label={"Latitude"}
                    disabled={submitting}
                />

                <br/><br/>

            </DialogContent>

            <DialogActions>
                <Button
                    color={"error"}
                    disabled={submitting}
                    onClick={() => {
                        props.setDialogOpen(false)
                    }}>
                    Close
                </Button>
                <Button
                    color={"primary"}
                    disabled={submitting}
                    type={'submit'}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}

function ManageEvent() {

    const info = useContext(EventInfoContext)

    const [createLocationModalOpen, setCreateLocationModalOpen] = useState<boolean>(false)

    const removeLocation = async (locationId: number) => {
        await fetch("/api/event/delete-location", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {locationId} as LocationRemoveRequest
            )
        })

        await info.reloadInfo()
    }

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>

            <CreateLocationDialog
                dialogOpen={createLocationModalOpen}
                setDialogOpen={setCreateLocationModalOpen}
                eventId={info.id}
                onSuccess={info.reloadInfo}
            />

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

                <LocationsTable locations={info.locations} removeLocation={removeLocation}/>

                <Button fullWidth
                        variant="contained"
                        color={"success"}
                        sx={{mt: 3, mb: 2}}
                        onClick={() => setCreateLocationModalOpen(true)}>
                    Add Event
                </Button>

                <Link href={`/event/landing?eventCode=${info.code}`}>
                    <Button fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}>
                        Event Landing Page
                    </Button>
                </Link>

                <Button fullWidth
                        variant="contained"
                        color={"secondary"}
                        sx={{mt: 3, mb: 2}}
                        onClick={info.reloadInfo}>
                    Refresh
                </Button>

            </Box>

        </LocalizationProvider>
    )
}

export default function ManageEventWrapped() {
    return <EventInfoProvider><ManageEvent/></EventInfoProvider>
}
