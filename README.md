# node.ts

This is my personal boilerplate for TypeScript node.js projects (as of June 2020).  
The key features are:
* TypeScript everywhere
* jest test runner (with ts-jest wrapper)
* eslint (with TypeScript parser)
* development mode (watch) for code (nodemon), tests (jest) and linting (esw)
* CircleCI builds (artifact with production modules only)

### `package.json` scripts

After `npm install`, you can use the following commands:

#### `start`, `start:dev`, `start:prod`

Starts the main script.

`start` generates the version file, lints all the source codes (tests included),
runs all the tests (original .ts files, not compiled-down versions), compiles
the source code to down JavaScripts (tests excluded), and starts the main script
(with node binary).

`start:dev` uses nodemon to watch source files, on any change it starts ts-node
wrapper, executing the main .ts script.

`start:prod` is meant to be used in production, it uses bundled source and node
modules.

#### `build`

One-time build: generates the version file, lints the .ts files, runs tests using
ts-jest wrapper of jest test runner and creates build directory with compiled
JavaScript sources.

#### `lint`, `lint:dev`

Lints the source code (including the test files). The `:dev` version starts
linting in watch mode (using esw wrapper).

#### `test`, `test:dev`

Runs the unit tests. It runs the original .spec.ts files. These files are not
compiled down to JavaScript during the build (so they are not part of the
resulting bundle, as jest runner is also only a devDependency). The `:dev`
version starts the runner in watch mode.

#### `tar`

Creates resulting .tgz artifact (on CircleCI) into dist directory.

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
