import {NextApiRequest, NextApiResponse} from "next"

export type TeamDeletionRequest = {
    teamName: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body as TeamDeletionRequest
    // TODO: delete the team from the db
    return res.status(200)
}
