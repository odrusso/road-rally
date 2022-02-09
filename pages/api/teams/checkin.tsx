import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../lib/db"
import {findDoesTeamExist} from "./create"

export type TeamCheckInRequest = {
    teamName: string;
    location: string;
}

export const findDoesHasTeamVisistedLocation = async (teamName: string, location: string): Promise<boolean> => {
    console.log(`Finding team ${teamName} at location ${location}`)
    const results = await query(`SELECT * FROM checkins WHERE "teamName" = $1 AND "location" = $2`, [teamName, location])
    return results.rowCount > 0
}

export const addLocation = async (teamName: string, location: string): Promise<boolean> => {
    console.log(`Checking in team ${teamName} at location ${location}`)
    const currentTimeUTC = new Date().getTime();
    const results = await query(`INSERT INTO checkins ("teamName", "location", "time") VALUES ($1, $2, $3)`, [teamName, location, currentTimeUTC])
    return results.rowCount > 0
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {teamName, location} = req.body as TeamCheckInRequest

    const doesTeamExist = findDoesTeamExist(teamName)
    if (!doesTeamExist) {
        return res.status(400).end()
    }

    // TODO: check if location has already been done by the team
    const locationAlreadyDoneByTeam = await findDoesHasTeamVisistedLocation(teamName, location)

    if (locationAlreadyDoneByTeam) {
        return res.status(400).end()
    }

    await addLocation(teamName, location)
    return res.status(200).end()
}
