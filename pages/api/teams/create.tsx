import {NextApiRequest, NextApiResponse} from "next"

export type TeamCreationRequest = {
    teamName: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body as TeamCreationRequest
    // TODO: This should do some DB stuff
    const doesTeamExist = true
    if (!doesTeamExist) {
        // create a team
    }
    return res.status(200).end()
}
