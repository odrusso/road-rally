import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../lib/db"
import {findDoesTeamIdExist} from "./delete";

export type TeamCheckInRequest = {
    teamId: number;
    location: string;
}

export const findDoesHasTeamVisitedLocation = async (teamId: number, location: string): Promise<boolean> => {
    console.log(`Finding team ${teamId} at location ${location}`)

    // TODO This needs to be location ID
    const results = await query(`SELECT * FROM checkins WHERE "team_id" = $1 AND "location" = $2`, [teamId, location])
    return results.rowCount > 0
}

export const addLocation = async (teamId: number, location: string): Promise<boolean> => {
    console.log(`Checking in team ${teamId} at location ${location}`)
    const currentTimeUTC = new Date().getTime();

    // TODO This needs to be location ID
    const results = await query(`INSERT INTO checkins ("team_id", "location", "time") VALUES ($1, $2, $3)`, [teamId, location, currentTimeUTC])
    return results.rowCount > 0
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {teamId, location} = req.body as TeamCheckInRequest

    if (!teamId || !location) return res.status(400).end()

    const doesTeamExist = findDoesTeamIdExist(teamId)
    if (!doesTeamExist) {
        return res.status(400).end()
    }

    // TODO: check if location has already been done by the team
    const locationAlreadyDoneByTeam = await findDoesHasTeamVisitedLocation(teamId, location)

    if (locationAlreadyDoneByTeam) {
        return res.status(400).end()
    }

    await addLocation(teamId, location)
    return res.status(200).end()
}
