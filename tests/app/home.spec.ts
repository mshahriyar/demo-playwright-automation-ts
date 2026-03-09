import { test, expect } from '../../fixtures/testFixtures'

test.describe('Home Dashboard', () => {

    test('Dashboard page loads successfully @smoke @sanity @regression', async ({ homePage }) => {

        await homePage.open()

        await expect(homePage.page).toHaveURL(/home/)

    })


    test('Validate all dashboard cards @sanity @regression', async ({ homePage }) => {

        await homePage.open()

        await homePage.validateDashboardCards()

    })


    test('Active Job Posts card navigation @sanity @regression', async ({ homePage, page }) => {

        await homePage.open()

        await homePage.clickCard('Active job posts')

        await expect(page).toHaveURL(/job-management/)

    })


    test('Chats card navigation @sanity @regression', async ({ homePage, page }) => {

        await homePage.open()

        await homePage.clickCard('Chats')

        await expect(page).toHaveURL(/chats/)

    })


    test('Pending contracts card navigation @sanity @regression', async ({ homePage, page }) => {

        await homePage.open()

        await homePage.clickCard('Pending contracts')

        await expect(page).toHaveURL(/contracts/)

    })


    test('Unread messages card navigation @sanity @regression', async ({ homePage, page }) => {

        await homePage.open()

        await homePage.clickCard('Unread messages')

        await expect(page).toHaveURL(/chats/)

    })


    test('Recommended candidates card navigation @sanity @regression', async ({ homePage, page }) => {

        await homePage.open()

        await homePage.clickCard('Recommended candidates')

        await expect(page).toHaveURL(/employees/)

    })
    //   test('Validate Active events card', async ({ homePage }) => {

    //     await homePage.open()

    //     await homePage.expectActiveEventsEmpty()

    //   })

})
