import {Button} from "@mui/material";
import Link from 'next/link'

export default function Home() {
    return (
        <>

            <Link href={"/event/join"}>
                <Button fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}>
                    Join Event
                </Button>
            </Link>

            <Link href={"/event/create"}>
                <Button fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}>
                    Create Event
                </Button>
            </Link>

        </>
    )
}
