import Account from "@/account";
import Bid from "@/game/bid";
import Character from "@/game/character";
import Chat from "@/game/chat";
import Craft from "@/game/craft";
import Exchange from "@/game/exchange";
import Fight from "@/game/fight";
import Managers from "@/game/managers";
import Map from "@/game/map";
import Npcs from "@/game/npcs";
import Server from "@/game/server";
import Storage from "@/game/storage";
import IClearable from "@/utils/IClearable";
import Breeding from "./breeding";
import Quests from "./quests";

export default class Game implements IClearable {
  public managers: Managers;
  public character: Character;
  public map: Map;
  public chat: Chat;
  public server: Server;
  public bid: Bid;
  public exchange: Exchange;
  public npcs: Npcs;
  public storage: Storage;
  public fight: Fight;
  public craft: Craft;
  public breeding: Breeding;
  public quests: Quests;

  constructor(account: Account) {
    this.server = new Server(account);
    this.character = new Character(account);
    this.map = new Map(account);
    this.fight = new Fight(account);
    this.managers = new Managers(account, this.map);
    this.chat = new Chat(account);
    this.npcs = new Npcs(account);
    this.storage = new Storage(account);
    this.exchange = new Exchange(account);
    this.bid = new Bid(account);
    this.craft = new Craft(account);
    this.breeding = new Breeding(account);
    this.quests = new Quests(account);
  }

  public clear() {
    this.character.clear();
    this.map.clear();
    this.fight.clear();
    this.managers.clear();
    this.bid.clear();
    this.breeding.clear();
  }
}
