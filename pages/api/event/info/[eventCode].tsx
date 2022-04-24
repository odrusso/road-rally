import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../../lib/db";

export type EventLocation = {
    id: number,
    name: string,
    latitude: number,
    longitude: number
}

export type EventInfoResponse = {
    id: number
    code: string
    startTime: string
    name: string
    locations: EventLocation[]
}

const getEventInfo = async (eventCode: string): Promise<EventInfoResponse | null> => {
    const eventQuery = await query(`SELECT id, name, code, start_time FROM event WHERE code = $1`, [eventCode])
    if (eventQuery.rowCount !== 1) return null

    const event = eventQuery.rows[0]

    const locationsQuery = await query(`SELECT id, name, longitude, latitude FROM locations WHERE event_id = $1`, [event.id])

    return {
        id: event.id,
        code: event.code,
        name: event.name,
        startTime: event.start_time,
        locations: locationsQuery.rows
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<EventInfoResponse>) {
    const { eventCode } = req.query

    console.log(`Handling event info request for ${eventCode}`)

    const info = await getEventInfo(eventCode as string)

    if (!info) return res.status(400).end()

    return res.status(200).json(info)
}
