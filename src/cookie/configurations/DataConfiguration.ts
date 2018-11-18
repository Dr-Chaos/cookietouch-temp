import LiteEvent, { ILiteEvent } from "@/utils/LiteEvent";
import firebase from "firebase/app";

interface IDataConfigurationJSON {
  aggressiveMonsters: number[];
}

export default class DataConfiguration {
  public static aggressiveMonsters: number[] = [];

  private static globalDoc: firebase.firestore.DocumentReference | undefined;
  private static authChangedUnsuscribe: firebase.Unsubscribe | undefined;
  private static stopDataSnapshot: (() => void) | undefined;

  private static onUpdated = new LiteEvent<void>();

  public static get Updated(): ILiteEvent<void> {
    return this.onUpdated.expose();
  }

  public static async load() {
    this.globalDoc = firebase.firestore().doc(`/config/data`);

    this.stopDataSnapshot = this.globalDoc.onSnapshot(snapshot => {
      this.updateFields(snapshot);
    });

    if (!this.globalDoc) {
      return;
    }
    const data = await this.globalDoc.get();
    this.updateFields(data);
  }

  public static removeListeners = () => {
    if (DataConfiguration.authChangedUnsuscribe) {
      DataConfiguration.authChangedUnsuscribe();
    }
    if (DataConfiguration.stopDataSnapshot) {
      DataConfiguration.stopDataSnapshot();
    }
  };

  public static async save() {
    if (!this.globalDoc) {
      return;
    }
    const toSave: IDataConfigurationJSON = {
      aggressiveMonsters: this.aggressiveMonsters
    };

    await this.globalDoc.set(toSave);
  }

  private static updateFields(snapshot: firebase.firestore.DocumentSnapshot) {
    if (!snapshot.exists) {
      return;
    }
    const json = snapshot.data() as IDataConfigurationJSON;
    this.aggressiveMonsters = json.aggressiveMonsters;
    this.onUpdated.trigger();
  }
}
