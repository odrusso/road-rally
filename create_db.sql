DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS checkins;

CREATE TABLE event (
    "id" serial NOT NULL,
    "name" varchar(200) NOT NULL,
    "code" varchar(200) NOT NULL,
    "admin_code" varchar(200) NOT NULL,
    "start_time" int8 NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE teams (
    "id" serial NOT NULL,
    "teamName" varchar NOT NULL,
    "event_id" int4,
    CONSTRAINT "teams_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES event ("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE locations (
    "id" serial NOT NULL,
    "event_id" int8 NOT NULL,
    "name" varchar NOT NULL,
    "longitude" decimal NOT NULL,
    "latitude" decimal NOT NULL,
    CONSTRAINT "fk_event_id" FOREIGN KEY ("event_id") REFERENCES event ("id"),
    CONSTRAINT "fk_team_id" FOREIGN KEY ("team_id") REFERENCES teams ("id"),
    PRIMARY KEY ("id")
);

CREATE TABLE checkins (
    "id" serial NOT NULL,
    "location_id" int8 NOT NULL,
    "event_id" int8 NOT NULL,
    "team_id" int8 NOT NULL,
    "time" int8 NOT NULL,
    CONSTRAINT "fk_event_id" FOREIGN KEY ("event_id") REFERENCES event ("id"),
    CONSTRAINT "fk_location_id" FOREIGN KEY ("location_id") REFERENCES locations ("id"),
    CONSTRAINT "fk_team_id" FOREIGN KEY ("team_id") REFERENCES teams ("id"),
    PRIMARY KEY ("id")
);
