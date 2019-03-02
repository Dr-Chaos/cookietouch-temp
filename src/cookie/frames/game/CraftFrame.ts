import Account from "@/account";
import Frames, { IFrame } from "@/frames";
import ExchangeCraftResultMessage from "@/protocol/network/messages/ExchangeCraftResultMessage";
import ExchangeCraftResultWithObjectDescMessage from "@/protocol/network/messages/ExchangeCraftResultWithObjectDescMessage";
import ExchangeItemAutoCraftRemainingMessage from "@/protocol/network/messages/ExchangeItemAutoCraftRemainingMessage";
import ExchangeItemAutoCraftStopedMessage from "@/protocol/network/messages/ExchangeItemAutoCraftStopedMessage";
import ExchangeObjectAddedMessage from "@/protocol/network/messages/ExchangeObjectAddedMessage";
import ExchangeReplayCountModifiedMessage from "@/protocol/network/messages/ExchangeReplayCountModifiedMessage";
import ExchangeStartOkCraftMessage from "@/protocol/network/messages/ExchangeStartOkCraftMessage";
import ExchangeStartOkCraftWithInformationMessage from "@/protocol/network/messages/ExchangeStartOkCraftWithInformationMessage";

export default class CraftFrame implements IFrame {
  public register() {
    Frames.dispatcher.register(
      "ExchangeObjectAddedMessage",
      this.HandleExchangeObjectAddedMessage,
      this
    );
    Frames.dispatcher.register(
      "ExchangeStartOkCraftWithInformationMessage",
      this.HandleExchangeStartOkCraftWithInformationMessage,
      this
    );
    Frames.dispatcher.register(
      "ExchangeReplayCountModifiedMessage",
      this.HandleExchangeReplayCountModifiedMessage,
      this
    );
    Frames.dispatcher.register(
      "ExchangeCraftResultMessage",
      this.HandleExchangeCraftResultMessage,
      this
    );
    Frames.dispatcher.register(
      "ExchangeCraftResultWithObjectDescMessage",
      this.HandleExchangeCraftResultWithObjectDescMessage,
      this
    );
    Frames.dispatcher.register(
      "ExchangeStartOkCraftMessage",
      this.HandleExchangeStartOkCraftMessage,
      this
    );
    Frames.dispatcher.register(
      "ExchangeItemAutoCraftRemainingMessage",
      this.HandleExchangeItemAutoCraftRemainingMessage,
      this
    );
    Frames.dispatcher.register(
      "ExchangeItemAutoCraftStopedMessage",
      this.HandleExchangeItemAutoCraftStopedMessage,
      this
    );
  }

  private async HandleExchangeStartOkCraftWithInformationMessage(
    account: Account,
    message: ExchangeStartOkCraftWithInformationMessage
  ) {
    account.game.craft.UpdateExchangeStartOkCraftWithInformationMessage(
      message
    );
  }

  private async HandleExchangeReplayCountModifiedMessage(
    account: Account,
    message: ExchangeReplayCountModifiedMessage
  ) {
    account.game.craft.UpdateExchangeReplayCountModifiedMessage(message);
  }

  private async HandleExchangeObjectAddedMessage(
    account: Account,
    message: ExchangeObjectAddedMessage
  ) {
    account.game.craft.UpdateExchangeObjectAddedMessage(message);
  }

  private async HandleExchangeCraftResultMessage(
    account: Account,
    message: ExchangeCraftResultMessage
  ) {
    account.game.craft.UpdateExchangeCraftResultMessage(message);
  }

  private async HandleExchangeCraftResultWithObjectDescMessage(
    account: Account,
    message: ExchangeCraftResultWithObjectDescMessage
  ) {
    account.game.craft.UpdateExchangeCraftResultWithObjectDescMessage(message);
  }

  private async HandleExchangeStartOkCraftMessage(
    account: Account,
    message: ExchangeStartOkCraftMessage
  ) {
    account.game.craft.UpdateExchangeStartOkCraftMessage(message);
  }

  private async HandleExchangeItemAutoCraftRemainingMessage(
    account: Account,
    message: ExchangeItemAutoCraftRemainingMessage
  ) {
    account.game.craft.UpdateExchangeItemAutoCraftRemainingMessage(message);
  }

  private async HandleExchangeItemAutoCraftStopedMessage(
    account: Account,
    message: ExchangeItemAutoCraftStopedMessage
  ) {
    account.game.craft.UpdateExchangeItemAutoCraftStopedMessage(message);
  }
}
