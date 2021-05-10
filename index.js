#!/usr/bin/env node

// Get access to the File System Module
const fs = require("fs");

// Provides an lstat method that returns a Promise
const { lstat } = fs.promises;

// process.cwd() returns the current working dir
// the Process Module is automatically added to the global scope of every project
fs.readdir(process.cwd(), async (err, filenames) => {
  if (err) {
    // error handling code
    console.log(err);
  }

  // PROMISE.ALL-BASED SOLUTION
  // Does all lstat operations in parallel

  // Creates an array of Promises to be processed by Promise.all()
  const statPromises = filenames.map((filename) => {
    return lstat(filename);
  });

  // Waits for all promises to resolve, then spits out a new array w/data inside
  const allStats = await Promise.all(statPromises);

  for (const stats of allStats) {
    const index = allStats.indexOf(stats);

    console.log(filenames[index], stats.isFile());
  }
});
