import Account from "@/account";
import LanguageManager from "@/configurations/language/LanguageManager";

import * as fs from "fs";
import * as path from "path";

export default class ThemeManager {
  public currentThemeName: string | undefined;
  private account: Account;

  constructor(account: Account) {
    this.account = account;
  }

  public fromFile(filePath: string) {
    if (!fs.existsSync(filePath) || path.extname(filePath) !== ".json") {
      this.account.logger.logError(
        LanguageManager.trans("script"),
        LanguageManager.trans("scriptErrorFormat")
      );
      return;
    }
    this.currentThemeName = path.basename(filePath, ".json");
    this.account.logger.logInfo(
      LanguageManager.trans("script"),
      LanguageManager.trans("scriptLoaded", path.basename(filePath, ".js"))
    );
  }

}
