import { Page, expect } from '@playwright/test'

export class BasePage {

  constructor(public page: Page) {}

  async open(path: string) {
    await this.page.goto(path)
  }

  async reload() {
    await this.page.reload()
  }

  async waitForUrlContains(text: string) {
    await this.page.waitForURL(`**${text}**`)
  }

  async getCurrentUrl() {
    return this.page.url()
  }

  async getTitle() {
    return this.page.title()
  }

}