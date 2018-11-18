import { BrowserWindow } from "electron";

export default class Main {
  private static mainWindow: Electron.BrowserWindow | null;
  private static application: Electron.App;
  // tslint:disable-next-line:variable-name
  private static BrowserWindow: typeof Electron.BrowserWindow;

  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      Main.application.quit();
    }
  }

  private static onClose() {
    // Dereference the window object.
    Main.mainWindow = null;
  }

  private static onReady() {
    Main.mainWindow = new Main.BrowserWindow({ width: 800, height: 600 });
    Main.mainWindow!.loadURL("file://" + __dirname + "/index.html");
    Main.mainWindow!.on("closed", Main.onClose);
  }

  public static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("ready", Main.onReady);
  }
}

/*
import { app, BrowserWindow } from "electron";
import Main from "./Main";

Main.main(app, BrowserWindow);
*/
