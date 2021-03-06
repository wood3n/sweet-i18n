import path from "path";
import fs from "fs";
import glob from "glob";
import { Command } from "commander";
import Transformer from "./transform";
import { logInfo, logError, logNote, logWarn, mkdirSync } from "./utils";
import { ConfigOptions } from "./typings";
import packageJson from "../package.json";

(function () {
  // node version must >= 16.13
  require("please-upgrade-node")(packageJson);

  // 读取位于package.json里的配置项
  let options: ConfigOptions = {
    pattern: "**/*.{vue,js}",
    ignore: ["node_modules/**"],
    output: "i18n/zh-CN.json",
    useUniqKey: false,
    importPath: "",
  };
  try {
    const localPackageJson = fs.readFileSync(
      path.resolve(process.cwd(), "package.json"),
      "utf8"
    );
    const config: { sugar18: ConfigOptions } = JSON.parse(localPackageJson);
    if (config.sugar18) {
      options = {
        ...options,
        ...config.sugar18,
      };
    }
  } catch (err) {
    logError(err as string);
    process.exit(1);
  }

  const program = new Command();
  program
    .name("sugar18")
    .version(packageJson.version)
    .command("trust")
    .option("-i --import", "importExpression's filepath")
    .option("-p --output", "json output filepath")
    .action((_, options) => {
      if (options.output) {
        options.output = options.output;
      }

      if (options.import) {
        options.importPath = options.import;
      }
    })
    .parse(process.argv);

  // 必须指定引入的从vue-i18n导出对象的路径，方便在script内部自动生成import语句
  if (!options.importPath) {
    logError("Please set import expression's filepath.");
    process.exit(1);
  }

  let locales = {};
  const outputJSONPath = path.resolve(process.cwd(), options.output!);
  if (fs.existsSync(outputJSONPath)) {
    const content = fs.readFileSync(outputJSONPath, "utf8");
    if (content) {
      locales = JSON.parse(content);
    }
  }

  glob
    .sync(options.pattern!, { ignore: options.ignore })
    .forEach((filename) => {
      const filePath = path.resolve(process.cwd(), filename);
      logInfo(`🚀 detecting file: ${filePath}`);
      const sourceCode = fs.readFileSync(filePath, "utf8");
      try {
        const { result } = new Transformer({
          code: sourceCode,
          locales,
          useUniqKey: options.useUniqKey,
          importPath: options.importPath,
          filename,
        });
        fs.writeFileSync(filePath, result, "utf8");
      } catch (err) {
        console.log(err);
      }
    });

  if (Object.keys(locales).length) {
    mkdirSync(path.dirname(outputJSONPath));

    fs.writeFileSync(
      outputJSONPath,
      JSON.stringify(locales, null, "\t"),
      "utf8"
    );
    logNote("🎉🎉🎉 Extract successfully!");
  } else {
    logWarn(
      "There is no chinese characters can be found in specified directory."
    );
  }
})();
