import Account from "@/account";
import CraftAction from "@/scripts/actions/craft/CraftAction";

export default class CraftAPI {
  private account: Account;
  constructor(account: Account) {
    this.account = account;
  }
  public async craft(gid: number, qty: number): Promise<boolean> {
    await this.account.scripts.actionsManager.enqueueAction(
      new CraftAction(gid, qty),
      true
    );
    return true;
  }
}
