import Message from "@/protocol/network/messages/Message";
import QuestActiveInformations from "@/protocol/network/types/QuestActiveInformations";
import QuestActiveDetailedInformations from "../types/QuestActiveDetailedInformations";

export default class QuestStepInfoMessage extends Message {
  public infos: QuestActiveInformations | QuestActiveDetailedInformations;

  constructor(
    infos: QuestActiveInformations | QuestActiveDetailedInformations
  ) {
    super();
    this.infos = infos;
  }
}
