export class CreateEventDto {
  constructor(public name: string, public workshops: CreateWorkshopDto[]) { }
}

export class CreateWorkshopDto {
  constructor(public name: string, public start: string, public end: string) { }
}

/**
 * {
        id: 1,
        name: 'Laravel convention 2021',
        createdAt: '2021-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 1,
            start: '2021-02-21 10:00:00',
            end: '2021-02-21 16:00:00',
            eventId: 1,
            name: 'Illuminate your knowledge of the laravel code base',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      }
 */