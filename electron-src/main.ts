import { app, BrowserWindow, dialog, Menu, ipcMain, IpcMain, OpenDialogOptions } from 'electron';
import { MoneyWellDAO } from './dao';
import * as path from 'path';

let mainWindow: Electron.BrowserWindow;
let menu: Electron.Menu;

let dao: MoneyWellDAO;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "app/index.html"));

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function openFile () {

  let options: OpenDialogOptions = {
    properties: ['openFile']
  };

  dialog.showOpenDialog(mainWindow, options, (filePaths: string[], bookmarks: string[]) => {
    console.log(filePaths);
    
    /* Open the file */
    dao = new MoneyWellDAO(filePaths[0]);
    /* Connect to the database */
    dao.connect()
      .then(() => {
        /* On connect, initially load the accounts */
        dao.loadAccounts()
          .then(result => {
            console.log("loaded")
            console.log(result);

            mainWindow.webContents.send("accountsLoaded", result);
          }, (error) => {
            console.log("Failed to load accounts: ");
            console.log(error);
          });
      }).catch((error) => {
        console.log("Failed to connect");
        console.log(error);
      });

  }); 
 
 }

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { 
          label: 'Open File', 
          accelerator: 'CmdOrCtrl+O',
          click () { openFile(); }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  /* From the electron docs, get the standard mac application name menu back */
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    });
  }

  menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  createMenu();
});

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