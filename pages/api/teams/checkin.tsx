import {NextApiRequest, NextApiResponse} from "next"

export type TeamCheckInRequest = {
    teamName: string;
    location: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body as TeamCheckInRequest

    const doesTeamExist = true
    if (!doesTeamExist) {
        return res.status(400)
    }

    // TODO: check if location has already been done by the team
    const locationAlreadyDoneByTeam = false
    if (locationAlreadyDoneByTeam) {
        return res.status(400)
    }

    // TODO: actually add an entry to the DB
    return res.status(200)
}
