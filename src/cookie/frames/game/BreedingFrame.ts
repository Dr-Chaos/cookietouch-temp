import Account from "@/account";
import Frames, { IFrame } from "@/frames";
import ExchangeLeaveMessage from "@/protocol/network/messages/ExchangeLeaveMessage";
import ExchangeStartOkMountMessage from "@/protocol/network/messages/ExchangeStartOkMountMessage";

export default class BreedingFrame implements IFrame {
  public register() {
    Frames.dispatcher.register(
      "ExchangeStartOkMountMessage",
      this.HandleExchangeStartOkMountMessage,
      this
    );
    Frames.dispatcher.register(
      "ExchangeLeaveMessage",
      this.HandleExchangeLeaveMessage,
      this
    );
  }

  private async HandleExchangeStartOkMountMessage(
    account: Account,
    message: ExchangeStartOkMountMessage
  ) {
    await account.game.breeding.UpdateExchangeStartOkMountMessage(message);
  }

  private async HandleExchangeLeaveMessage(
    account: Account,
    message: ExchangeLeaveMessage
  ) {
    account.game.breeding.UpdateExchangeLeaveMessage(message);
  }
}
