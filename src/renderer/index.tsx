import DataConfiguration from "@/configurations/DataConfiguration";
import GlobalConfiguration from "@/configurations/GlobalConfiguration";
import LanguageManager from "@/configurations/language/LanguageManager";
import BreedsUtility from "@/core/BreedsUtility";
import MapPoint from "@/core/pathfinder/MapPoint";
import Pushbullet from "@/core/pushbullet";
// import Spark from "@/core/spark";
import Frames from "@/frames";
import DTConstants from "@/protocol/DTConstants";
import { init } from "@sentry/electron";
import { isDevelopment } from "common/env";
import { ipcRenderer, remote } from "electron";
import "material-design-icons/iconfont/material-icons.css";
import * as React from "react";
import { render } from "react-dom";
import { initialize, presence } from "renderer/FirebaseHelpers";
import "renderer/FontAwesomeIcons";
import { LoadingPage } from "renderer/LoadingPage";
import Main from "renderer/pages/Main";
import { spinnerService } from "renderer/Spinner/Service";
import "typeface-roboto/index.css";

// Spark.setAgent("http://186.193.186.3:20183");
// Spark.get("ip.jsontest.com").then(res => {
//   console.log("test spark", res);
// });

if (!isDevelopment) {
  init({
    dsn: "https://c2de150c591046829235a291351779b7@sentry.io/1237788"
  });
}

render(<LoadingPage />, document.getElementById("app"));

spinnerService.show("mySpinner");

initialize();
presence();

(global as any).API = new Array();

const onGlobalConfigChanged = () => {
  ipcRenderer.send("ask-update", GlobalConfiguration.updatesChannel);
  Pushbullet.changeToken(GlobalConfiguration.pushBulletAccessToken);
  GlobalConfiguration.Updated.off(onGlobalConfigChanged);
};

GlobalConfiguration.Updated.on(onGlobalConfigChanged);

async function main() {
  await DataConfiguration.load();
  await GlobalConfiguration.load();
  LanguageManager.Init();
  await DTConstants.Init();
  await BreedsUtility.Init();
  MapPoint.Init();
  Frames.Init();

  spinnerService.hide("mySpinner");

  render(<Main />, document.getElementById("app"));
}

main();

ipcRenderer.on("go-update", (event: any, info: any) => {
  let message = LanguageManager.trans("releaseAvailable", info.version);
  if (info.releaseNotes) {
    message += LanguageManager.trans("releaseNotes", info.releaseNotes);
  }
  remote.dialog.showMessageBox(
    {
      buttons: [
        LanguageManager.trans("installRelaunch"),
        LanguageManager.trans("later")
      ],
      defaultId: 0,
      detail: message,
      message: LanguageManager.trans(
        "newVersionDownloaded",
        remote.app.getName()
      ),
      type: "question"
    },
    response => {
      if (response === 0) {
        setTimeout(() => ipcRenderer.send("ask-quitAndInstall"), 1);
      }
    }
  );
});

/*const CLEAN = async () => {
  DataConfiguration.removeListeners();
  GlobalConfiguration.removeListeners();

  for (const account of CookieMain.connectedAccounts.ToArray()) {
    await account.stop();
  }

  await signout();
};

AsyncExitHook(cb => {
  CLEAN().then(cb);
});*/
