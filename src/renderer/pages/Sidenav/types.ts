import { createStyles, Theme, WithStyles } from "@material-ui/core";

export const sidenavStyles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    }
  });

export interface ISidenavProps extends WithStyles<typeof sidenavStyles> {
  //
}
