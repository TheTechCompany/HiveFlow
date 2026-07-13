import { test, expect } from '@playwright/test'
import moment = require('moment');

test('Can render nested lanes for overlapping ranges in the same group', async ({ page }) => {
  await page.route('**/graphql', async (route) => {
    const request = await route.request();
    const body = request.postDataJSON()

    let response: any = {};

    if (body.operationName == 'Slow') {
      response = {
        projects: [{ id: 'project-1', name: 'Project 1' }, { id: 'project-2', name: 'Project 2' }],
      }
    }
    if (body.operationName == 'CalendarItems') {
      response = {
        projects: [{ id: 'project-1', name: 'Project 1' }, { id: 'project-2', name: 'Project 2' }],
        calendarItems: [
          { id: '1', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: { id: 'project-1' } },
          { id: '2', start: new Date(), end: moment(new Date()).add(2, 'day').toDate(), groupBy: { id: 'project-1' } }
        ]
      }
    }

    await route.fulfill({
      json: {
        data: response
      }
    })
  })

  await page.goto('http://localhost:8080/dashboard/hive-flow');
  page.addStyleTag({ content: 'div[id^=single-spa-application]{ height: 100vh; } body{padding: 0; margin: 0}' })

  const items = page.locator('[data-timeline-item]');
  const count = await items.count()
  expect(count).toBe(2)

  // Both items in the same group should be in different lanes (different top positions)
  const top1 = await items.first().evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('top');
  });
  const top2 = await items.last().evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('top');
  });
  expect(top1).not.toBe(top2)
})
