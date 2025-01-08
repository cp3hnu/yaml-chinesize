import { parseDocument } from 'yaml';
import { errorLog } from "./utils.js";
import fs from 'node:fs';
import path from "node:path";

/**
 * Extract English texts of YAML files
 * @param {string} dir The directory of YAML files
 * @param {string[]} fields The extracted fields
 * @param {string} output The path of the file where the extracted English texts will be written
 */
export function extract(dir, fields, output) {
  if (!fs.existsSync(dir)) {
    console.log(errorLog(`Error: "${dir}" is not exists`));
    return;
  }

  const dirStat = fs.statSync(dir);
  if (!dirStat.isDirectory()) {
    console.log(errorLog(`Error: "${dir}" is not a directory`));
    return;
  }

  const defaultFileName = "texts-to-translate.json"
  const outputFilePath = output || path.join(dir, "chinesize", defaultFileName);
  const outputDir = path.dirname(outputFilePath);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
 
  const texts = [];
  extractDir(dir, fields, outputFilePath, texts);
}

/**
 * Scan directory recursively then extract English texts from html and ts files
 * @param {string} dir The directory of YAML files
 * @param {string[]} fields The extracted fields
 * @param {string} outputFilePath The path of the file where the extracted English texts will be written.
 * @param {string[]} texts The extracted English texts
 */
function extractDir(dir, fields, outputFilePath, texts) {
  fs.readdir(dir, (dirErr, files) => {
    if (dirErr) {
      console.log(errorLog(`Error: Unable to scan ${dir} directory.`));
      console.log(errorLog(dirErr));
      return;
    }
    files.forEach(file => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.log(
            errorLog(`Error: Unable to retrieve ${filePath} file stats.`)
          );
          console.log(errorLog(err));
          return;
        }

        if (stat.isDirectory()) {
          // Read subdirectories recursively
          extractDir(filePath, fields, outputFilePath, texts);
        } else {
          const extname = path.extname(filePath);
          if (extname === ".yaml" || extname === ".yml") {
            extractYaml(filePath, fields, addTextsAndWrite(texts, outputFilePath));
          }
        }
      });
    });
  });
}

/**
 * 读取 YAML 文件，并将其解析为 AST
 * @param {string} filePath 文件路径
 * @param {string[]} fields The extracted fields
 * @param {(err: Error, texts: string[]) => void} callback  回调函数
 */
function extractYaml(filePath, fields, callback) {
  // 读取 YAML 文件
  const file = fs.readFileSync(filePath, 'utf8');

  // 解析为 AST
  const doc = parseDocument(file);

  // 操作 AST
  const texts = [];
  fields.forEach(field => {
    const value = doc.get(field).trim();
    if (value) {
      texts.push(value);
    }
  });

  callback(undefined, texts);
}

/**
 * Appends the given file texts to the provided texts array and writes the combined texts to a file.
 *
 * @param {array} texts - The array of texts to be written to the file.
 * @param {string} outputFilePath - The path of the file where the extracted English texts will be written.
 * @return {(error: any | undefined, fileTexts: string[] | undefined) => void} A callback function that takes error and file texts as parameters.
 */
function addTextsAndWrite(texts, outputFilePath) {
  return (err, fileTexts) => {
    if (!err && fileTexts && fileTexts.length > 0) {
      texts.push(...fileTexts);
      // FIXME: write texts to file only once
      const jsonObj = texts.reduce((obj, text) => {
        obj[text] = text;
        return obj;
      }, {});
      const str = JSON.stringify(jsonObj, null, 2);
      fs.writeFileSync(outputFilePath, str);
    }
  };
}