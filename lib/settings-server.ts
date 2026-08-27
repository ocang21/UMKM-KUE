import fs from "fs/promises";
import path from "path";
import { DEFAULT_SETTINGS, SiteSettings } from "./settings";

const settingsFilePath = path.join(process.cwd(), "public", "site-settings.json");

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const data = await fs.readFile(settingsFilePath, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSiteSettings(newSettings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated = { ...current, ...newSettings };
  try {
    await fs.mkdir(path.dirname(settingsFilePath), { recursive: true });
    await fs.writeFile(settingsFilePath, JSON.stringify(updated, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving site settings:", error);
  }
  return updated;
}
