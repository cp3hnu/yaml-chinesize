#!/usr/bin/env node

import { Command, Option } from 'commander';
import { extract  } from '../src/extract.js';
import { replace } from '../src/replace.js';
const program = new Command();

program
  .name('yaml-chinesize')
  .description('CLI to convert English YAML Files to Chinese')
  .version('0.0.1');

program
  .command('extract')
  .description('Extract English texts of YAML files')
  .usage('<dir> [options]')
  .argument('<dir>', 'directory of YAML Files')
  .requiredOption('-f, --fields <fields...>', 'the extracted fields')
  .option('-o, --output <filePath>', 'path of file for writing the extracted English text')
  .action((dir, options) => {
    extract(dir, options.fields, options.output);
  });

program
  .command('replace')
  .description('Replace English texts of YAML Files to Chinese')
  .usage('<dir> [options]')
  .argument('<dir>', 'directory of YAML files')
  .requiredOption('-f, --fields <fields...>', 'the replaced fields')
  .option('-i, --input <filePath>', 'path of file for reading the Chinese text')
  .action((dir, options) => {
    replace(dir, options.fields, options.input);
  });

program.parse();