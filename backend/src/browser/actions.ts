import { getPage } from "./browser";

export async function navigate(url: string): Promise<void> {
  const page = await getPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
}

export async function clickElement(selector: string): Promise<void> {
  const page = await getPage();
  await page.click(selector, { timeout: 10000 });
}

export async function fillInput(selector: string, value: string): Promise<void> {
  const page = await getPage();
  await page.fill(selector, value);
}
