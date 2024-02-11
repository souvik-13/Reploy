// // Run the services
// import path from "path";

// const startRedis = Bun.spawn(["sudo", "service", "redis-server", "restart"]);

// const uploadProcess = Bun.spawn(["bun", path.join("dist", "index.js")], {
//   cwd: path.join(__dirname, "services", "upload"),
//   onStdout: (data: Buffer) => console.log(data.toString()),
//   onStderr: (data: Buffer) => console.error(data.toString()),
// });

// const deployProcess = Bun.spawn(["bun", path.join("dist", "index.js")], {
//   cwd: path.join(__dirname, "services", "deploy"),
//   onStdout: (data: Buffer) => console.log(data.toString()),
//   onStderr: (data: Buffer) => console.error(data.toString()),
// });

// const requestHandlerProcess = Bun.spawn(["bun", path.join("dist", "index.js")], {
//   cwd: path.join(__dirname, "services", "request-handler"),
//   onStdout: (data: Buffer) => console.log(data.toString()),
//   onStderr: (data: Buffer) => console.error(data.toString()),
// });
