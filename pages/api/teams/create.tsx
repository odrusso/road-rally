import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../lib/db"

export type TeamCreationRequest = {
    teamName: string
    eventCode: string
}

export type TeamCreationRequestResponse = {
    teamId: number
}

export const getEventIdFromCode = async (eventCode: string): Promise<number> => {
    console.log(`Finding event ${eventCode}`)

    const results = await query(`SELECT id FROM event WHERE code = $1`, [eventCode])
    return results.rows[0].id
}

export const findTeamIdFromNameAndEvent = async (teamName: string, eventId: number): Promise<number | null> => {
    console.log(`Finding team ${teamName}`)

    const results = await query(`SELECT teams.id as id FROM teams WHERE name = $1 AND event_id = $2`, [teamName, eventId])

    if (results.rows.length === 0) return null

    return results.rows[0].id
}

const createTeam = async (teamName: string, eventId: number): Promise<number> => {
    console.log(`Creating team ${teamName}`)

    const creation = await query(`INSERT INTO teams ("name", "event_id") VALUES ($1, $2) RETURNING id;`, [teamName, eventId])
    return creation.rows[0].id
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<TeamCreationRequestResponse>) {
    const {teamName, eventCode} = req.body as TeamCreationRequest
    console.log(`Handling team creation request for ${teamName}`)

    if (!teamName || !eventCode) return res.status(400).end()

    const eventId = await getEventIdFromCode(eventCode)

    let teamId = await findTeamIdFromNameAndEvent(teamName, eventId)

    if (!teamId) {
        teamId = await createTeam(teamName, eventId)
    }

    return res.status(200).json({teamId})
}
