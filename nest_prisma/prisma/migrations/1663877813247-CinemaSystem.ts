import { Migration } from '../cli/migration';

import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();
export default class CinemaSystem implements Migration {
  async up() {
    /**
     # ToDo: Create a migration that creates all tables for the following user stories

     For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
     To not introduce additional complexity, please consider only one cinema.

     Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

     ## User Stories

     **Movie exploration**
     * As a user I want to see which films can be watched and at what times
     * As a user I want to only see the shows which are not booked out

     **Show administration**
     * As a cinema owner I want to run different films at different times
     * As a cinema owner I want to run multiple films at the same time in different showrooms

     **Pricing**
     * As a cinema owner I want to get paid differently per show
     * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

     **Seating**
     * As a user I want to book a seat
     * As a user I want to book a vip seat/couple seat/super vip/whatever
     * As a user I want to see which seats are still available
     * As a user I want to know where I'm sitting on my ticket
     * As a cinema owner I dont want to configure the seating for every show
     * 
     * DB design:
     * 1. Movie: title, startTime, endTime, price,
     * 2. Room: name, seatNum, 
     * 3. Seat: roomId, rowNum, colNum, seatType(enum), premiumPercentage, 
     * 4. Show: (movieId, roomId, startTime, endTime), seatNum (replicated from hall), availableSeatNum --> composite index -> roomId leftmost -> data-sensitive column
     * 5. ticket: showId, seatId, price (movie.price * (1 + seat.premiumPercentage)), booked --> unique_key: showId_seatId generated when scheduling show.
     * 
     * System will automatically schedule the seating(tickets) for every show when configuring the show.
     * 
     */

    try {
      const createMovieTable: [] = await prisma.$queryRaw`CREATE TABLE "cinema_movies" (
          "id" INTEGER NOT NULL,
          "title" TEXT NOT NULL,
          "startTime" DATETIME NOT NULL,
          "endTime" DATETIME NOT NULL,
          "price" NUMERIC NOT NULL,
          PRIMARY KEY("id" AUTOINCREMENT)
      )`;
      console.log('createMovieTable', createMovieTable);

      const createRoomTable: [] = await prisma.$queryRaw`CREATE TABLE "cinema_rooms" (
          "id" INTEGER NOT NULL,
          "name" TEXT NOT NULL,
          "seatNum" DATETIME NOT NULL,
          PRIMARY KEY("id" AUTOINCREMENT)
      )`;
      console.log('createRoomTable', createRoomTable);

      const createSeatTable: [] = await prisma.$queryRaw`CREATE TABLE "cinema_seats" (
          "id" INTEGER NOT NULL,
          "roomId" INTEGER NOT NULL,
          "rowNum" INTEGER NOT NULL,
          "colNum" INTEGER NOT NULL,
          "seatType" INTEGER NOT NULL,
          "premiumPercentage" NUMERIC NOT NULL,
          PRIMARY KEY("id" AUTOINCREMENT)
      )`;
      console.log('createSeatTable', createSeatTable);

      const createShowTable: [] = await prisma.$queryRaw`CREATE TABLE "cinema_shows" (
          "id" INTEGER NOT NULL,
          "movieId" INTEGER NOT NULL,
          "roomId" INTEGER NOT NULL,
          "startTime" DATETIME NOT NULL,
          "endTime" DATETIME NOT NULL,
          "seatNum" INTEGER NOT NULL,
          "availableSeatNum" INTEGER NOT NULL,
          UNIQUE("movieId", "roomId", "startTime", "endTime"),
          PRIMARY KEY("id" AUTOINCREMENT)
      )`;
      console.log('createShowTable', createShowTable);

      // This table will be generated automatically WHEN scheduling the shows TABLE.
      const createTicketTable: [] = await prisma.$queryRaw`CREATE TABLE "cinema_tickets" (
          "id" INTEGER NOT NULL,
          "showId" INTEGER NOT NULL,
          "seatId" INTEGER NOT NULL,
          "price" NUMERIC NOT NULL,
          -- calculated by 'movies.price * (1 + seats.premiumPercentage)'
          "seatNum" DATETIME NOT NULL,
          PRIMARY KEY("id" AUTOINCREMENT),
          UNIQUE("showId", "seatId")
      )`;
      console.log('createTicketTable', createTicketTable);

      prisma.$transaction([
        ...createMovieTable,
        ...createRoomTable,
        ...createSeatTable,
        ...createShowTable,
        ...createTicketTable,
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      await prisma.$disconnect();
    }
    // throw new Error('TODO: implement migration in task 4');
  }

  async down() {
    // do nothing
    await prisma.$queryRaw`DROP TABLE IF EXISTS "cinema_movies"`;
    await prisma.$queryRaw`DROP TABLE IF EXISTS "cinema_rooms"`;
    await prisma.$queryRaw`DROP TABLE IF EXISTS "cinema_seats"`;
    await prisma.$queryRaw`DROP TABLE IF EXISTS "cinema_shows"`;
    await prisma.$queryRaw`DROP TABLE IF EXISTS "cinema_tickets"`;
  }
}
