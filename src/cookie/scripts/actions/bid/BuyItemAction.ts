import Account from "@/account";
import ScriptAction, {
  ScriptActionResults
} from "@/scripts/actions/ScriptAction";

export default class BuyItemAction extends ScriptAction {
  public _name: string = "BuyItemAction";
  public gid: number;
  public lot: number;

  constructor(gid: number, lot: number) {
    super();
    this.gid = gid;
    this.lot = lot;
  }

  public async process(account: Account): Promise<ScriptActionResults> {
    if (await account.game.bid.buyItem(this.gid, this.lot)) {
      return ScriptAction.processingResult();
    }
    return ScriptAction.doneResult();
  }
}
