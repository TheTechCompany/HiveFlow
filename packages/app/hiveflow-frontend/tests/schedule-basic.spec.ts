import { test, expect } from '@playwright/test'
import moment = require('moment');

test('Can render timeline bars', async ({ page }) => {
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
          { id: '2', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: { id: 'project-2' } }
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
  const count = await items.count();
  expect(count).toBe(2);
  await expect(items.first()).toBeVisible()
})

test('Can drag timeline item', async ({ page }) => {
  let updatedItem = false;
  await page.route('**/graphql', async (route) => {
    const request = await route.request();
    const body = request.postDataJSON()

    let response: any = {};

    if (body.operationName == 'UpdateCalendarItem') {
      updatedItem = true;
    }

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
          { id: '2', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: { id: 'project-2' } }
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
  const count = await items.count();
  expect(count).toBe(2);
  await expect(items.first()).toBeVisible()

  await items.first().hover()
  await page.mouse.down()
  await page.waitForTimeout(100);
  await page.mouse.move(600, 100)
  await page.mouse.move(620, 100)
  await page.waitForTimeout(100);
  await page.mouse.up()

  expect(updatedItem).toBe(true)
})

test('Can select item', async ({ page }) => {
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
          { id: '2', start: new Date(), end: moment(new Date()).add(1, 'day').toDate(), groupBy: { id: 'project-2' } }
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
  const count = await items.count();
  expect(count).toBe(2);
  await expect(items.first()).toBeVisible()

  await items.first().click()
  // Shared Timeline uses a border style for selection
  const style = await items.first().evaluate((el) => window.getComputedStyle(el).getPropertyValue('border'));
  expect(style).toContain('1a73e8') // selected border color
})
