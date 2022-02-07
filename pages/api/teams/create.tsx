import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../lib/db"

export type TeamCreationRequest = {
    teamName: string
}

export const findDoesTeamExist = async (teamName: string): Promise<boolean> => {
    console.log(`Finding team ${teamName}`)
    const results = await query(`SELECT * FROM teams WHERE "teamName" = $1`, [teamName])
    return results.rowCount > 0
}

const createTeam = async (teamName: string): Promise<boolean> => {
    console.log(`Creating team ${teamName}`)
    const creation = await query(`INSERT INTO teams ("teamName") VALUES ($1)`, [teamName])
    return creation.rowCount === 1
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {teamName} = req.body as TeamCreationRequest
    console.log(`Handling team creation request for ${teamName}`)
    if (!teamName) {
        res.status(400)
    }
    const doesTeamExist = await findDoesTeamExist(teamName)
    if (!doesTeamExist) {
        await createTeam(teamName)
    }
    return res.status(200).end()
}
