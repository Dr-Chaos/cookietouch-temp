import Account from "@/account";
import BuyAction from "@/scripts/actions/npcs/BuyAction";
import NpcAction from "@/scripts/actions/npcs/NpcAction";
import NpcBankAction from "@/scripts/actions/npcs/NpcBankAction";
import ReplyAction from "@/scripts/actions/npcs/ReplyAction";
import SellAction from "@/scripts/actions/npcs/SellAction";

export default class NpcAPI {
  private account: Account;

  constructor(account: Account) {
    this.account = account;
  }

  public async npcBank(npcId: number, replyId: number): Promise<boolean> {
    if (npcId > 0 && !this.account.game.map.npcs.find(n => n.npcId === npcId)) {
      return false;
    }
    await this.account.scripts.actionsManager.enqueueAction(
      new NpcBankAction(npcId, replyId),
      true
    );
    return true;
  }

  public async npc(npcId: number, actionIndex: number): Promise<boolean> {
    if (npcId > 0 && !this.account.game.map.npcs.find(n => n.npcId === npcId)) {
      return false;
    }
    await this.account.scripts.actionsManager.enqueueAction(
      new NpcAction(npcId, actionIndex),
      true
    );
    return true;
  }

  public async reply(replyId: number) {
    await this.account.scripts.actionsManager.enqueueAction(
      new ReplyAction(replyId),
      true
    );
  }

  public async sell(gid: number, quantity: number): Promise<boolean> {
    await this.account.scripts.actionsManager.enqueueAction(
      new SellAction(gid, quantity),
      true
    );
    return true;
  }

  public async buy(gid: number, quantity: number): Promise<boolean> {
    await this.account.scripts.actionsManager.enqueueAction(
      new BuyAction(gid, quantity),
      true
    );
    return true;
  }
}
