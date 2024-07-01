const { Server: SocketServer } = require("socket.io");
const fs = require("fs/promises");
const path = require("path");
const pty = require("node-pty");
const chokidar = require('chokidar');
const os = require('os');
const { default: axios } = require("axios");

module.exports = function initWs(server) {
  const initCwd = process.env.INIT_CWD || __dirname;
  const userDir = path.resolve(initCwd, "user");
  let docId;
  console.log("User directory:", userDir);

  async function verifyDirectory(directory) {
    try {
      await fs.access(directory);
      console.log("Directory exists:", directory);
    } catch (error) {
      console.error("Directory does not exist:", directory);
      // Create the directory if it does not exist
      await fs.mkdir(directory, { recursive: true });
      console.log("Directory created:", directory);
    }
  }

  verifyDirectory(userDir).then(() => {
    
    console.log("Verified user directory:", userDir);
    let shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    const ptyProcess = pty.spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: userDir,
      env: process.env,
    });

    const io = new SocketServer({
      cors: "*",
    });
    io.attach(server);

    ptyProcess.onData((data) => {
      io.emit("terminal:data", data);
    });
    chokidar.watch(userDir).on('all', (event, filePath) => {
      io.emit('file:refresh', filePath);
     });
    io.on("connection", (socket) => {
      console.log("a user connected");
      socket.emit('file:refresh');
      socket.on("terminal:write", (data) => {
        console.log("Term", data);
        ptyProcess.write(data);
      });
      socket.on('set:id', ({id})=>{
          docId = id;
      })
      socket.on('file:change', async ({ path: filePath, content }) => {
        await fs.writeFile(path.join( filePath), content);
    });
      socket.on("disconnect", () => {
        console.log("user disconnected");
        axios.post('http://localhost:3001/stopcontainer', {docId:docId})
      });
    });
  }).catch(err => {
    console.error("Failed to verify directory:", err);
  });
}
