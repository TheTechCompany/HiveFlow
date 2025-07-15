import { test, expect} from '@playwright/test'
import moment = require('moment');

test('Can create timeline item', () => {

})

test('Can drag timeline item', async ({page}) => {

    let updatedItem = false;
  await page.route('**/graphql', async (route) => {
    // const response = await route.fetch();
    const request = await route.request();
    const body = request.postDataJSON()

    let response: any = {};

    if(body.operationName == 'UpdateCalendarItem'){
        updatedItem = true;
    }

    if(body.operationName == 'Slow'){
      response = {
        projects: [{id: 'project-1', name: 'Project 1'}, {id: 'project-2', name: 'Project 2'}],
      }
    }
    if(body.operationName == 'CalendarItems'){
      response = {
        projects: [{id: 'project-1', name: 'Project 1'}, {id: 'project-2', name: 'Project 2'}],
        calendarItems: [
          {id: '1', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: {id: 'project-1'}}, 
          {id: '2', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: {id: 'project-2'}}
        ]
      }
    }

    await route.fulfill({
      // response,
      json: {
        data: response
      }
    })
  })

  await page.goto('http://localhost:8080/dashboard/hive-flow');

  page.addStyleTag({content: 'div[id^=single-spa-application]{ height: 100vh; } body{padding: 0; margin: 0}'})

  const items = page.locator('.lane-item');

  const count = await items.count();
  
  expect(count).toBe(2);

  await expect(items.first()).toBeVisible()

  await items.first().hover()

  await page.mouse.down()
  await page.mouse.move(600, 200)
  await page.mouse.up()

  expect(updatedItem).toBe(true)

})

test('Can exclude items that arent grouped properly', () => {

});

test('Can select item', async ({page}) => {
    
  await page.route('**/graphql', async (route) => {
    // const response = await route.fetch();
    const request = await route.request();
    const body = request.postDataJSON()

    let response: any = {};

    if(body.operationName == 'Slow'){
      response = {
        projects: [{id: 'project-1', name: 'Project 1'}, {id: 'project-2', name: 'Project 2'}],
      }
    }
    if(body.operationName == 'CalendarItems'){
      response = {
        projects: [{id: 'project-1', name: 'Project 1'}, {id: 'project-2', name: 'Project 2'}],
        calendarItems: [
          {id: '1', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: {id: 'project-1'}}, 
          {id: '2', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: {id: 'project-2'}}
        ]
      }
    }

    await route.fulfill({
      // response,
      json: {
        data: response
      }
    })
  })

  await page.goto('http://localhost:8080/dashboard/hive-flow');

  page.addStyleTag({content: 'div[id^=single-spa-application]{ height: 100vh; } body{padding: 0; margin: 0}'})

  const items = page.locator('.lane-item');

  const count = await items.count();
  
  expect(count).toBe(2);

  await expect(items.first()).toBeVisible()

  await items.first().hover()

  await page.mouse.down()
  await page.mouse.up()

  await expect(page.locator('.lane-item.selected')).toBeVisible()

})

test('Can select multiple items', async ({page}) => {

  await page.route('**/graphql', async (route) => {
    // const response = await route.fetch();
    const request = await route.request();
    const body = request.postDataJSON()

    let response: any = {};

    if(body.operationName == 'Slow'){
      response = {
        projects: [{id: 'project-1', name: 'Project 1'}, {id: 'project-2', name: 'Project 2'}],
      }
    }
    if(body.operationName == 'CalendarItems'){
      response = {
        projects: [{id: 'project-1', name: 'Project 1'}, {id: 'project-2', name: 'Project 2'}],
        calendarItems: [
          {id: '1', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: {id: 'project-1'}}, 
          {id: '2', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: {id: 'project-2'}}
        ]
      }
    }

    await route.fulfill({
      // response,
      json: {
        data: response
      }
    })
  })

  await page.goto('http://localhost:8080/dashboard/hive-flow');

  const items = page.locator('.lane-item');
  expect(await items.count()).toBe(2);

  // Simulate multi-select (e.g. with Ctrl/Cmd key)
  await items.nth(0).click({ modifiers: ['ControlOrMeta'] });
  expect(await page.locator('.lane-item.selected').count()).toBe(1);

  await items.nth(1).click({ modifiers: ['ControlOrMeta'] });

  // Both should be selected
  expect(await page.locator('.lane-item.selected').count()).toBe(2);
})
