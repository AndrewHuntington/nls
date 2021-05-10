#!/usr/bin/env node

// Get access to the File System Module
const fs = require("fs");
// Chalk (NPM package) styles terminal strings
const chalk = require("chalk");
// path is part of the nodejs standard library
const path = require("path");

// Provides an lstat method that returns a Promise
const { lstat } = fs.promises;

// process.cwd() returns the current working dir
// the Process Module is automatically added to the global scope of every project
// process.argv is an array of arguements passed to the program from the CLI
// User arguments start at index 2
const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, filenames) => {
  if (err) {
    // error handling code
    console.log(err);
  }

  // PROMISE.ALL-BASED SOLUTION
  // Does all lstat operations in parallel

  // Creates an array of Promises to be processed by Promise.all()
  const statPromises = filenames.map((filename) => {
    return lstat(path.join(targetDir, filename));
  });

  // Waits for all promises to resolve, then spits out a new array w/data inside
  const allStats = await Promise.all(statPromises);

  for (const stats of allStats) {
    const index = allStats.indexOf(stats);

    if (stats.isFile()) {
      console.log(filenames[index]);
    } else {
      console.log(chalk.bold.greenBright(filenames[index]));
    }
  }
});
