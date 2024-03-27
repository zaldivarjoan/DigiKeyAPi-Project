import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { handleKeywordSearch, displaySearchHistory } from './app.js';

yargs(hideBin(process.argv))
    .usage('Tool for interacting with the selected API')
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
            try
            {
                const { keyword, cache } = args;
                handleKeywordSearch(keyword,cache);
            }catch (error) {
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
            await displaySearchHistory();
        } catch (error) {
            console.error('Error getting search history:', error.message);
        }
        }
    )
    .help().argv;
