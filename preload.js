const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
    // If you need to expose specific Node.js modules for the renderers (use with caution):
    // Example:  fs: require('fs'),  // Only if absolutely necessary!
});