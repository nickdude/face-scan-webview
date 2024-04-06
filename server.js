// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const fs = require('fs');
// const { exec } = require('child_process');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const imageCounts = {}; // Object to track image counts for each user
// const totalPackagesReceived = {}; // Object to track total packages received for each user
// const clients = {}; // Object to track connected clients

// app.use(express.static(path.join(__dirname, 'build')));

// io.on('connection', (socket) => {
//   console.log('Client connected');

//   let userId = null;

//   socket.on('setUserId', (id) => {
//     userId = id;
//     imageCounts[userId] = 0; // Initialize image count for the user
//     totalPackagesReceived[userId] = 0; // Initialize total package count for the user
//     clients[userId] = socket; // Add client socket to clients object
//     console.log(`User ID set to: ${userId}`);
//   });

//   socket.on('image', (data) => {
//     console.log(`Received image ${imageCounts[userId]} from user ${userId}`);
    
//     if (userId) {
//       const fileName = `capturedImages_${userId}.txt`;
//       if (!fs.existsSync(fileName)) {
//         fs.writeFileSync(fileName, '', 'utf-8');
//       }

//       fs.appendFileSync(fileName, `${data.image}\n`, 'utf-8');
//       imageCounts[userId]++; // Increment image count for the user
//       totalPackagesReceived[userId]++; // Increment total package count for the user
//       console.log(`Image ${imageCounts[userId] - 1} stored for user ${userId}`); // Adjusted index for logging

//       if (imageCounts[userId] === 900) { // Check if all 900 images are received
//         const pythonScript = 'practice.py';
//         const pythonPath = '/usr/bin/python3.8'; // Specify the full path to Python 3.8 executable
//         exec(`${pythonPath} ${pythonScript} ${fileName}`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
//           if (error) {
//             console.error(`Error executing ${pythonScript}: ${error}`);
//             return;
//           }
//           console.log(`Python script output: ${stdout}`);
//           socket.emit('success', { message: stdout }); // Emit success message to the client
//         });
//       }
//     }
//   });

//   socket.on('heartbeat', () => {
//     // Reset a timeout or do something to keep the connection alive
//     console.log(`Received heartbeat from user ${userId}`);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//     if (userId && imageCounts[userId]) {
//       delete imageCounts[userId]; // Remove image count for the disconnected user
//       delete totalPackagesReceived[userId]; // Remove total package count for the disconnected user
//     }
//     if (clients[userId]) {
//       delete clients[userId]; // Remove client socket from clients object
//     }
//   });

//   socket.on('getTotalPackages', () => {
//     if (userId && totalPackagesReceived[userId]) {
//       console.log(`Total packages received from user ${userId}: ${totalPackagesReceived[userId]}`);
//     }
//   });
// });

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// const PORT = 4000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const https = require('https');
const socketIo = require('socket.io');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();

// Configure SSL/TLS
const serverOptions = {
    key: fs.readFileSync('/etc/letsencrypt/archive/face-scan-web.actofit.com/privkey1.pem'), // Full path to your private key file
    cert: fs.readFileSync('/etc/letsencrypt/archive/face-scan-web.actofit.com/cert1.pem'), // Full path to your certificate file
};
  

const server = https.createServer(serverOptions, app);
const io = socketIo(server);

const imageCounts = {}; // Object to track image counts for each user
const clients = {}; // Object to track connected clients

app.use(express.static(path.join(__dirname, 'build')));

io.on('connection', (socket) => {
  console.log('Client connected');

  let userId = null;

  socket.on('setUserId', (id) => {
    userId = id;
    imageCounts[userId] = 0; // Initialize image count for the user
    clients[userId] = socket; // Add client socket to clients object
    console.log(`User ID set to: ${userId}`);
  });

  socket.on('image', (data) => {
    console.log(`Received image ${imageCounts[userId]} from user ${userId}`);
    
    if (userId) {
      const fileName = `capturedImages_${userId}.txt`;
      if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, '', 'utf-8');
      }

      fs.appendFileSync(fileName, `${data.image}\n`, 'utf-8');
      imageCounts[userId]++; // Increment image count for the user
      console.log(`Image ${imageCounts[userId] - 1} stored for user ${userId}`);

      if (imageCounts[userId] === 900) { // Check if all 900 images are received
        const pythonScript = 'practice.py';
        const pythonPath = '/usr/bin/python3.8'; // Specify the full path to Python 3.8 executable
        exec(`${pythonPath} ${pythonScript} ${fileName}`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing ${pythonScript}: ${error}`);
            return;
          }
          console.log(`Python script output: ${stdout}`);
          socket.emit('success', { message: stdout }); // Emit success message to the client
        });
      }
    }
  });

  socket.on('heartbeat', () => {
    // Reset a timeout or do something to keep the connection alive
    console.log(`Received heartbeat from user ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (userId && imageCounts[userId]) {
      delete imageCounts[userId]; // Remove image count for the disconnected user
    }
    if (clients[userId]) {
      delete clients[userId]; // Remove client socket from clients object
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});