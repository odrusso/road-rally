DROP TABLE IF EXISTS admin_user;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS checkins;

CREATE TABLE admin_user (
    "id" serial NOT NULL,
    "email" varchar(200) NOT NULL,
    "hash" varchar(512) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE event (
    "id" serial NOT NULL,
    "name" varchar(200) NOT NULL,
    "code" varchar(200) NOT NULL,
    "admin_id" int4 NOT NULL,
    "start_time" int8 NOT NULL,
    CONSTRAINT "event_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES event ("id"),
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