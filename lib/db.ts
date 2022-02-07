import { Client, QueryResult } from 'pg';

export async function query(
    q: string,
    values: (string | number | Date)[] = []
): Promise<QueryResult<any>> {
    console.log(`[QUERY] ${q}`)
    try {
        const db = new Client({
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            port: parseInt(process.env.MYSQL_PORT),
        })

        await db.connect()
        const results = await db.query(q, values)
        await db.end()
        return results
    } catch (e) {
        console.error(e)
        throw Error(e.message)
    }
}
