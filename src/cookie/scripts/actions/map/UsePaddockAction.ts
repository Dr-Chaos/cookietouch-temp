import Account from "@/account";
import LanguageManager from "@/configurations/language/LanguageManager";
import ScriptAction, {
  ScriptActionResults
} from "@/scripts/actions/ScriptAction";

export default class UsePaddockAction extends ScriptAction {
  public _name: string = "UsePaddockAction";

  public async process(account: Account): Promise<ScriptActionResults> {
    if (!account.game.map.paddock) {
      return ScriptAction.failedResult();
    }
    if (
      account.game.managers.interactives.useInteractiveByCellId(
        account.game.map.paddock.cellId
      )
    ) {
      return ScriptAction.processingResult();
    }
    account.scripts.stopScript(
      LanguageManager.trans(
        "errorInteractiveCell",
        account.game.map.paddock.cellId
      )
    );
    return ScriptAction.failedResult();
  }
}
