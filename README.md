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
- Add 'create event' page
- Add 'create event' POST API  
  
- Add 'admin login' and 'admin dashboard' pages
- Add 'verify login' POST API  
  
- Add auth  

- Add 'edit locations' page
- Add 'edit locations' PUT API
- Add 'edit event' page
- Add 'edit event' POST API

- Require entry of event code to join event, no default
- Extend existing APIs to require event name

- Remove all mention of 'maccas run'
