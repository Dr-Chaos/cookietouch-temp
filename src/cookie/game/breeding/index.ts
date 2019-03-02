import Account from "@/account";
import { AccountStates } from "@/account/AccountStates";
import ExchangeLeaveMessage from "@/protocol/network/messages/ExchangeLeaveMessage";
import ExchangeStartOkMountMessage from "@/protocol/network/messages/ExchangeStartOkMountMessage";
// import MountClientData from "@/protocol/network/types/MountClientData";
import IClearable from "@/utils/IClearable";
import LiteEvent from "@/utils/LiteEvent";

export default class Breeding implements IClearable {
  private account: Account;
  // private paddockedMountsDescription: MountClientData[] = [];
  // private stabledMountsDescription: MountClientData[] = [];
  private readonly onPaddockOpened = new LiteEvent<void>();
  private readonly onPaddockLeft = new LiteEvent<void>();

  constructor(account: Account) {
    this.account = account;
  }

  public get PaddockOpened() {
    return this.onPaddockOpened.expose();
  }

  public get PaddockLeft() {
    return this.onPaddockLeft.expose();
  }

  public clear() {
    // this.paddockedMountsDescription = [];
    // this.stabledMountsDescription = [];
  }

  public UpdateExchangeStartOkMountMessage(
    message: ExchangeStartOkMountMessage
  ) {
    this.account.state = AccountStates.PADDOCK;
    // this.paddockedMountsDescription = message.paddockedMountsDescription;
    // this.stabledMountsDescription = message.stabledMountsDescription;
    this.onPaddockOpened.trigger();
  }

  public async UpdateExchangeLeaveMessage(message: ExchangeLeaveMessage) {
    if (this.account.state !== AccountStates.PADDOCK) {
      return;
    }

    this.account.state = AccountStates.NONE;
    this.clear();
    this.onPaddockLeft.trigger();
  }
}
