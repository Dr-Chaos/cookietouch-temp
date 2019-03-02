import Account from "@/account";
import Frames, { IFrame } from "@/frames";
import ObjectAveragePricesMessage from "@/protocol/network/messages/ObjectAveragePricesMessage";

export default class AveragePricesFrame implements IFrame {
  public register() {
    Frames.dispatcher.register(
      "ObjectAveragePricesMessage",
      this.HandleObjectAveragePricesMessage,
      this
    );
  }

  private async HandleObjectAveragePricesMessage(
    account: Account,
    data: ObjectAveragePricesMessage
  ) {
    //
  }
}
