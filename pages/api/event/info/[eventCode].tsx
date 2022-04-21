import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../../lib/db";

export type EventInfoResponse = {
    code: string
    startTime: string
    name: string
}

const getEventInfo = async (eventCode: string): Promise<EventInfoResponse | null> => {
    const creation = await query(`SELECT name, code, start_time FROM event WHERE code = $1`, [eventCode])
    if (creation.rowCount !== 1) return null
    const row = creation.rows[0]
    return {
        code: row.code,
        name: row.name,
        startTime: row.start_time
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<EventInfoResponse>) {
    const { eventCode } = req.query

    console.log(`Handling event info request for ${eventCode}`)

    const info = await getEventInfo(eventCode as string)

    if (!info) return res.status(400).end()

    return res.status(200).json(info)
}
