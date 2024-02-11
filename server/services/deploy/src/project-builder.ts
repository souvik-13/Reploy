export function installDependencies(folderPath: string) {
  return new Promise((resolve, reject) => {
    Bun.spawn(["npm", "install"], {
      cwd: folderPath,
      onExit(subprocess, exitCode, signalCode, error) {
        if (exitCode === 0) {
          //   console.log(subprocess.stdout);
          resolve("");
        } else {
          console.log(error);
          reject("");
        }
      },
    });
  });
}

export function buildProject(folderPath: string) {
  return new Promise((resolve, reject) => {
    Bun.spawn(["npm", "run", "build"], {
      cwd: folderPath,
      onExit(subprocess, exitCode, signalCode, error) {
        if (exitCode === 0) {
          //   console.log(subprocess.stdout);
          resolve("");
        } else {
          console.log(error);
          reject("");
        }
      },
    });
  });
}
