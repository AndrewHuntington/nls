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

  // SOLUTION THREE (Optimal):
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

  // OPTIONAL SOLUTION TWO:
  // CALLBACK-BASED FUNCTIONS USING PROMISES (Not Optimal)
  // There are may ways to wrap a function in a Promise
  // See Lecture 330 for more details
  // Drawbacks: Can only do one operation at a time
  // for (const filename of filenames) {
  //   try {
  //     const stats = await lstat(filename);

  //     console.log(filename, stats.isFile());
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // OPTIONAL SOLUTION ONE:
  // A CALLBACK-BASED SOLUTION (Not Optimal)
  // Create an array which holds the values of the callbacks
  // Do not return the array until all values are filled
  // Drawbacks: Doesn't scale well
  // const allStats = Array(filenames.length).fill(null);

  // for (const filename of filenames) {
  //   const index = filenames.indexOf(filename);

  //   fs.lstat(filename, (err, stats) => {
  //     if (err) {
  //       console.log(err);
  //     }

  //     allStats[index] = stats;

  //     const ready = allStats.every((stats) => {
  //       return stats;
  //     });

  //     if (ready) {
  //       allStats.forEach((stats, index) => {
  //         console.log(filenames[index], stats.isFile());
  //       });
  //     }
  //   });
  // }

  // BAD CODE!!!
  // This code can produce a list that varies in order on each execution
  // This is due to how the callback is processed in fs.lstat()
  // Callbacks in node.js often are not called instantly after a function call
  // for (const filename of filenames) {
  //   fs.lstat(filename, (err, stats) => {
  //     if (err) {
  //       console.log(err);
  //     }

  //     console.log(filename, stats.isFile());
  //   });
  // }
});
