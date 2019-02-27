import LanguageManager from "@/configurations/language/LanguageManager";
import { amber, blueGrey } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import {
  createMuiTheme,
  MuiThemeProvider,
  Theme
} from "@material-ui/core/styles";
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "firebase/app";
import * as React from "react";
import { signout } from "renderer/FirebaseHelpers";
import BottomAppBar from "renderer/pages/BottomAppBar";
import { IMainProps, IMainState, mainStyles } from "renderer/pages/Main/types";
import MainContent from "renderer/pages/MainContent";
import TopAppBar from "renderer/pages/TopAppBar";

export const defaultTheme: ThemeOptions = {
  palette: {
    primary: blueGrey,
    secondary: amber,
    type: "dark"
  },
  spacing: {
    unit: 3
  },
  typography: {
    fontSize: 12,
    useNextVariants: true
  }
};

class Main extends React.Component<IMainProps, IMainState> {
  public state: IMainState = {
    currentTheme: createMuiTheme(defaultTheme),
    sidenavStatus: 0,
    user: null
  };

  public componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (user.emailVerified) {
          this.setState({ user });
        } else {
          signout();
        }
      } else {
        this.setState({ user: null });
      }
    });
  }

  public render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={this.state.currentTheme}>
        <CssBaseline />
        <div className={classes.root}>
          <TopAppBar
            user={this.state.user}
            clickMenu={this.toggleDrawer}
            setTheme={this.setTheme}
          />
          {this.state.user ? (
            <MainContent sidenavStatus={this.state.sidenavStatus} />
          ) : (
            <Paper className={classes.paper}>
              {LanguageManager.trans("mustLogin")}
            </Paper>
          )}
          <BottomAppBar />
        </div>
      </MuiThemeProvider>
    );
  }

  private toggleDrawer = () => {
    this.setState(prev => ({
      sidenavStatus: prev.sidenavStatus === 0 ? 250 : 0
    }));
  };

  private setTheme = (theme: Theme) => {
    this.setState({
      currentTheme: theme
    });
  };
}

export default withStyles(mainStyles)(Main);
