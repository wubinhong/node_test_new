import { Injectable, Logger } from '@nestjs/common';
import { MenuItem } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryMenuItemDto } from './dto/query-menu-item.dto';

@Injectable()
export class MenuItemsService {
    // noinspection JSUnusedLocalSymbols
    constructor(private prisma: PrismaService) { }

    private log: Logger = new Logger(MenuItemsService.name);

    async initMenus() {
        const menu1 = await this.prisma.menuItem.create({
            data: {
                name: "All events",
                url: "/events",
            }
        });
        const menu2 = await this.prisma.menuItem.create({
            data: {
                "name": "Laracon",
                "url": "/events/laracon",
                "parentId": menu1.id,
            }
        });
        const menu3 = await this.prisma.menuItem.create({
            data: {
                "name": "Illuminate your knowledge of the laravel code base",
                "url": "/events/laracon/workshops/illuminate",
                "parentId": menu2.id
            }
        });
        const menu4 = await this.prisma.menuItem.create({
            data: {
                "name": "The new Eloquent - load more with less",
                "url": "/events/laracon/workshops/eloquent",
                "parentId": menu2.id,
            }
        });
        const menu5 = await this.prisma.menuItem.create({
            data: {
                "name": "Reactcon",
                "url": "/events/reactcon",
                "parentId": menu1.id,
            }
        });
        const menu6 = await this.prisma.menuItem.create({
            data: {
                "name": "#NoClass pure functional programming",
                "url": "/events/reactcon/workshops/noclass",
                "parentId": menu5.id,
            }
        });
        const menu7 = await this.prisma.menuItem.create({
            data: {
                "name": "Navigating the function jungle",
                "url": "/events/reactcon/workshops/jungle",
                "parentId": menu5.id,
            }
        });
        return { menu1, menu2, menu3, menu4, menu5, menu6, menu7 };
    }

    /* TODO: complete getMenuItems so that it returns a nested menu structure
     Requirements:
      - your code should result in EXACTLY one SQL query no matter the nesting level or the amount of menu items.
      - it should work for infinite level of depth (children of childrens children of childrens children, ...)
      - verify your solution with `npm run test`
      - do a `git commit && git push` after you are done or when the time limit is over
      - post process your results in javascript
      Hints:
      - open the `src/menu-items/menu-items.service.ts` file
      - partial or not working answers also get graded so make sure you commit what you have
      Sample response on GET /menu:
      ```json
      [
          {
              "id": 1,
              "name": "All events",
              "url": "/events",
              "parentId": null,
              "createdAt": "2021-04-27T15:35:15.000000Z",
              "children": [
                  {
                      "id": 2,
                      "name": "Laracon",
                      "url": "/events/laracon",
                      "parentId": 1,
                      "createdAt": "2021-04-27T15:35:15.000000Z",
                      "children": [
                          {
                              "id": 3,
                              "name": "Illuminate your knowledge of the laravel code base",
                              "url": "/events/laracon/workshops/illuminate",
                              "parentId": 2,
                              "createdAt": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          },
                          {
                              "id": 4,
                              "name": "The new Eloquent - load more with less",
                              "url": "/events/laracon/workshops/eloquent",
                              "parentId": 2,
                              "createdAt": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          }
                      ]
                  },
                  {
                      "id": 5,
                      "name": "Reactcon",
                      "url": "/events/reactcon",
                      "parentId": 1,
                      "createdAt": "2021-04-27T15:35:15.000000Z",
                      "children": [
                          {
                              "id": 6,
                              "name": "#NoClass pure functional programming",
                              "url": "/events/reactcon/workshops/noclass",
                              "parentId": 5,
                              "createdAt": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          },
                          {
                              "id": 7,
                              "name": "Navigating the function jungle",
                              "url": "/events/reactcon/workshops/jungle",
                              "parentId": 5,
                              "createdAt": "2021-04-27T15:35:15.000000Z",
                              "children": []
                          }
                      ]
                  }
              ]
          }
      ]
    */
    async getMenuItems() {
        const menus = await this.prisma.menuItem.findMany();
        this.log.debug('menus:', menus);
        let menusDto: QueryMenuItemDto[] = [];

        // A list of roots (r.parentId == null)
        for (let key in menus) {
            let menu = menus[key];
            if (menu.parentId == null) {
                menusDto.push({
                    id: menu.id,
                    name: menu.name,
                    url: menu.url,
                    children: []
                });
            }
        }

        // Iterate the root list and every element's populate children field from the original menus array.
        for (let i in menusDto) {
            let parent = menusDto[i];
            this.populateChildrenField(menus, parent);
        }

        return menusDto;
    }

    populateChildrenField(menus: MenuItem[], parent: QueryMenuItemDto): void {
        // Fill the children field for the parant argument.
        for (let i in menus) {
            let menu = menus[i];
            if (menu.parentId == parent.id) {
                parent.children?.push({
                    id: menu.id,
                    name: menu.name,
                    url: menu.url,
                    children: []
                })
            }
        }
        // Iterate children and populate their children field with recursion.
        let children = parent.children;
        if (!children || children?.length === 0) {  // The termination condition (no descendant) for recursion.
            return;
        }
        // Next recursion.
        for (let i in children) {
            let c = children[i];
            this.populateChildrenField(menus, c);
        }
    }
}
