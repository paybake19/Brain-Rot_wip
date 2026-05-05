// Singleton Playwright instance — launch once on startup, reuse across requests

import { Browser, chromium } from 'playwright'

let browserInstance: Browser | null = null

export async function getBrowser(): Promise<Browser> {
  // SUDO: if browserInstance is null or not connected → launch chromium headless
  // SUDO: return browserInstance
}

export async function closeBrowser(): Promise<void> {
  // SUDO: if browserInstance → browserInstance.close() → set to null
}

// Core Playwright interaction primitives

import { getBrowser } from './browser'

export async function navigate(url: string): Promise<void> {
  // SUDO: get page from getBrowser()
  // SUDO: page.goto(url, { waitUntil: 'domcontentloaded' })
}

export async function clickElement(selector: string): Promise<void> {
  // SUDO: page.click(selector)
}

export async function fillInput(selector: string, value: string): Promise<void> {
  // SUDO: page.fill(selector, value)
}
