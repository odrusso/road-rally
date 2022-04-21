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

- Add locations into database
- Modify current check-in logic to care about event code

- Add 'edit locations' to manage page
- Add 'edit locations' PUT API

- Require entry of event code to join event, no default
- Extend existing APIs to require event name

- Remove all mention of 'maccas run'
