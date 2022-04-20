# Road Rally
A silly leaderboard style webapp that lets you run a road rally, with checkins using HTML5 geo-api, and a realtime-ish scoreboard.

## Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TODO
- Codify DB schema
- Add a few tables to the DB schema
  - Event (id, name, code, start_time, admin_id)
  - User (id, email, password_hash)
- Update existing tables with event_id as park of the primary key

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
