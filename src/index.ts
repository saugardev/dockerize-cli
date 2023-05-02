import * as yargs from 'yargs';
import { dockerize } from './dockerize';

yargs
  .scriptName('dockerize-cli')
  .usage('$0 <cmd> [args]')
  .command(
    'dockerize [framework] [appName] [imageName]',
    'Dockerize your application',
    // @ts-ignore
    (yargs) => {
      yargs
        .positional('framework', {
          type: 'string',
          choices: ['node', 'angular', 'react', 'next'],
          default: 'node',
        })
        .positional('appName', {
          type: 'string',
          default: 'app',
        })
        .positional('imageName', {
          type: 'string',
          default: 'app-image',
        });
    },
    dockerize
  )
  .help().argv;
