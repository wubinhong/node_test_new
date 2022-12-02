import { Controller, Get, Post } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) { }

  /**
   * $ curl -X POST http://localhost:3000/menu-items/init-menu
   */
  @Post('init-menu')
  async initMenuItems() {
    return this.menuItemsService.initMenus();
  }

  /**
   * $ curl http://localhost:3000/menu-items/menu
   */
  @Get('menu')
  async getMenuItems() {
    return this.menuItemsService.getMenuItems();
  }
}
