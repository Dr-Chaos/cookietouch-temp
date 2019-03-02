import Account from "@/account";
import ScriptAction, {
  ScriptActionResults
} from "@/scripts/actions/ScriptAction";

export default class SellItemAction extends ScriptAction {
  public _name: string = "SellItemAction";
  public gid: number;
  public lot: number;
  public price: number;

  constructor(gid: number, lot: number, price: number) {
    super();
    this.gid = gid;
    this.lot = lot;
    this.price = price;
  }

  public async process(account: Account): Promise<ScriptActionResults> {
    if (account.game.bid.sellItem(this.gid, this.lot, this.price)) {
      return ScriptAction.processingResult();
    }
    return ScriptAction.doneResult();
  }
}
