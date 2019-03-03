import Account from "@/account";

export default class QuestsAPI {
  private account: Account;
  constructor(account: Account) {
    this.account = account;
  }

  public isOngoing(questId: number): boolean {
    return this.account.game.quests.isOngoing(questId);
  }

  public isCompleted(questId: number): boolean {
    return this.account.game.quests.isCompleted(questId);
  }

  public currentStep(questId: number): Promise<number> {
    return this.account.game.quests.currentStep(questId);
  }

  public objectivesNeeded(questId: number): Promise<number[]> {
    return this.account.game.quests.objectivesNeeded(questId);
  }

  public needObjective(questId: number, objectiveId: number): Promise<boolean> {
    return this.account.game.quests.needObjective(questId, objectiveId);
  }
}
