import { Controller, Get, Logger, Post } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {
  }

  private log: Logger = new Logger(EventsController.name);

  /**
   * $ curl http://localhost:3000/events/warmupevents
   */
  @Get('warmupevents')
  getWarmupEvents() {
    return this.eventsService.getWarmupEvents();
  }

  /**
   * $ curl -X POST http://localhost:3000/events/init-events
   */
  @Post('init-events')
  initEvents() {
    this.log.debug('Access /init-event')
    return this.eventsService.initEvents();
  }

  /**
   * $ curl http://localhost:3000/events/events
   */
  @Get('events')
  async getEventsWithWorkshops() {
    return this.eventsService.getEventsWithWorkshops();
  }

  /**
   * $ curl http://localhost:3000/events/futureevents
   */
  @Get('futureevents')
  async getFutureEventWithWorkshops() {
    return this.eventsService.getFutureEventWithWorkshops();
  }
}
