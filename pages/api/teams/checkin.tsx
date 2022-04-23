import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../lib/db"

export type TeamCheckInRequest = {
    teamId: number;
    location: string; // TODO This should eventually be location ID
}

export const findDoesHasTeamVisitedLocation = async (teamId: number, locationId: number, eventId: number): Promise<boolean> => {
    console.log(`Finding team ${teamId} at location ${location}`)

    const results = await query(`SELECT * FROM checkins WHERE "team_id" = $1 AND "location_id" = $2 AND "event_id" = $3`, [teamId, locationId, eventId])
    return results.rowCount > 0
}

export const addLocation = async (teamId: number, locationId: number): Promise<boolean> => {
    console.log(`Checking in team ${teamId} at location ${location}`)
    const currentTimeUTC = new Date().getTime();

    const results = await query(`INSERT INTO checkins ("team_id", "location_id", "time") VALUES ($1, $2, $3)`, [teamId, locationId, currentTimeUTC])
    return results.rowCount > 0
}

export const findLocationIdFromLocationName = async (locationName: string, eventId: number): Promise<number | null> => {
    console.log(`Finding location id for location ${locationName} on event ${eventId}`)

    const results = await query(`SELECT id FROM locations WHERE name = $1 AND event_id = $2`, [locationName, eventId])
    if (results.rows.length === 0) return null
    return results.rows[0].id
}

export const findEventIdFromTeamId = async (teamId: number): Promise<number | null> => {
    console.log(`Finding event for team ${teamId}`)

    const results = await query(`SELECT event_id FROM teams WHERE id = $1`, [teamId])
    if (results.rows.length === 0) return null
    return results.rows[0]["event_id"]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {teamId, location} = req.body as TeamCheckInRequest

    if (!teamId || !location) return res.status(400).end()

    const eventId = await findEventIdFromTeamId(teamId)
    if (!eventId) return res.status(400).end()

    // TODO Temp Code
    const locationId = await findLocationIdFromLocationName(location, eventId)
    if (!locationId) return res.status(400).end()

    const locationAlreadyDoneByTeam = await findDoesHasTeamVisitedLocation(teamId, locationId, eventId)
    if (locationAlreadyDoneByTeam) return res.status(400).end()

    await addLocation(teamId, locationId)
    return res.status(200).end()
}
