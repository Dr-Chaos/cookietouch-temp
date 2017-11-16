import { AccountStates } from "@/AccountStates";
import Account from "@account";

export default class MapFrame {

  private account: Account;

  constructor(account: Account) {
    this.account = account;
    this.register();
  }

  private register() {
    this.account.dispatcher.register("CurrentMapMessage",
      this.HandleCurrentMapMessage, this);
    this.account.dispatcher.register("MapComplementaryInformationsDataMessage",
      this.HandleMapComplementaryInformationsDataMessage, this);
    this.account.dispatcher.register("MapComplementaryInformationsDataInHouseMessage",
      this.HandleMapComplementaryInformationsDataInHouseMessage, this);
    this.account.dispatcher.register("MapComplementaryInformationsWithCoordsMessage",
      this.HandleMapComplementaryInformationsWithCoordsMessage, this);
    this.account.dispatcher.register("StatedMapUpdateMessage",
      this.HandleStatedMapUpdateMessage, this);
    this.account.dispatcher.register("InteractiveMapUpdateMessage",
      this.HandleInteractiveMapUpdateMessage, this);
    this.account.dispatcher.register("StatedElementUpdatedMessage",
      this.HandleStatedElementUpdatedMessage, this);
    this.account.dispatcher.register("InteractiveElementUpdatedMessage",
      this.HandleInteractiveElementUpdatedMessage, this);
    this.account.dispatcher.register("GameMapMovementMessage",
      this.HandleGameMapMovementMessage, this);
    this.account.dispatcher.register("GameMapNoMovementMessage",
      this.HandleGameMapNoMovementMessage, this);
    this.account.dispatcher.register("GameContextRemoveElementMessage",
      this.HandleGameContextRemoveElementMessage, this);
    this.account.dispatcher.register("TeleportOnSameMapMessage",
      this.HandleTeleportOnSameMapMessage, this);
    this.account.dispatcher.register("GameContextRemoveMultipleElementMessage",
      this.HandleGameContextRemoveMultipleElementMessage, this);
    this.account.dispatcher.register("GameRolePlayShowActorMessage",
      this.HandleGameRolePlayShowActorMessage, this);
  }

  private async HandleCurrentMapMessage(account: Account, message: any) {
    if (account.state !== AccountStates.RECAPTCHA) {
      account.state = AccountStates.NONE;
    }

    await account.network.sendMessage("MapInformationsRequestMessage", {
      mapId: message.mapId,
    });

    account.game.managers.movements.updateMap(message.mapId);
  }

  private async HandleMapComplementaryInformationsDataMessage(account: Account, message: any) {
    await account.game.map.UpdateMapComplementaryInformationsDataMessage(account, message);
  }

  private async HandleMapComplementaryInformationsDataInHouseMessage(account: Account, message: any) {
    await account.game.map.UpdateMapComplementaryInformationsDataMessage(account, message);
  }

  private async HandleMapComplementaryInformationsWithCoordsMessage(account: Account, message: any) {
    await account.game.map.UpdateMapComplementaryInformationsDataMessage(account, message);
  }

  private async HandleStatedMapUpdateMessage(account: Account, message: any) {
    await account.game.map.UpdateStatedMapUpdateMessage(account, message);
  }

  private async HandleInteractiveMapUpdateMessage(account: Account, message: any) {
    await account.game.map.UpdateInteractiveMapUpdateMessage(account, message);
  }

  private async HandleStatedElementUpdatedMessage(account: Account, message: any) {
    await account.game.map.UpdateStatedElementUpdatedMessage(account, message);
  }

  private async HandleInteractiveElementUpdatedMessage(account: Account, message: any) {
    await account.game.map.UpdateInteractiveElementUpdatedMessage(account, message);
  }

  private async HandleGameMapMovementMessage(account: Account, message: any) {
    if (account.state === AccountStates.FIGHTING) {
      return;
    }

    await account.game.map.UpdateGameMapMovementMessage(account, message);
    await account.game.managers.movements.UpdateGameMapMovementMessage(account, message);
  }

  private async HandleGameMapNoMovementMessage(account: Account, message: any) {
    if (account.state === AccountStates.FIGHTING || account.state === AccountStates.RECAPTCHA) {
      return;
    }

    account.state = AccountStates.NONE;
    await account.game.managers.movements.UpdateGameMapNoMovementMessage(account, message);
  }

  private async HandleGameContextRemoveElementMessage(account: Account, message: any) {
    await account.game.map.UpdateGameContextRemoveElementMessage(account, message);
  }

  private async HandleTeleportOnSameMapMessage(account: Account, message: any) {
    const player = account.game.map.players.find((p) => p.id === message.targetId);

    if (player !== null) {
      player.UpdateTeleportOnSameMapMessage(message);
    }
  }

  private async HandleGameContextRemoveMultipleElementMessage(account: Account, message: any) {
    await account.game.map.UpdateGameContextRemoveMultipleElementMessage(account, message);
  }

  private async HandleGameRolePlayShowActorMessage(account: Account, message: any) {
    await account.game.map.UpdateGameRolePlayShowActorMessage(account, message);
  }
}
