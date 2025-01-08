import fs from "node:fs";
import path from "node:path";
import { errorLog } from "./utils.js";
import { parseDocument } from 'yaml';

/**
 * Replace English texts of YAML files to Chinese
 * @param {string} dir The directory of YAML files
 * @param {string[]} fields The replaced fields
 * @param {string} input The path of file for reading the Chinese text
 */
export function replace(dir, fields, input) {
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
  const inputFilePath = input || path.join(dir, "chinesize", defaultFileName);

  if (!fs.existsSync(inputFilePath)) {
    console.log(errorLog(`Error: "${inputFilePath}" is not exists`));
    return;
  }

  const fileStat = fs.statSync(inputFilePath);
  if (!fileStat.isFile()) {
    console.log(errorLog(`Error: "${inputFilePath}" is not a file`));
    return;
  }

  const data = fs.readFileSync(inputFilePath, "utf-8");
  try {
    const translations = JSON.parse(data);
    replaceDir(dir, fields, translations);
  } catch (err) {
    console.log(errorLog(`Error: "${inputFilePath}" is not a valid JSON`));
    console.log(errorLog(err));
  }
}

/**
 * Recursively replaces English texts in a directory with translations.
 *
 * @param {string} dir - The directory to scan for files.
 * @param {string[]} fields The replaced fields
 * @param {object} translations - An object containing translations.
 */
function replaceDir(dir, fields, translations) {
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
          replaceDir(filePath, fields, translations);
        } else {
          const extname = path.extname(filePath);
          if (extname === ".yaml" || extname === ".yml") {
            replaceYaml(filePath, fields, translations);
          }
        }
      });
    });
  });
}

/**
 * Replaces English texts in a YAML file with translations.
 *
 * @param {string} filePath - The path of the YAML file.
 * @param {string[]} fields The replaced fields
 * @param {object} translations - An object containing translations.
 */

function replaceYaml(filePath, fields, translations) {
  // 读取 YAML 文件
  const file = fs.readFileSync(filePath, 'utf8');

  // 解析为 AST
  const doc = parseDocument(file);

  // 操作 AST
  fields.forEach(field => {
    const value = doc.get(field).trim();
    if (value) {
      const translation = translations[value];
      if (translation) {
        doc.set(field, translation);
      }
    }
  });
  
  // 序列化为 YAML
  const updatedYaml = String(doc);

  // 写回文件
  fs.writeFileSync(filePath, updatedYaml, 'utf8');
}
