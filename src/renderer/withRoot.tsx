/*
@last-edit: 6:32pm 22 Feb 2019
@last-author: Mederic Burlet
@last-desc: Implement the base of the themeing engine
*/
import LanguageManager from "@/configurations/language/LanguageManager";
import amber from "@material-ui/core/colors/amber";
import blueGrey from "@material-ui/core/colors/blueGrey";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { remote } from "electron";
import fs from "fs";
import * as React from "react";
// Define the default theme
let defaultTheme: ThemeOptions = {
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
// Try to read the file theme.json
let fileContents;
try {
  fileContents = fs.readFileSync('./resources/themes/theme.json', 'utf8');
} catch (err) {
  // Here you get the error when the file was not found,
  // Don't need to do anything since defaultTheme is already loaded
}
// Check if we have laoded the content of theme file
if (fileContents && fileContents !== undefined) {
    // Handle exceptions of JSON formating
    const jsonStr = fileContents.replace(/(\w+:)|(\w+ :)/g, (s) => {
        return '"' + s.substring(0, s.length-1) + '":';
    });
    // Try to parse the json
    try {
      // Set parsed JSON as the defaultTheme
       defaultTheme = JSON.parse(jsonStr);
    } catch(e) {
        // Show error on unsuccessful parsing
        remote.dialog.showErrorBox(
          LanguageManager.trans("error"),
          LanguageManager.trans("themeError")
        );
       // alert(`${LanguageManager.trans("themeError")}\n${e}`);
    }
}
// Create the MuiTheme from params
const theme = createMuiTheme(defaultTheme);
// tslint:disable-next-line:variable-name
function withRoot(Component: React.ComponentType) {
  function WithRoot(props: object) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }
  return WithRoot;
}

export default withRoot;
