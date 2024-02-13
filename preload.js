const { contextBridge, ipcRenderer } = require("electron")
const fs = require("fs")

// expose data/functions to renderer.js
contextBridge.exposeInMainWorld('world', {
    node: () => process.versions.node,
    saveSnippet: (name, data, language) => ipcRenderer.send('save-snippet', name, data, language),
    deleteSnippet: (name, language) => ipcRenderer.send('delete-snippet', name, language),
    saveCategory: (name) => ipcRenderer.send('save-category', name),
    exportSnippets: () => ipcRenderer.send('export')
})

