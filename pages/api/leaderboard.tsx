import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../lib/db"
import {Leader} from "../../lib/leaderboard"
import {getEventIdFromCode} from "./teams/create";

export type LeaderboardRequest = {
    eventCode: string
}

const getGrouping = async (eventId: number): Promise<Leader[]> => {
    const creation = await query(`
        SELECT teams.name, count(*) as currentScore, max("time") as recentTime 
        FROM checkins 
        INNER JOIN teams ON teams.id = checkins.team_id
        WHERE checkins.event_id = $1
        GROUP BY teams.id
        ORDER BY currentScore desc, recentTime asc;`, [eventId])

    return creation.rows.map((row): Leader => ({
        teamName: row.name,
        currentScore: Number(row.currentscore),
        recentTime: row.recenttime // should be UTC millis
    }))
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Leader[]>) {
    const {eventCode} = req.body as LeaderboardRequest

    if (!eventCode) return res.status(400).end()

    const eventId = await getEventIdFromCode(eventCode)
    if (eventId === null) return res.status(400).end()

    const leaderboardObject = await getGrouping(eventId)

    return res.status(200).json(leaderboardObject)
}
