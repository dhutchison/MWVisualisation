import { app, BrowserWindow, ipcMain } from 'electron';
import { MoneyWellDAO } from './dao';
import * as path from 'path';

// import * as sqlite3 from 'sqlite3';

// const MoneyWellDAO = require('./dao') 

//   const path = require('path')   
//   const url = require('url')

//   var db;

//   function createWindow () {     
//     // Create the browser window.     
//     mainWindow = new BrowserWindow({width: 800, height: 600}) 

//     // and load the index.html of the app.     
//     mainWindow.loadURL(url.format({      
//       pathname: path.join(__dirname, 'dist/MW-Visualisation/index.html'),       
//       protocol: 'file:',      
//       slashes: true     
//     }))   

//     // Open the DevTools.
//     mainWindow.webContents.openDevTools()

//     ipcMain.on("databaseFileSelected", (event, arg) => {

//       console.log('Got:');
//         console.log(event);
//         console.log(arg);
//         //TODO: Hard coded

//     dao = new MoneyWellDAO('/Users/david/Documents/Bank/MW_Visualisation/persistentStore');
//     let transactions = dao.loadTransactions();

//       console.log(transactions);

//     });

//   } 

let mainWindow: Electron.BrowserWindow;


function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "app/index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Listen for database file selected events
  ipcMain.on("databaseFileSelected", (event:any, arg:any) => {

    console.log('Got:');
    console.log(event);
    console.log(arg);
    //TODO: Hard coded

    let dao = new MoneyWellDAO('/Users/david/Documents/Bank/MW_Visualisation/persistentStore');
    let transactions = dao.loadTransactions();

    console.log(transactions);

  });

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});