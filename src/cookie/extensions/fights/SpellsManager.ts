import FightsPathfinder from "@/core/pathfinder/fights";
import MoveNode from "@/core/pathfinder/fights/MoveNode";
import MapPoint from "@/core/pathfinder/MapPoint";
import Account from "@account";
import FighterEntry from "@game/fight/fighters/FighterEntry";
import { SpellInabilityReasons } from "@game/fight/SpellInabilityReasons";
import DataManager from "@protocol/data";
import SpellLevels from "@protocol/data/classes/SpellLevels";
import Spells from "@protocol/data/classes/Spells";
import Dictionary from "@utils/Dictionary";
import {  SpellResistances } from "./configuration/enums/SpellResistances";
import { SpellTargets } from "./configuration/enums/SpellTargets";
import Spell from "./configuration/Spell";
import RangeNodeEntry from "./RangeNodeEntry";
import { SpellCastingResults } from "./SpellCastingResults";

export default class SpellsManager {
  private account: Account;
  private enemiesTouched: number;
  private spellIdToCast: number;
  private targetCellId: number;

  constructor(account: Account) {
    this.account = account;

    this.spellIdToCast = -1;
    this.targetCellId = -1;
  }

  public manageSpell(spell: Spell): Promise<SpellCastingResults> {
    return new Promise(async (resolve, reject) => {
      // Check if we have an AOE spell we need to cast
      if (this.spellIdToCast !== -1 && this.spellIdToCast === spell.spellId) {
        this.account.logger.logDebug("SpellsManager", `${spell.spellName} lancé en ${this.targetCellId} (${this.enemiesTouched} ennemies touchés)`);
        await this.account.game.fight.launchSpell(spell.spellId, this.targetCellId);

        this.spellIdToCast = -1;
        this.targetCellId = -1;
        this.enemiesTouched = 0;

        return resolve(SpellCastingResults.CASTED);
      }
      // Check for the distance
      if (!this.isDistanceGood(spell)) {
        return resolve(SpellCastingResults.NOT_CASTED);
      }
      // In case its a spell we need to cast at a specific hp percentage
      if (this.account.game.fight.playedFighter.lifePercent > spell.characterHp) {
        return resolve(SpellCastingResults.NOT_CASTED);
      }
      // Simple spell
      if (spell.target === SpellTargets.EMPTY_CELL) {
        return resolve(await this.castSpellOnEmptyCell(spell));
      }
      if (!spell.handToHand && !spell.aoe) {
        return resolve(await this.castSimpleSpell(spell));
      }
      // HandToHand spell and we're h2h with someone
      if (spell.handToHand && !spell.aoe && this.account.game.fight.isHandToHandWithAnEnemy()) {
        return resolve(await this.castSimpleSpell(spell));
      }
      // HandToHand spell and we're not h2h with someone
      if (spell.handToHand && !spell.aoe && !this.account.game.fight.isHandToHandWithAnEnemy()) {
        return resolve(await this.moveToCastSimpleSpell(spell, this.getNearestTarget(spell)));
      }
      // AOE spell (even hand to hand)
      if (spell.aoe) {
        return resolve(await this.castAoeSpell(spell));
      }
      return resolve(SpellCastingResults.NOT_CASTED);
    });
  }

