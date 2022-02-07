import {NextApiRequest, NextApiResponse} from "next"
import { query } from "../../../lib/db"
import { findDoesTeamExist } from "./create"

export type TeamDeletionRequest = {
    teamName: string
}

const deleteTeam = async (teamName: string): Promise<boolean> => {
    console.log(`Creating team ${teamName}`)
    const creation = await query(`DELETE FROM teams WHERE "teamName" = $1`, [teamName])
    const checkins = await query(`DELETE FROM checkins WHERE "teamName" = $1`, [teamName])

    return creation.rowCount === 1
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {teamName} = req.body as TeamDeletionRequest
    // TODO: delete the team from the db
    console.log(`Handling team deletion request for ${teamName}`)
    if (!teamName) {
        res.status(400)
    }
    const doesTeamExist = await findDoesTeamExist(teamName)
    if (doesTeamExist) {
        await deleteTeam(teamName)
    }
    return res.status(200).end()
}
