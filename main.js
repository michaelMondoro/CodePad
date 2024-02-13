const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require("node:path")
const fs = require('fs')
const ejse = require('ejs-electron')
const zipper = require('zip-local')


var win;
var rootFolder;

// Function to create app window
const createWindow = () => {
    win = new BrowserWindow({
        width: 1000,
        height: 750,
        // titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }
    })
    win.loadFile('./static/templates/index.ejs')
        
    // win.webContents.openDevTools()
}


/*
    Read data on startup
*/
function readData() {
    let data = []
    let dirs = []
    files = fs.readdirSync(rootFolder)
    files.forEach(file => {
        if (fs.lstatSync(rootFolder+"/"+file).isDirectory()){
            dirs.push(file)
            dirFiles = fs.readdirSync(`${rootFolder}/${file}/`)
            dirFiles.forEach(dirFile => {
                contents = fs.readFileSync(`${rootFolder}/${file}/${dirFile}`, 'utf-8')
                data.push({"name":dirFile, "snippet":contents, "lang":file})
            })
        } else {
            contents = fs.readFileSync(`${rootFolder}/${file}`, 'utf-8')
            data.push({"name":file, "snippet":contents, "lang":""})
        } 
    })
    return [data,dirs]
}

/*
    Refresh app
*/
function updateData(event) {
    let [data, dirs] = readData()

    ejse.data({"snippets":data, "dirs":dirs})
    console.log("updated ej data")
    win.webContents.reloadIgnoringCache()
    // win.webContents.executeJavaScript("updateData()")
}

/*
    Save new snippet
*/
function saveSnippet(event, name, content, language) {
    try {
        fs.lstatSync(`${rootFolder}/${language}`)
    } catch (err) {
        fs.mkdirSync(`${rootFolder}/${language}`)
    }

    fs.writeFileSync(`${rootFolder}/${language}/${name}`, content)
    console.log("saved successfully")
    updateData()
}

/*
    Export snippets
*/
function exportSnippets() {
    dialog.showSaveDialog({properties: ['saveFile']}).then((res) => {
        console.log(res.filePath);
        if (res.filePath != "") {
            zipper.sync.zip(`${rootFolder}`).compress().save(`${res.filePath}.zip`);
            console.log('saved')
            win.webContents.executeJavaScript(`alert('saved to ${res.filePath}.zip')`)
        }
    })
    

}

/*
    Delete snippet
*/
function deleteSnippet(event, name, lang) {
    const options = {
        type: 'question',
        buttons: ['Cancel', 'Delete'],
        defaultId: 2,
        title: 'Delete Snippet',
        message: 'Are you sure you want to delete this snippet?',
        detail: 'This cannot be undone',
      };
    
    dialog.showMessageBox(options).then((result) => {
        console.log(result)
        if (result.response === 1) {
            console.log("removing " + lang + "/" +name)
            fs.unlinkSync(`${rootFolder}/${lang}/${name}`)
            console.log('------')
            files = fs.readdirSync(`${rootFolder}/${lang}/`)
            if (files.length === 0) {
                fs.rmdirSync(`${rootFolder}/${lang}/`)
                console.log('removed dir')
            }
            updateData()
        }  
    })
     
}

/*
    Main
*/
// Start app
app.whenReady().then(() => {
    a = fs.readdirSync(app.getPath("userData"))
    if (!a.includes("snippets")) {
        fs.mkdir(`${app.getPath('userData')}/snippets`, () => {
            console.log('create snippets dir')
        })
    }


    rootFolder = `${app.getPath('userData')}/snippets`
    console.log(rootFolder)
    console.log("----")
    createWindow()
    let [data, dirs] = readData()

    ejse.data({"snippets":data, "dirs":dirs})
    ipcMain.on('save-snippet', saveSnippet)
    ipcMain.on('delete-snippet', deleteSnippet)
    ipcMain.on('export', exportSnippets)
})

