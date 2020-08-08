import { accessSync, constants } from 'fs';
import nconf from 'nconf';
import { join } from 'path';

const CONFIG_PARAM = '--config=';

const convertPath = (segments: string[]): string => {
  if (segments[0][0] !== '/') { segments.unshift(process.cwd()); }
  return join(...segments);
};

let fileSegments: string[];

if (process.env.NODE_ENV === 'production') {
  const [configArg] = process.argv.filter((arg) => arg.slice(0, CONFIG_PARAM.length) === CONFIG_PARAM);
  fileSegments = [configArg ? configArg.slice(CONFIG_PARAM.length) : 'config.json'];
} else {
  fileSegments = ['config', `${(process.env.NODE_ENV || 'development').toLowerCase()}.json`];
}

const filename = convertPath(fileSegments);
try {
  accessSync(filename, constants.R_OK);
} catch (err) {
  console.error(`Configuration file "${filename}" does not exist!`); // eslint-disable-line no-console
  process.exit(1);
}

export const config = nconf.env().argv().file({ file: filename });
