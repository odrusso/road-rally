# Road Rally
A silly leaderboard style webapp that lets you run a road rally, with checkins using HTML5 geo-api, and a realtime-ish scoreboard.

## Running locally
Create a file `.env.local` based on `.env.example`
```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TODO
- Add admin password to event management page
- Add 'change start time' to event management page
- Refactor event manage page into several files

- Make checkins page get locations dynamically
- Change checkins API to take location ID

- Make leaderboard show all teams
- Maybe show something different on landing page before event start?

- Use EventID in more places, stop relying on EventCode for API calls
- Use contexts betterer, don't refetch all the time

- Add 'edit locations' to manage page
- Add 'edit locations' PUT API

- Remove all mention of 'maccas run'
