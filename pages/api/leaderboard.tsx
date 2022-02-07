import {NextApiRequest, NextApiResponse} from "next"
import { query } from "../../lib/db"
import {Leader} from "../leaderboard"

const getGrouping = async (): Promise<Leader[]> => {
    const creation = await query(`select "teamName", count(*) as currentScore from checkins group by "teamName" order by currentScore desc;`)
    return creation.rows.map((row): Leader => ({ teamName: row.teamName, currentScore: Number(row.currentscore) }))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Leader[]>) {
    const leaderboardObject = await getGrouping()
    return res.status(200).json(leaderboardObject)
}
