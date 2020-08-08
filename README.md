# node.ts

This is my personal boilerplate for TypeScript node.js projects (as of July 2020).  
The key features are:
* TypeScript everywhere
* jest test runner (with ts-jest wrapper)
* eslint (with TypeScript parser)
* development mode (watch) for code compilation (tsc), tests (jest) and linting (esw)
* CircleCI builds (artifact with production modules only)

### Configuration

Configuration of the application make use of configuration files, command-line arguments
and environmental variables. For more information, please see
[nconf package](https://github.com/indexzero/nconf) README page.

For production run (`NODE_ENV` set to `production`), the `config.json` configuration
file is expected to be located in the current working directory when started,
otherwise `config/<NODE_ENV>.json` file is used, with fallback to `config/development.json`
when `NODE_ENV` is not set.

### Logging

[Winston package](https://github.com/winstonjs/winston) is used for logging. In development
mode (`NODE_ENV` set to `development`), all log messages go to console.

If `app:logs` object is present in the configuration file, log messages go also to files.
The log directory is specified with `app:logs:dir` configuration string, the log files
are called `all-<timestamp>.log` (log messages with `info` and above log levels), and
`errors-<timestamp>.log` (for error log messages only). If `app:logs:rotate` configuration
string is present (must confirm [maxFiles](https://github.com/winstonjs/winston-daily-rotate-file)
option format), the `<date>` is used instead of `<timestamp>` in the filenames and the files
are daily rotated and specified number of logfiles are kept (consider this option for production).

### Signal handling

When `SIGINT` or `SIGTERM` signal is sent to the application, it should terminate. But before
that, it can gracefully shutdown (e.g. disconnect from DB or perform some cleanup operations).

Whenever there is a operation that should be performed as part of the graceful shutdown,
register it to `signalHandler` using `.add()` method. The operation can be asynchronous,
they will be executed (with `await`) one by one in the same order they were registered.

### `package.json` scripts

After `yarn install`, you can use the following commands:

#### `compile`, `compile:dev`

Compiles TypeScript source files down to JavaScript (in `build` directory). The `:dev`
version starts incremental compilation (watches for changes, using `tsc-watch` wrapper).

#### `lint`, `lint:dev`

Lints the source code (including the test files). The `:dev` version starts
linting in watch mode (using `esw` wrapper).

#### `test`, `test:dev`

Runs the unit tests. It runs the original `.spec.ts` files.
The `:dev` version starts the runner in watch mode.

The expected configuration file (as long as any of the tests imports the `config`
module) is `config/test.json`.

#### `build`

One-time build: generates the version file, lints the `.ts` files, runs unit tests
using `ts-jest` wrapper of `jest` test runner, creates `build` directory with
compiled JavaScript sources and builds versioned `.tgz` artifact in `dist` directory.

#### `start:prod`

Starts the main compiled script (i.e. `build/index.js`), with `NODE_ENV` set to `production`.
The expected production configuration file is `config.json` in current working
directory, but can be overriden with `--config=<filename.json>` command line parameter.

### License

MIT License

Copyright (c) 2020 Roman Kaspar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
