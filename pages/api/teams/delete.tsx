import {NextApiRequest, NextApiResponse} from "next"
import { query } from "../../../lib/db"

export type TeamDeletionRequest = {
    teamId: number
}

export const findDoesTeamIdExist = async (teamId: number): Promise<boolean> => {
    // We need to check for event here
    console.log(`Finding team ${teamId}`)
    const results = await query(`SELECT * FROM teams WHERE id = $1`, [teamId])
    return results.rowCount > 0
}

const deleteTeam = async (teamId: number): Promise<boolean> => {
    console.log(`Creating team ${teamId}`)

    const checkins = await query(`DELETE FROM checkins WHERE team_id = $1`, [teamId])
    const creation = await query(`DELETE FROM teams WHERE id = $1`, [teamId])

    return creation.rowCount === 1
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {teamId} = req.body as TeamDeletionRequest
    console.log(`Handling team deletion request for ${teamId}`)
    if (!teamId) {
        res.status(400)
    }
    const doesTeamExist = await findDoesTeamIdExist(teamId)

    if (doesTeamExist) {
        await deleteTeam(teamId)
    }

    return res.status(200).end()
}
