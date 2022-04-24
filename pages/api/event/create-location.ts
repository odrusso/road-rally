import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../lib/db"

export type LocationCreationRequest = {
    name: string,
    eventId: number,
    longitude: number,
    latitude: number
}

const createLocation = async (name: string, eventId: number, longitude: number, latitude: number) => {
    console.log(`Create location ${name} on event ${eventId} at long:${longitude} lat:${latitude}`)

    const creation = await query(`INSERT INTO locations (event_id, name, longitude, latitude) VALUES ($1, $2, $3, $4)`, [eventId, name, longitude, latitude])
    return creation.rowCount
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {name, eventId, longitude, latitude} = req.body as LocationCreationRequest

    console.log(`Handling location creation request for ${name}`)

    if (!name || eventId === null || !longitude || !latitude) res.status(400).end()

    await createLocation(name, eventId, longitude, latitude)

    return res.status(200).end()
}
