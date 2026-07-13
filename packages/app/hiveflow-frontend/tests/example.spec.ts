import { test, expect } from '@playwright/test';
import moment = require('moment');

test('has title', async ({ page }) => {

  await page.route('**/graphql', async (route) => {
    // const response = await route.fetch();
    const request = await route.request();
    const body = request.postDataJSON()

    let response: any = {};

    console.log(body)

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

    // if (body.operationName == 'EditorCommandProgram') {
    //   response = {
    //     commandPrograms: [brokenProgram]
    //   }
    // }

    // if (body.operationName == "ControlHMIEditor") {
    //   response = {
    //     commandPrograms: [brokenProgram]
    //   }
    // }

    await route.fulfill({
      // response,
      json: {
        data: response
      }
    })
  })

  await page.goto('http://localhost:8080/dashboard/hive-flow');

  page.addStyleTag({content: 'div[id^=single-spa-application]{ height: 100vh; } body{padding: 0; margin: 0}'})

  const items = page.locator('.plan-item');
  const count = await items.count();
  
  expect(count).toBe(2);

  await expect(page.locator('.plan-item').first()).toBeVisible()

  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});