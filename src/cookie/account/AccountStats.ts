import Account from "@/account";
import LiteEvent, { ILiteEvent } from "@/utils/LiteEvent";
import firebase from "firebase/app";

interface IAccountStatsJSON {
  connected: boolean;
}

export default class AccountStats implements IAccountStatsJSON {
  public connected: boolean;

  private authChangedUnsuscribe: firebase.Unsubscribe | undefined;
  private stopDataSnapshot: (() => void) | undefined;

  private globalDoc: firebase.firestore.DocumentReference | undefined;

  private readonly onUpdated = new LiteEvent<void>();

  public get Updated(): ILiteEvent<void> {
    return this.onUpdated.expose();
  }

  private account: Account;

  constructor(account: Account) {
    this.account = account;

    this.connected = false;
  }

  public removeListeners = () => {
    if (this.authChangedUnsuscribe) {
      this.authChangedUnsuscribe();
    }
    if (this.stopDataSnapshot) {
      this.stopDataSnapshot();
    }
  };

  public async load() {
    this.authChangedUnsuscribe = firebase
      .auth()
      .onAuthStateChanged(async user => {
        console.log("mdr ce que je veux il a dit le mosneiru");
        if (!user) {
          return;
        }
        this.globalDoc = firebase
          .firestore()
          .doc(
            `users/${user.uid}/config/accounts/${
              this.account.accountConfig.username
            }/characters/${this.account.game.character.name}/data`
          );

        this.stopDataSnapshot = this.globalDoc.onSnapshot(snapshot => {
          this.updateFields(snapshot);
        });
      });

    if (!this.globalDoc) {
      return;
    }
    const data = await this.globalDoc.get();
    this.updateFields(data);
  }

  public async save() {
    if (!this.globalDoc) {
      return;
    }
    const toSave: IAccountStatsJSON = {
      connected: this.connected
    };
    this.updateBotsConnected(this.connected);
    await this.globalDoc.set(toSave);
  }

  private updateFields(snapshot: firebase.firestore.DocumentSnapshot) {
    if (!snapshot.exists) {
      return;
    }
    const json = snapshot.data() as IAccountStatsJSON;
    this.connected = json.connected;

    this.onUpdated.trigger();
  }

  private async updateBotsConnected(connected: boolean) {
    const ref = firebase
      .firestore()
      .collection("stats")
      .doc("users");

    await firebase.firestore().runTransaction(async transaction => {
      const doc = await transaction.get(ref);
      if (!doc.exists) {
        transaction.set(ref, { connected: 0 });
        return 0;
      }
      const newConnected = Number(doc.data()!.connected) + (connected ? 1 : -1);
      transaction.update(ref, {
        connected: newConnected
      });
      return newConnected;
    });
  }
}
