import Account from "@/account";
import ScriptAction, {
  ScriptActionResults
} from "@/scripts/actions/ScriptAction";
import { sleep } from "@/utils/Time";

export default class ExchangePutAllItemsAction extends ScriptAction {
  public _name: string = "ExchangePutAllItemsAction";

  public async process(account: Account): Promise<ScriptActionResults> {
    if (await account.game.exchange.putAllItems()) {
      await sleep(2000);
    }
    return ScriptAction.doneResult();
  }
}
