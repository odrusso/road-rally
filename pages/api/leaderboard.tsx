import {NextApiRequest, NextApiResponse} from "next"
import {Leader} from "../leaderboard"

export default function handler(req: NextApiRequest, res: NextApiResponse<Leader[]>) {
    // TODO: This should do some DB stuff
    const leaderboardObject: Leader[] = [
        {teamName: 'big-mac-api', currentScore: 4},
        {teamName: 'qtr-pndr-api', currentScore: 3},
    ]
    res.status(200).json(leaderboardObject)
}
