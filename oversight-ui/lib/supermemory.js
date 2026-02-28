import Supermemory from "supermemory";

let instance = null;

export function getSupermemory() {
  if (!instance) {
    const key = process.env.SUPERMEMORY_KEY;
    if (!key) {
      console.warn("⚠️ SUPERMEMORY_KEY not set — memory storage disabled");
      return null;
    }
    instance = new Supermemory({ apiKey: key });
  }
  return instance;
}

// Default export for simple import
export const supermemory = getSupermemory();