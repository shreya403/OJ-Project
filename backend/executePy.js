const { exec } = require("child_process");

const executePy = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    exec(
      `python3 ${filepath} < ${inputPath}`,
      (error, stdout, stderr) => {
        if (error) {
          return reject({ error, stderr });
        }
        if (stderr) {
          return reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executePy,
};
