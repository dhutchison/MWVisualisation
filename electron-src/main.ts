import { app, BrowserWindow, ipcMain, IpcMain } from 'electron';
import { MoneyWellDAO } from './dao';
import * as path from 'path';

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
    dao.connect()
      .then(() => {
        dao.loadAccounts()
          .then(result => {
            console.log("loaded")
            console.log(result);

            event.sender.send("accountsLoaded", result);
          }, (error) => {
            console.log("Failed to load accounts: ");
            console.log(error);
          });
      }).catch((error) => {
        console.log("Failed to connect");
        console.log(error);
      });
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