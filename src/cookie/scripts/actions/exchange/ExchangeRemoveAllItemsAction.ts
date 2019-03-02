import Account from "@/account";
import ScriptAction, {
  ScriptActionResults
} from "@/scripts/actions/ScriptAction";
import { sleep } from "@/utils/Time";

export default class ExchangeRemoveAllItemsAction extends ScriptAction {
  public _name: string = "ExchangeRemoveAllItemsAction";

  public async process(account: Account): Promise<ScriptActionResults> {
    if (await account.game.exchange.removeAllItems()) {
      await sleep(2000);
    }
    return ScriptAction.doneResult();
  }
}
