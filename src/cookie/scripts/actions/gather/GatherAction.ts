import Account from "@/account";
import LanguageManager from "@/configurations/language/LanguageManager";
import ScriptAction, {
  ScriptActionResults
} from "@/scripts/actions/ScriptAction";

export default class GatherAction extends ScriptAction {
  public _name: string = "GatherAction";
  public elements: number[];
  public jobId?: number;

  constructor(elements: number[], jobId?: number) {
    super();
    this.elements = elements;
    this.jobId = jobId;
  }

  public async process(account: Account): Promise<ScriptActionResults> {
    // In case there is no elements to gather in this map, just pass
    if (account.game.managers.gathers.canGather(...this.elements)) {
      if (!account.game.managers.gathers.gather(this.jobId, ...this.elements)) {
        account.scripts.stopScript(LanguageManager.trans("gatherError"));
        return ScriptAction.failedResult();
      }
      return ScriptAction.processingResult();
    }
    return ScriptAction.doneResult();
  }
}
