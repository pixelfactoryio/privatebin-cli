import chalk from 'chalk';
import pjson from 'pjson';

import { CLI } from './cmd';

CLI(process, pjson.version).catch((error) => {
  process.stderr.write(chalk`{red ERROR:} ${error.message}\n`);
  process.exit(1);
});
