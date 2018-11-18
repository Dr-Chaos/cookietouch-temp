import Account from "@/account";
import ReadyAction from "@/scripts/actions/craft/ReadyAction";
import SetQuantityAction from "@/scripts/actions/craft/SetQuantityAction";
import SetRecipeAction from "@/scripts/actions/craft/SetRecipeAction";

export default class CraftAPI {
  private account: Account;
  constructor(account: Account) {
    this.account = account;
  }
  public async setRecipe(gid: number): Promise<boolean> {
    await this.account.scripts.actionsManager.enqueueAction(
      new SetRecipeAction(gid),
      true
    );
    return true;
  }
  public async setQuantity(count: number): Promise<boolean> {
    await this.account.scripts.actionsManager.enqueueAction(
      new SetQuantityAction(count),
      true
    );
    return true;
  }
  public async ready() {
    await this.account.scripts.actionsManager.enqueueAction(
      new ReadyAction(),
      true
    );
  }
}
