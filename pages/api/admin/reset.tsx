import {NextApiRequest, NextApiResponse} from "next"
import { query } from "../../../lib/db"

export type AdminResetRequest = {
    password: string
}

const resetDb = async (): Promise<boolean> => {
    console.log(`Resetting DB`)
    const creation = await query(`DELETE FROM teams`)
    const checkins = await query(`DELETE FROM checkins`)
    return true
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { password } = req.body as AdminResetRequest

    if (password !== process.env.ADMIN_PASSWORD) {
        console.warn("Wrong password was entered.")
        return res.status(400).end()
    }

    await resetDb()

    return res.status(200).end()
}
