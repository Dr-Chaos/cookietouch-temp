import Account from "@/account";
import { AccountStates } from "@/account/AccountStates";
import DocumentReadingBeginMessage from "@/protocol/network/messages/DocumentReadingBeginMessage";
import QuestListMessage from "@/protocol/network/messages/QuestListMessage";
import QuestStartedMessage from "@/protocol/network/messages/QuestStartedMessage";
import QuestStepInfoMessage from "@/protocol/network/messages/QuestStepInfoMessage";
import QuestStepInfoRequestMessage from "@/protocol/network/messages/QuestStepInfoRequestMessage";
import QuestValidatedMessage from "@/protocol/network/messages/QuestValidatedMessage";
import QuestActiveDetailedInformations from "@/protocol/network/types/QuestActiveDetailedInformations";
import QuestActiveInformations from "@/protocol/network/types/QuestActiveInformations";
import LiteEvent from "@/utils/LiteEvent";

export default class Quests {
  private account: Account;
  private finishedQuests: number[];
  private ongoingQuests: number[];

  private onQuestStepInfo = new LiteEvent<QuestStepInfoMessage>();

  constructor(account: Account) {
    this.account = account;
    this.finishedQuests = [];
    this.ongoingQuests = [];
  }

  public get QuestStepInfo() {
    return this.onQuestStepInfo.expose();
  }

  public isOngoing(questId: number) {
    return this.ongoingQuests.includes(questId);
  }

  public isCompleted(questId: number) {
    return this.finishedQuests.includes(questId);
  }

  public async currentStep(questId: number) {
    const infos = await this.questInfos(questId);
    if (infos instanceof QuestActiveDetailedInformations) {
      return infos.stepId;
    }
    return -1;
  }

  public async objectivesNeeded(questId: number): Promise<number[]> {
    const info = await this.questInfos(questId);
    if (info._type === "QuestActiveDetailedInformations") {
      const infos = info as QuestActiveDetailedInformations;
      return infos.objectives
        .filter(objective => objective.objectiveStatus)
        .map(objective => objective.objectiveId);
    }
    return [];
  }

  public async needObjective(questId: number, objectiveId: number) {
    const objectives = await this.objectivesNeeded(questId);
    return objectives.includes(objectiveId);
  }

  public UpdateQuestListMessage(message: QuestListMessage) {
    for (const questId of message.finishedQuestsIds) {
      this.account.game.quests.finishedQuests.push(questId);
    }

    for (const quest of message.activeQuests) {
      this.account.game.quests.ongoingQuests.push(quest.questId);
    }
  }

  public UpdateQuestStartedMessage(message: QuestStartedMessage) {
    this.account.game.quests.ongoingQuests.push(message.questId);
  }

  public UpdateQuestStepInfoMessage(message: QuestStepInfoMessage) {
    this.onQuestStepInfo.trigger(message);
  }

  public UpdateQuestValidatedMessage(message: QuestValidatedMessage) {
    this.account.game.quests.finishedQuests.push(message.questId);

    const index = this.account.game.quests.ongoingQuests.indexOf(
      message.questId
    );
    if (index > -1) {
      this.account.game.quests.ongoingQuests.splice(index, 1);
    }
  }

  public UpdateDocumentReadingBeginMessage(
    message: DocumentReadingBeginMessage
  ) {
    this.account.state = AccountStates.TALKING;
  }

  private questInfos(
    questId: number
  ): Promise<QuestActiveInformations | QuestActiveDetailedInformations> {
    return new Promise((resolve, reject) => {
      if (!this.isOngoing(questId)) {
        reject();
        return;
      }

      const timeoutId = setTimeout(() => reject(), 5000);
      this.QuestStepInfo.once(message => {
        clearTimeout(timeoutId);
        resolve(message.infos);
      });

      this.account.network.sendMessageFree("QuestStepInfoRequestMessage", {
        questId
      } as QuestStepInfoRequestMessage);
    });
  }
}
