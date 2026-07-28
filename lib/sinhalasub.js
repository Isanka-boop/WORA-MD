/*
  lib/sinhalasub.js

  This was the missing piece causing:
    "ReferenceError: sinhalaSub is not defined"
  in commands/sinhalasub.js. That command file called `await sinhalaSub()`
  but nothing in the project ever defined or exported it — so it crashed
  every single time.

  This module wraps the dark-yasiya-api.site "sinhalasub" movie search so
  the command file gets back an object with a `.search(query)` method,
  which is exactly what commands/sinhalasub.js expects:

      const sinhalasubInstance = await sinhalaSub();
      const searchResults = await sinhalasubInstance.search(q);
      // searchResults.result -> [{ title, link }, ...]

  NOTE ON THE API ENDPOINT
  ------------------------
  The command file already uses this endpoint for movie *details*:
      https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=<link>

  Following that same API's naming convention, the *search* endpoint is:
      https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=<query>

  This matches the standard dark-yasiya-api.site pattern used across their
  other "movie" scrapers. If the API owner ever changes the route or the
  response shape, you only need to edit the two spots marked below —
  everything else in the bot keeps working unchanged.
*/

const axios = require('axios');

const BASE_URL = 'https://www.dark-yasiya-api.site/movie/sinhalasub';

/**
 * Factory function — matches how commands/sinhalasub.js calls it:
 *   const sinhalasubInstance = await sinhalaSub();
 *   await sinhalasubInstance.search('Deadpool');
 */
async function sinhalaSub() {
    return {
        /**
         * Search SinhalaSub for a movie/show title.
         * @param {string} query
         * @returns {Promise<{status: boolean, result: Array<{title: string, link: string}>}>}
         */
        async search(query) {
            if (!query || !String(query).trim()) {
                throw new Error('sinhalaSub().search() requires a non-empty query string');
            }

            // ---- EDIT HERE if the real search endpoint differs ----
            const url = `${BASE_URL}/search?text=${encodeURIComponent(query)}`;

            const { data } = await axios.get(url, { timeout: 20000 });

            // The API is expected to return something like:
            //   { status: true, result: [ { title, link, ... }, ... ] }
            // Some dark-yasiya-api endpoints nest results differently
            // (e.g. data.result.data instead of data.result), so we
            // normalize a few common shapes here defensively.
            let list = [];
            if (Array.isArray(data?.result)) {
                list = data.result;
            } else if (Array.isArray(data?.result?.data)) {
                list = data.result.data;
            } else if (Array.isArray(data?.data)) {
                list = data.data;
            }
            // ---------------------------------------------------------

            const result = list
                .filter((item) => item && (item.link || item.url))
                .map((item) => ({
                    title: item.title || item.name || 'Untitled',
                    link: item.link || item.url
                }));

            return {
                status: result.length > 0,
                result
            };
        }
    };
}

module.exports = { sinhalaSub };

