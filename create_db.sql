DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS teams;
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
    "teamName" varchar NOT NULL,
    "event_id" int4,
    CONSTRAINT "teams_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES event ("id"),
    PRIMARY KEY ("teamName")
);

CREATE TABLE checkins (
    "id" serial NOT NULL,
    "teamName" varchar NOT NULL,
    "location" varchar NOT NULL,
    "time" int8 NOT NULL,
    "event_id" int4 NOT NULL,
    CONSTRAINT "fk_event_id" FOREIGN KEY ("event_id") REFERENCES event ("id"),
    PRIMARY KEY ("id")
);