import {NextApiRequest, NextApiResponse} from "next"
import {query} from "../../../lib/db"

export type LocationRemoveRequest = {
    locationId: number,
    // TODO We need admin code in here
}

const removeLocation = async (locationId: number) => {
    const creation = await query(`DELETE FROM locations WHERE id = $1`, [locationId])
    return creation.rowCount
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {locationId} = req.body as LocationRemoveRequest

    console.log(`Handling location deletion request for ${locationId}`)

    if (!locationId) res.status(400).end()

    await removeLocation(locationId)

    return res.status(200).end()
}