  private castAoeSpell(spell: Spell): Promise<SpellCastingResults> {
    return new Promise(async (resolve, reject) => {
      if (spell.target === SpellTargets.ALLY || spell.target === SpellTargets.EMPTY_CELL) {
        return resolve(SpellCastingResults.NOT_CASTED);
      }
      if (this.account.game.fight.canLaunchSpell(spell.spellId) !== SpellInabilityReasons.NONE) {
        return resolve(SpellCastingResults.NOT_CASTED);
      }

      const spellEntry = this.account.game.character.getSpell(spell.spellId);
      const spellDataResp = await DataManager.get(Spells, spell.spellId);
      const spellData = spellDataResp[0].object;
      const spellLevelResp = await DataManager.get(SpellLevels, spellData.spellLevels[spellEntry.level - 1]);
      const spellLevel = spellLevelResp[0].object;

      // Get all the possible ranges
      const entries: RangeNodeEntry[] = [];
      // Include our current cell
      let entry = this.getRangeNodeEntry(this.account.game.fight.playedFighter.cellId, null, spell, spellLevel);
      if (entry.touchedEnemiesByCell.count() > 0) {
        entries.push(entry);
      }

      for (const kvp of FightsPathfinder.getReachableZone(this.account.game.fight,
        this.account.game.map.data, this.account.game.fight.playedFighter.cellId)) {
        if (!kvp.value.reachable) {
          continue;
        }
        if (kvp.value.ap > 0 || kvp.value.mp > 0) {
          continue;
        }
        entry = this.getRangeNodeEntry(kvp.key, kvp.value, spell, spellLevel);
        if (entry.touchedEnemiesByCell.count() > 0) {
          entries.push(entry);
        }
      }

      // Get a cell where we can hit the most
      // If we need to move, try to move with te lowest amount of mps (with the same number of touched enemies of course)
      let cellId = -1;
      let fromCellId = -1;
      let node: { key: number, value: MoveNode } = null;
      let touchedEnemies = 0;
      let usedMps = 99;

      for (const t of entries) {
        for (const kvp of t.touchedEnemiesByCell) {
          // Check hand to hand
          if (spell.handToHand && !this.account.game.fight.isHandToHandWithAnEnemy(t.fromCellId)) {
            continue;
          }
          // Check if we can cast the spell first
          if (this.account.game.fight.canLaunchSpellOnTarget(spell.spellId, t.fromCellId, kvp.key) !== SpellInabilityReasons.NONE) {
            continue;
          }

          // >= in case a cell uses less mp
          if (kvp.value < touchedEnemies) {
            continue;
          }
          if (kvp.value <= touchedEnemies && (kvp.value !== touchedEnemies || t.mpUsed > usedMps)) {
            continue;
          }
          touchedEnemies = kvp.value;
          cellId = kvp.key;
          fromCellId = t.fromCellId;
          usedMps = t.mpUsed;
          if (t.node !== null) {
            node = { key: fromCellId, value: t.node };
          }
        }
      }

      if (cellId === -1) {
        return resolve(SpellCastingResults.NOT_CASTED);
      }
      if (node === null) {
        this.account.logger.logDebug("SpellsManager", `${spell.spellName} lancé en ${cellId} pour toucher ${touchedEnemies} ennemis.`);
        await this.account.game.fight.launchSpell(spell.spellId, cellId);
        return resolve(SpellCastingResults.CASTED);
      } else {
        // We need to move
        this.account.logger.logDebug("SpellsManager", `Il faut bouger en ${fromCellId} pour lancé ${spell.spellName}`);
        // Set the spell to cast
        this.spellIdToCast = spell.spellId;
        this.targetCellId = cellId;
        this.enemiesTouched = touchedEnemies;

        await this.account.game.managers.movements.moveToCellInFight(node);
        return resolve(SpellCastingResults.MOVED);
      }
    });
  }

  private getRangeNodeEntry(fromCellId: number, node: MoveNode, spell: Spell, spellLevel: SpellLevels): RangeNodeEntry {
    // Calculate touched enemies for every cell in spell range
    const touchedEnemiesByCell = new Dictionary<number, number>();
    const range = this.account.game.fight.getSpellRange(fromCellId, spellLevel);

    for (const t of range) {
      const tec = this.getTouchedEnemiesCount(fromCellId, t, spell, spellLevel);
      if (tec > 0) {
        touchedEnemiesByCell.add(t, tec);
      }
    }
    return new RangeNodeEntry(fromCellId, touchedEnemiesByCell, node);
  }

  private getTouchedEnemiesCount(fromCellId: number, targetCellId: number, spell: Spell, spellLevel: SpellLevels): number {
    let n = 0;
    const zone = this.account.game.fight.getSpellZone(spell.spellId, fromCellId, targetCellId, spellLevel);
    if (zone === null) {
      return n;
    }
    for (const t of zone) {
      // Check SELF
      if (spell.carefulAoe && t.cellId === fromCellId) {
        return 0;
      }
      // Check ally
      if (spell.avoidAllies) {
        for (const ally of this.account.game.fight.allies) {
          if (ally.cellId === t.cellId) {
            return 0;
          }
        }
      }

      for (const enemy of this.account.game.fight.enemies) {
        if (enemy.cellId === t.cellId) {
          n++;
        }
      }
    }
    return n;
  }

