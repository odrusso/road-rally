import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../lib/db"

export type EventCreationRequest = {
    eventName: string,
    adminId: number,
    startTime: number
}

export type EventCreationRequestResponse = {
    eventCode: string
}

const generateEventCode = () => {
    let result = '';
    const characters = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const createEvent = async (eventName: string, code: string, adminId: number, startTime: number) => {
    const creation = await query(`INSERT INTO event ("name", "code", "admin_id", "start_time") VALUES ($1, $2, $3, $4)`,
        [eventName, code, adminId, startTime])
    return creation.rowCount === 1
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<EventCreationRequestResponse>) {
    const {eventName, adminId, startTime} = req.body as EventCreationRequest

    console.log(`Handling event creation request for ${eventName}`)

    if (!eventName || !adminId || !startTime) {
        res.status(400)
    }

    const eventCode = generateEventCode()

    await createEvent(eventName, eventCode, adminId, startTime)

    return res.status(200).json({eventCode: eventCode})
}
