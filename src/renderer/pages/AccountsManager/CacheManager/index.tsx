import LanguageManager from "@/configurations/language/LanguageManager";
import { deleteFolderRecursive } from "@/utils/rmdir";
import { getCacheSize } from "@/utils/Sizes";
import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { remote } from "electron";
import { mkdirSync } from "fs";
import { join } from "path";
import * as React from "react";
import {
  cacheManagerStyles,
  ICacheManagerProps,
  ICacheManagerState
} from "renderer/pages/AccountsManager/CacheManager/types";

class CacheManager extends React.Component<
  ICacheManagerProps,
  ICacheManagerState
> {
  public readonly state: ICacheManagerState = {
    cacheSize: 0
  };

  public componentDidMount() {
    this.updateCacheSize();
  }

  public render() {
    const { classes } = this.props;
    const { cacheSize } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h6">
            {LanguageManager.trans("cacheSize")}
            {(cacheSize / 1024).toFixed(2)} kb &nbsp;
            <Button
              color="primary"
              variant="contained"
              disabled={cacheSize === 0}
              onClick={this.deleteCache}
            >
              {LanguageManager.trans("delete")}
            </Button>
          </Typography>
        </Paper>
      </div>
    );
  }

  private updateCacheSize = async () => {
    const cacheSize = await getCacheSize();
    this.setState({ cacheSize });
  };

  private deleteCache = (event: React.MouseEvent<HTMLElement>) => {
    const path = join(remote.app.getPath("userData"), "assets");
    deleteFolderRecursive(path);
    mkdirSync(path);
    this.updateCacheSize();
  };
}

export default withStyles(cacheManagerStyles)(CacheManager);