  private castSimpleSpell(spell: Spell): Promise<SpellCastingResults> {
    return new Promise(async (resolve, reject) => {
      if (this.account.game.fight.canLaunchSpell(spell.spellId) !== SpellInabilityReasons.NONE) {
        return resolve(SpellCastingResults.NOT_CASTED);
      }

      const target = this.getNearestTarget(spell);
      if (target !== null) {
        const sir = this.account.game.fight.canLaunchSpellOnTarget(spell.spellId, this.account.game.fight.playedFighter.cellId, target.cellId);

        if (sir === SpellInabilityReasons.NONE) {
          this.account.logger.logDebug(
            "SpellsManager", `Sort ${spell.spellName} lancé sur ${(target as any).name} en ${target.cellId}`); // TODO: fix name
          await this.account.game.fight.launchSpell(spell.spellId, target.cellId);
          return resolve(SpellCastingResults.CASTED);
        }

        if (sir === SpellInabilityReasons.NOT_IN_RANGE) {
          return resolve(await this.moveToCastSimpleSpell(spell, target));
        }
      } else if (spell.target === SpellTargets.EMPTY_CELL) {
        // A spell on empty cell is special case
        return resolve(await this.castSpellOnEmptyCell(spell));
      }
      return resolve(SpellCastingResults.NOT_CASTED);
    });
  }

  private moveToCastSimpleSpell(spell: Spell, target: FighterEntry): Promise<SpellCastingResults> {
    return new Promise(async (resolve, reject) => {
      // We'll move to cast the spell (if we can) with the lowest number of MP possible
      let node: { key: number, value: MoveNode } = null;
      let pmUsed = 99;

      for (const kvp of FightsPathfinder.getReachableZone(this.account.game.fight, this.account.game.map.data,
           this.account.game.fight.playedFighter.cellId)) {
        if (!kvp.value.reachable) {
          continue;
        }

        // Only choose the safe paths
        if (kvp.value.path.ap > 0 || kvp.value.path.mp > 0) {
          continue;
        }

        if (spell.handToHand && MapPoint.fromCellId(kvp.key).distanceToCell(MapPoint.fromCellId(kvp.key))) {
          continue;
        }

        if (this.account.game.fight.canLaunchSpellOnTarget(spell.spellId, kvp.key, target.cellId) !== SpellInabilityReasons.NONE) {
          continue;
        }

        if (kvp.value.path.reachable.length <= pmUsed) {
          node = kvp;
          pmUsed = kvp.value.path.reachable.length;
        }
      }

      if (node !== null) {
        this.account.logger.logDebug("SpellsManager", `On se déplace en cellule ${node.key} pour lancé le sort ${spell.spellName}.`);
        await this.account.game.managers.movements.moveToCellInFight(node);
        return resolve(SpellCastingResults.MOVED);
      }
      return resolve(SpellCastingResults.NOT_CASTED);
    });
  }

  private castSpellOnEmptyCell(spell: Spell): Promise<SpellCastingResults> {
    return new Promise(async (resolve, reject) => {
      if (this.account.game.fight.canLaunchSpell(spell.spellId) !== SpellInabilityReasons.NONE) {
        return resolve(SpellCastingResults.NOT_CASTED);
      }
      // In case we need to cast the spell on an empty case next to the character but all of them are taken
      if (spell.target === SpellTargets.EMPTY_CELL && this.account.game.fight.getHandToHandEnemies().length === 4) {
        return resolve(SpellCastingResults.NOT_CASTED);
      }

      const spellEntry = this.account.game.character.getSpell(spell.spellId);
      const spellDataResp = await DataManager.get(Spells, spell.spellId);
      const spellData = spellDataResp[0].object;
      const spellLevelResp = await DataManager.get(SpellLevels, spellData.spellLevels[spellEntry.level - 1]);
      const spellLevel = spellLevelResp[0].object;

      const range = this.account.game.fight.getSpellRange(this.account.game.fight.playedFighter.cellId, spellLevel);
      for (const t of range) {
        if (this.account.game.fight.canLaunchSpellOnTarget(spell.spellId, this.account.game.fight.playedFighter.cellId, t)
          === SpellInabilityReasons.NONE) {
          if (spell.handToHand && MapPoint.fromCellId(t).distanceToCell(MapPoint.fromCellId(this.account.game.fight.playedFighter.cellId)) !== 1) {
            continue;
          }
          this.account.logger.logDebug("SpellsManager", `Sort ${spell.spellName} lancé en cellule ${t}`);
          await this.account.game.fight.launchSpell(spell.spellId, t);
          return resolve(SpellCastingResults.CASTED);
        }
      }
      return resolve(await this.moveToCastSpellOnEmptyCell(spell, spellLevel));
    });
  }

