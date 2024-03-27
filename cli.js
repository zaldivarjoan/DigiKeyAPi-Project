import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import searchByKeyword from './api.js';

yargs(hideBin(process.argv))
    .usage('CLI tool for interacting with the selected API')
    .command(
        // command name with argument
        'search <keyword>',
        // description
        'Search for products using a keyword',
        // builder function to add a positional argument and option
        (yargs) => {
            yargs
                .options('cache', {
                  alias: 'c',
                  describe: 'Return cached results when available (default: false)',
                  type: 'boolean',
                  default: false
                });
        },
        // handler function
        async (args) => {
          try {
            const { keyword, cache } = args;
            // Perform search based on the keyword
            const searchResults = await searchByKeyword(keyword);
            console.log('Search Results:', searchResults);
            // Handle cache option if needed
            if (cache) {
                // Implement caching logic here if required
            }
        } catch (error) {
            console.error('Error during search:', error.message);
        }
        }
    )
    .command(
        'history',
        'Get history on previous searches',
        () => {},
        async () => {
          try {
            // Implement history retrieval logic here
            await displaySearchHistory();
        } catch (error) {
            console.error('Error getting search history:', error.message);
        }
        }
    )
    .help().argv;
