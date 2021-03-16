const { app, BrowserWindow, Tray, Menu, Notification } = require('electron')
var AutoLaunch = require('auto-launch');
var iconpath = __dirname + '/web/icon.png';

function showNotification () {
  const notification = {
    title: 'Пора размять глаза!',
    body: 'Вам пора сделать упражнения для профилактики и восстановления зрения!'
  }
  new Notification(notification).show()
}

function createWindow () {
  const win = new BrowserWindow({
    resizable: false,
    width: 800,
    height: 600,
    icon: iconpath,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('./web/index.html');

  // Сворачивание в трей
  tray = new Tray(iconpath);

  win.on('close', function (event) {
      event.preventDefault();
      win.hide();
      event.returnValue = false;
    
  });

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Открыть', click: function () {
        win.show();
      }
    },
    {
      label: 'Выйти', click: function () {
        isQuiting = true;
        app.quit();
      }
    }
  ]));
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  if (process.platform === 'win64' || process.platform === 'win32') {
      app.setAppUserModelId("com.ikobit.desktop-notifications");
      // Напоминание
      showNotification(); //Make sure the function fires as soon as the page is loaded

      // Каждые 30 мин
      setTimeout(showNotification, 1800000);
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

var autoLauncher = new AutoLaunch({
    name: "Eye Save",
    path: app.getPath('exe'),
});
// Checking if autoLaunch is enabled, if not then enabling it.
autoLauncher.isEnabled().then(function(isEnabled) {
  if (isEnabled) return;
   autoLauncher.enable();
}).catch(function (err) {
  throw err;
});
