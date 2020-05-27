import chalk from 'chalk';

import { CLI } from './cmd';

CLI(process).catch((error) => {
  process.stderr.write(chalk`{red ERROR:} ${error.message}\n`);
  process.exit(1);
});
