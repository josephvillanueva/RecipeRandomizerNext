const BASE_URL = "https://api.spoonacular.com";
const TIMEOUT_MS = 10_000;

/**
 * Calls Spoonacular from the server so the API key never reaches the browser.
 * Resolves to { status, body } ready for the API route to send back.
 */
export async function spoonacular(path, params) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not set");
    return { status: 500, body: { error: "Server misconfiguration" } };
  }

  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries({ ...params, apiKey })) {
    url.searchParams.set(key, String(value));
  }

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (response.status === 402 || response.status === 429) {
      // 402 is how Spoonacular reports an exhausted daily quota.
      return {
        status: 429,
        body: {
          error:
            "The recipe service has hit its daily limit. Please try again tomorrow.",
        },
      };
    }
    if (!response.ok) {
      console.error(`Spoonacular ${path} responded ${response.status}`);
      return {
        status: 502,
        body: { error: "The recipe service is unavailable right now." },
      };
    }

    return { status: 200, body: await response.json() };
  } catch (error) {
    console.error(`Spoonacular ${path} failed:`, error.message);
    return {
      status: 502,
      body: { error: "The recipe service is unavailable right now." },
    };
  }
}
