import Account from "@/account";
import ListRender from "@material-ui/core/List";
import withStyles from "@material-ui/core/styles/withStyles";
import { List } from "linqts";
import React, { FunctionComponent, useEffect, useState } from "react";
import CookieMain from "renderer/CookieMain";
import AccountItem from "renderer/pages/Sidenav/AccountItem";
import GroupItem from "renderer/pages/Sidenav/GroupItem";
import { ISidenavProps, sidenavStyles } from "renderer/pages/Sidenav/types";

const Sidenav: FunctionComponent<ISidenavProps> = props => {
  const [connectedAccounts, setConnectedAccounts] = useState<List<Account>>(
    CookieMain.connectedAccounts
  );

  useEffect(() => {
    const entitiesUpdated = () => {
      setConnectedAccounts(CookieMain.connectedAccounts);
    };
    CookieMain.EntitiesUpdated.on(entitiesUpdated);
    return () => {
      CookieMain.EntitiesUpdated.off(entitiesUpdated);
    };
  }, []);

  const { classes } = props;

  return (
    <div className={classes.root}>
      <ListRender component="nav">
        {connectedAccounts.ToArray().map((a, idx) => {
          if (a.hasGroup) {
            return <GroupItem key={idx} group={a.group!} />;
          } else {
            return <AccountItem key={idx} account={a} />;
          }
        })}
      </ListRender>
    </div>
  );
};

export default withStyles(sidenavStyles)(Sidenav);
