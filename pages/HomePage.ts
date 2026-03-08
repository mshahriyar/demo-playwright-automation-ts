import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './base/BasePage'

export class HomePage extends BasePage {

    readonly homePageTitle: Locator
    readonly cardsContainer: Locator
    constructor(page: Page) {
        super(page)

        this.homePageTitle = page.getByRole('heading', { name: /Welcome back/i })
        this.cardsContainer = page.locator('.ui_card__vXWzm')
    }

    async open() {
        await super.open('/home')
    }
    async expectHomePageTitle() {
        await expect(this.homePageTitle).toBeVisible()
    }
    getCard(title: string): Locator {
        return this.cardsContainer.filter({ hasText: title })
    }
    // icon inside card
    getCardIcon(title: string): Locator {
        return this.getCard(title).locator('img, svg').first()
    }

    // click card
    async clickCard(title: string) {
        await this.getCard(title).click()
    }

    // validate icon exists
    async expectCardIconVisible(title: string) {
        await expect(this.getCardIcon(title)).toBeVisible()
    }

    // validate count is numeric
    async expectCardCount(title: string) {
        const card = this.getCard(title)
        const cardText = (await card.innerText()).trim()
        const countMatch = cardText.match(/\d+/)

        if (countMatch) {
            const count = Number(countMatch[0])
            expect(Number.isFinite(count)).toBeTruthy()
            expect(count).toBeGreaterThanOrEqual(0)
            return
        }

        throw new Error(`Count not found for card: ${title}`)
    }
    async expectActiveEventsEmpty() {
        await expect(
            this.page.getByText("You're not a part of any events currently")
        ).toBeVisible()
    }
    async validateDashboardCards() {

        const cards = [
            { title: 'Active job posts', hasCount: true },
            { title: 'Chats', hasCount: true },
            { title: 'Pending contracts', hasCount: true },
            { title: 'Unread messages', hasCount: true },
            { title: 'Recommended candidates', hasCount: true },
            { title: 'Active events', hasCount: false }
        ]

        for (const card of cards) {

            await this.expectCardIconVisible(card.title)
            if (card.hasCount) {
                await this.expectCardCount(card.title)
            }
            if (card.title === 'Active events') {
                await this.expectActiveEventsEmpty()
            }

        }

    }

}
