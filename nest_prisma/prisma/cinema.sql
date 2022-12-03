DROP TABLE IF EXISTS "cinema_movies";

CREATE TABLE "cinema_movies" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "price" NUMERIC NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

DROP TABLE IF EXISTS "cinema_rooms";

CREATE TABLE "cinema_rooms" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "seatNum" DATETIME NOT NULL -- Updated by cinema_seat,
    PRIMARY KEY("id" AUTOINCREMENT)
);

DROP TABLE IF EXISTS "cinema_seats";

CREATE TABLE "cinema_seats" (
    "id" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "rowNum" INTEGER NOT NULL,
    "colNum" INTEGER NOT NULL,
    "seatType" INTEGER NOT NULL,
    "premiumPercentage" NUMERIC NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
);

DROP TABLE IF EXISTS "cinema_shows";

CREATE TABLE "cinema_shows" (
    "id" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "seatNum" INTEGER NOT NULL,
    "availableSeatNum" INTEGER NOT NULL,
    UNIQUE("movieId", "roomId", "startTime", "endTime"),
    PRIMARY KEY("id" AUTOINCREMENT)
);

-- This TABLE will be generated automatically WHEN scheduling the shows TABLE.
DROP TABLE IF EXISTS "cinema_tickets";

CREATE TABLE "cinema_tickets" (
    "id" INTEGER NOT NULL,
    "showId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,
    "price" NUMERIC NOT NULL,
    -- calculated by 'movies.price * (1 + seats.premiumPercentage)'
    "seatNum" DATETIME NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT),
    UNIQUE("showId", "seatId")
);