  private moveToCastSpellOnEmptyCell(spell: Spell, spellLevel: SpellLevels): Promise<SpellCastingResults> {
    return new Promise(async (resolve, reject) => {
      // We'll move to cast the spell (if we can) with the lowest number of MP possible
      let node: { key: number, value: MoveNode } = null;
      let pmUsed = 99;
      for (const kvp of FightsPathfinder.getReachableZone(this.account.game.fight, this.account.game.map.data,
        this.account.game.fight.playedFighter.cellId)) {
        if (!kvp.value.reachable) {
          continue;
        }
        // Only choose the safe paths
        if (kvp.value.path.ap > 0 || kvp.value.path.mp > 0) {
          continue;
        }
        // if (spell.handToHand && MapPoint.fromCellId(kvp.key).distanceToCell(MapPoint.fromCellId())) {
        //   continue;
        // }
        const range = this.account.game.fight.getSpellRange(kvp.key, spellLevel);
        for (const t of range) {
          if (this.account.game.fight.canLaunchSpellOnTarget(spell.spellId, kvp.key, t) !== SpellInabilityReasons.NONE) {
            continue;
          }
          if (kvp.value.path.reachable.length >= pmUsed) {
            continue;
          }
          node = kvp;
          pmUsed = kvp.value.path.reachable.length;
        }
      }
      if (node !== null) {
        await this.account.game.managers.movements.moveToCellInFight(node);
        return resolve(SpellCastingResults.MOVED);
      }
      return resolve(SpellCastingResults.NOT_CASTED);
    });
  }

  private getNearestTarget(spell: Spell): FighterEntry {
    if (spell.target === SpellTargets.SELF) {
      return this.account.game.fight.playedFighter;
    }

    if (spell.target === SpellTargets.EMPTY_CELL) {
      return null; // Assuming that the others never return null
    }

    const filter = (fighter: FighterEntry) => {
      // In case the user wants to ignore invocations
      if (this.account.extensions.fights.config.ignoreSummonedEnemies && fighter.stats.summoned) {
        return false;
      }

      return fighter.lifePercent <= spell.targetHp && this.isResistanceGood(spell, fighter);
    };

    return spell.target === SpellTargets.ENEMY
      ? this.account.game.fight.getNearestEnemy(-1, filter)
      : this.account.game.fight.getNearestAlly(filter);
  }

  private isDistanceGood(spell: Spell): boolean {
    // This option is ignored when the value is 0
    if (spell.distanceToClosestMonster === 0) {
      return true;
    }

    const nearestEnemy = this.account.game.fight.getNearestEnemy();
    if (nearestEnemy === null) {
      return false;
    }

    const mp = MapPoint.fromCellId(nearestEnemy.cellId);
    return MapPoint.fromCellId(this.account.game.fight.playedFighter.cellId).distanceToCell(mp) < spell.distanceToClosestMonster;
  }

  private isResistanceGood(spell: Spell, fighter: FighterEntry): boolean {
    switch (spell.resistance) {
      case SpellResistances.NEUTRAL:
        return fighter.stats.neutralElementResistPercent <= spell.resistanceValue;
      case SpellResistances.EARTH:
        return fighter.stats.earthElementResistPercent <= spell.resistanceValue;
      case SpellResistances.FIRE:
        return fighter.stats.fireElementResistPercent <= spell.resistanceValue;
      case SpellResistances.WIND:
        return fighter.stats.waterElementResistPercent <= spell.resistanceValue;
      default: // Water
        return fighter.stats.waterElementResistPercent <= spell.resistanceValue;
    }
  }
}
