import GlobalConfiguration from "@/configurations/GlobalConfiguration";
import Data from "@/protocol/data/Data";
import { DataTypes } from "@/protocol/data/DataTypes";
import DTConstants from "@/protocol/DTConstants";
import {
  existsAsync,
  mkdirRecursive,
  readFileAsync,
  writeFileAsync
} from "@/utils/fsAsync";
import axios from "axios";
import { remote } from "electron";
import { join } from "path";

export default class DataManager {
  public static async get<T extends Data>(
    type: DataTypes,
    ...ids: number[]
  ): Promise<T[]> {
    const myArray: T[] = [];
    const newIds = [];
    for (const id of ids) {
      const filePath = await DataManager.getFilePath(DataTypes[type], id);
      if (await existsAsync(filePath)) {
        const file = await readFileAsync(filePath, "utf8");
        myArray.push(JSON.parse(file));
      } else {
        newIds.push(id);
      }
    }
    if (newIds.length === 0 && ids.length > 0) {
      return myArray;
    }
    const params = {
      lang: GlobalConfiguration.lang,
      v: DTConstants.assetsVersion
    };
    const response = await axios.post(
      `${DTConstants.config.dataUrl}/data/map?lang=${params.lang}&v=${
        params.v
      }`,
      {
        class: DataTypes[type],
        ids: newIds
      }
    );

    for (const item of Object.values<T>(response.data)) {
      myArray.push(item);
      const filePath = await DataManager.getFilePath(DataTypes[type], item.id);
      await writeFileAsync(filePath, JSON.stringify(item));
    }

    return myArray;
  }

  private static async getFilePath(type: string, id: number): Promise<string> {
    const folderPath = join(
      remote.app.getPath("userData"),
      "assets",
      DTConstants.assetsVersion,
      "data",
      GlobalConfiguration.lang,
      type
    );

    if (!(await existsAsync(folderPath))) {
      mkdirRecursive(folderPath);
    }

    return join(folderPath, `${id}.json`);
  }
}
