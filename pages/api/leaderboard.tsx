import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../lib/db"
import {Leader} from "../leaderboard"

const getGrouping = async (): Promise<Leader[]> => {
    const creation = await query(`
        SELECT "teamName", count(*) as currentScore, max("time") as recentTime 
        FROM checkins 
        GROUP BY "teamName" 
        ORDER BY currentScore desc, recentTime asc;;`)

    return creation.rows.map((row): Leader => ({
        teamName: row.teamName,
        currentScore: Number(row.currentscore),
        recentTime: row.recenttime // should be UTC millis
    }))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Leader[]>) {
    const leaderboardObject = await getGrouping()
    return res.status(200).json(leaderboardObject)
}
