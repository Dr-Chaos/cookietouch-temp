import Account from "@/account";
import AccountConfiguration, {
  IAccountConfiguration
} from "@/configurations/accounts/AccountConfiguration";
import { Languages } from "@/configurations/language/Languages";
import Group from "@/groups/Group";
import LiteEvent, { ILiteEvent } from "@/utils/LiteEvent";
import firebase from "firebase/app";
import { List } from "linqts";
import CookieMain from "renderer/CookieMain";

export enum UpdatesChannel {
  LATEST = "latest",
  BETA = "beta",
  ALPHA = "alpha"
}

interface IGlobalConfigurationJSON {
  anticaptchaKey: string;
  pushBulletAccessToken: string;
  lang: Languages;
  accounts: IAccountConfiguration[];
  showDebugMessages: boolean;
  updatesChannel: UpdatesChannel;
  themeFile?: string;
}

export default class GlobalConfiguration {
  // TODO: Put this private and fix validate method on CharacterCreator
  public static _accounts: AccountConfiguration[] = [];
  public static anticaptchaKey: string = "";
  public static pushBulletAccessToken: string = "";
  public static lang: Languages = Languages.FRENCH;
  public static showDebugMessages = false;
  public static updatesChannel: UpdatesChannel = UpdatesChannel.LATEST;
  public static themeFile?: string;

  private static globalDoc: firebase.firestore.DocumentReference | undefined;
  private static authChangedUnsuscribe: firebase.Unsubscribe | undefined;
  private static stopDataSnapshot: (() => void) | undefined;

  public static get accountsList(): AccountConfiguration[] {
    let list = new List<AccountConfiguration>(this._accounts).ToArray();
    CookieMain.entities.ForEach(e => {
      if (e instanceof Account) {
        list = list.filter(elem => elem.username !== e.accountConfig.username);
      } else if (e instanceof Group) {
        list = list.filter(
          elem => elem.username !== e.chief.accountConfig.username
        );
        e.members.ForEach(member => {
          if (!member) {
            return;
          }
          list = list.filter(
            elem => elem.username !== member.accountConfig.username
          );
        });
      }
    });
    return list;
  }

  private static onUpdated = new LiteEvent<void>();

  public static get Updated(): ILiteEvent<void> {
    return this.onUpdated.expose();
  }

  public static addAccountAndSave(
    username: string,
    password: string,
    server: number,
    character: string
  ) {
    this._accounts.push(
      new AccountConfiguration(username, password, server, character)
    );
    this.save();
  }

  public static addAccountsAndSave(accounts: List<AccountConfiguration>) {
    accounts.ForEach(account => account && this._accounts.push(account));
    this.save();
  }

  public static removeAccount(accountConfig: AccountConfiguration) {
    this._accounts = this._accounts.filter(
      a => a.username !== accountConfig.username
    );
  }

  public static getAccount(username: string): AccountConfiguration | null {
    return this._accounts.find(a => a.username === username) || null;
  }

  public static async load() {
    this.authChangedUnsuscribe = firebase
      .auth()
      .onAuthStateChanged(async user => {
        if (!user) {
          return;
        }
        this.globalDoc = firebase
          .firestore()
          .doc(`/users/${user.uid}/config/global`);

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

  public static removeListeners = () => {
    if (GlobalConfiguration.authChangedUnsuscribe) {
      GlobalConfiguration.authChangedUnsuscribe();
    }
    if (GlobalConfiguration.stopDataSnapshot) {
      GlobalConfiguration.stopDataSnapshot();
    }
  };

  public static async save() {
    if (!this.globalDoc) {
      return;
    }
    const toSave: IGlobalConfigurationJSON = {
      accounts: this._accounts.map(o => o.toJSON()),
      anticaptchaKey: this.anticaptchaKey,
      lang: this.lang,
      pushBulletAccessToken: this.pushBulletAccessToken,
      showDebugMessages: this.showDebugMessages,
      themeFile: this.themeFile,
      updatesChannel: this.updatesChannel
    };

    await this.globalDoc.set(toSave);
  }

  private static updateFields(snapshot: firebase.firestore.DocumentSnapshot) {
    if (!snapshot.exists) {
      return;
    }
    const json = snapshot.data() as IGlobalConfigurationJSON;
    this._accounts = json.accounts.map(o => AccountConfiguration.fromJSON(o));
    this.anticaptchaKey = json.anticaptchaKey;
    this.pushBulletAccessToken = json.pushBulletAccessToken || "";
    this.lang = json.lang;
    this.showDebugMessages = json.showDebugMessages;
    this.themeFile = json.themeFile;
    this.updatesChannel = json.updatesChannel;
    this.onUpdated.trigger();
  }
}
