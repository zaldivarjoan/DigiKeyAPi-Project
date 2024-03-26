import { program } from 'commander';
import searchByKeyword from './api.js';
program
  .description('CLI tool for interacting with the selected API');

  program
  .command('search <keyword>')
  .description('Search for products using a keyword')
  .option('-c, --cache', 'Return cached results when available (default: false)')
  .action(async (keyword, options) => {
    try {
      const { cache } = options;
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
  });

  program
  .command('history')
  .description('Get history on previous searches')
  .action(() => {
    try {
      // Implement history retrieval logic here
      console.log('Previous searches history:');
      // Display history
    } catch (error) {
      console.error('Error getting search history:', error.message);
    }
  });

  program.parse(process.argv);