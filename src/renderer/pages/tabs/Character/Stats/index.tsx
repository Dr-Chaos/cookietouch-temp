import LanguageManager from "@/configurations/language/LanguageManager";
import { BoostableStats } from "@/game/character/BoostableStats";
import CharacterBaseCharacteristic from "@/protocol/network/types/CharacterBaseCharacteristic";
import Card from "@material-ui/core/Card";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import {
  characterStatsTabStyles,
  ICharacterStatsTabProps,
  ICharacterStatsTabState
} from "renderer/pages/tabs/Character/Stats/types";

class Stats extends React.Component<
  ICharacterStatsTabProps,
  ICharacterStatsTabState
> {
  public state: ICharacterStatsTabState = {
    actionPoints: -1,
    agility: -1,
    chance: -1,
    initiative: -1,
    intelligence: -1,
    level: -1,
    lifePoints: -1,
    maxLifePoints: -1,
    movementPoints: -1,
    prospecting: -1,
    range: -1,
    skinUrl: "",
    statsPoints: -1,
    strength: -1,
    summonableCreaturesBoost: -1,
    vitality: -1,
    wisdom: -1
  };

  public componentDidMount() {
    this.props.account.game.character.CharacterSelected.on(
      this.characterSelected
    );
    this.props.account.game.character.StatsUpdated.on(this.statsUpdated);
  }

  public componentWillUnmount() {
    this.props.account.game.character.CharacterSelected.off(
      this.characterSelected
    );
    this.props.account.game.character.StatsUpdated.off(this.statsUpdated);
  }

  public render() {
    const { account, classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container={true} spacing={16}>
          <Grid item={true} xs={4}>
            <Typography variant="h6">
              {account.game.character.name} ({account.game.character.id})
            </Typography>
            <Typography variant="subtitle1">
              {LanguageManager.trans("level")} {this.state.level}
            </Typography>
            <img src={this.state.skinUrl} alt="character" />
          </Grid>
          <Grid item={true} xs={4}>
            <Card className={classes.card}>
              <Typography variant="h5">
                {LanguageManager.trans("summary")}
              </Typography>
              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  style={{ marginTop: -4 }}
                  src={require("renderer/img/starYellow.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>
                    {LanguageManager.trans("actionPoints")}
                  </Typography>
                </div>
                <span className={classes.statsLabelSpan}>
                  <Typography>{this.state.actionPoints}</Typography>
                </span>
              </div>
              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/movement.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>
                    {LanguageManager.trans("movementPoints")}
                  </Typography>
                </div>
                <span className={classes.statsLabelSpan}>
                  <Typography>{this.state.movementPoints}</Typography>
                </span>
              </div>
              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/initiative.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>Initiative</Typography>
                </div>
                <span className={classes.statsLabelSpan}>
                  <Typography>{this.state.initiative}</Typography>
                </span>
              </div>

              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/prospecting.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>
                    {LanguageManager.trans("prospecting")}
                  </Typography>
                </div>
                <span className={classes.statsLabelSpan}>
                  <Typography>{this.state.prospecting}</Typography>
                </span>
              </div>

              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/range.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>{LanguageManager.trans("range")}</Typography>
                </div>
                <span className={classes.statsLabelSpan}>
                  <Typography>{this.state.range}</Typography>
                </span>
              </div>

              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/summon.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>{LanguageManager.trans("summons")}</Typography>
                </div>
                <span className={classes.statsLabelSpan}>
                  <Typography>{this.state.summonableCreaturesBoost}</Typography>
                </span>
              </div>
            </Card>
          </Grid>
          <Grid item={true} xs={4}>
            <Card className={classes.card}>
              <Typography variant="h5">
                {LanguageManager.trans("stats")}
              </Typography>
              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/vitality.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>{LanguageManager.trans("vitality")}</Typography>
                </div>
                <Typography>{this.state.vitality}</Typography>
                <span className={classes.statsLabelSpanAdd}>
                  <Fab
                    size="small"
                    color="primary"
                    disabled={this.state.statsPoints <= 0}
                    onClick={this.boostStat(BoostableStats.VITALITY)}
                  >
                    +
                  </Fab>
                </span>
              </div>

              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/wisdom.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>{LanguageManager.trans("wisdom")}</Typography>
                </div>

                <Typography>{this.state.wisdom}</Typography>
                <span className={classes.statsLabelSpanAdd}>
                  <Fab
                    size="small"
                    color="primary"
                    disabled={this.state.statsPoints <= 0}
                    onClick={this.boostStat(BoostableStats.WISDOM)}
                  >
                    +
                  </Fab>
                </span>
              </div>

              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/strength.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>{LanguageManager.trans("strength")}</Typography>
                </div>

                <Typography>{this.state.strength}</Typography>
                <span className={classes.statsLabelSpanAdd}>
                  <Fab
                    size="small"
                    color="primary"
                    disabled={this.state.statsPoints <= 0}
                    onClick={this.boostStat(BoostableStats.STRENGTH)}
                  >
                    +
                  </Fab>
                </span>
              </div>

              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/intelligence.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>
                    {LanguageManager.trans("intelligence")}
                  </Typography>
                </div>
                <Typography>{this.state.intelligence}</Typography>
                <span className={classes.statsLabelSpanAdd}>
                  <Fab
                    size="small"
                    color="primary"
                    disabled={this.state.statsPoints <= 0}
                    onClick={this.boostStat(BoostableStats.INTELLIGENCE)}
                  >
                    +
                  </Fab>
                </span>
              </div>

              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/chance.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>{LanguageManager.trans("chance")}</Typography>
                </div>

                <Typography>{this.state.chance}</Typography>
                <span className={classes.statsLabelSpanAdd}>
                  <Fab
                    size="small"
                    color="primary"
                    disabled={this.state.statsPoints <= 0}
                    onClick={this.boostStat(BoostableStats.CHANCE)}
                  >
                    +
                  </Fab>
                </span>
              </div>

              <div className={classes.lineStats}>
                <img
                  className={classes.iconStats}
                  src={require("renderer/img/agility.png")}
                  alt=""
                />
                <div className={classes.labelStats}>
                  <Typography>{LanguageManager.trans("agility")}</Typography>
                </div>

                <Typography>{this.state.agility}</Typography>
                <span className={classes.statsLabelSpanAdd}>
                  <Fab
                    size="small"
                    color="primary"
                    disabled={this.state.statsPoints <= 0}
                    onClick={this.boostStat(BoostableStats.AGILITY)}
                  >
                    +
                  </Fab>
                </span>
              </div>
            </Card>
            <div className={classes.labelPointsStats}>
              <Typography>{LanguageManager.trans("points")}</Typography>
              <span
                style={{ marginRight: 56 }}
                className={classes.statsLabelSpanAdd}
              >
                <Typography>{this.state.statsPoints}</Typography>
              </span>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  private characterSelected = () => {
    this.setState({
      level: this.props.account.game.character.level,
      skinUrl: this.props.account.game.character.skinUrl
    });
  };

  private boostStat = (stat: BoostableStats) => () => {
    this.props.account.game.character.boostStat(stat);
  };

  private statsUpdated = () => {
    this.setState({
      actionPoints: this.totalStat(
        this.props.account.game.character.stats.actionPoints
      ),
      agility: this.totalStat(this.props.account.game.character.stats.agility),
      chance: this.totalStat(this.props.account.game.character.stats.chance),
      initiative: this.totalStat(
        this.props.account.game.character.stats.initiative
      ),
      intelligence: this.totalStat(
        this.props.account.game.character.stats.intelligence
      ),
      level: this.props.account.game.character.level,
      lifePoints: this.props.account.game.character.stats.lifePoints,
      maxLifePoints: this.props.account.game.character.stats.maxLifePoints,
      movementPoints: this.totalStat(
        this.props.account.game.character.stats.movementPoints
      ),
      prospecting: this.totalStat(
        this.props.account.game.character.stats.prospecting
      ),
      range: this.totalStat(this.props.account.game.character.stats.range),
      statsPoints: this.props.account.game.character.stats.statsPoints,
      strength: this.totalStat(
        this.props.account.game.character.stats.strength
      ),
      summonableCreaturesBoost: this.totalStat(
        this.props.account.game.character.stats.summonableCreaturesBoost
      ),
      vitality: this.totalStat(
        this.props.account.game.character.stats.vitality
      ),
      wisdom: this.totalStat(this.props.account.game.character.stats.wisdom)
    });
  };

  private totalStat(stat: CharacterBaseCharacteristic): number {
    return (
      stat.base +
      stat.objectsAndMountBonus +
      stat.alignGiftBonus +
      stat.contextModif
    );
  }
}

export default withStyles(characterStatsTabStyles)(Stats);
