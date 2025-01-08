# yaml-chinesize
一个汉化 YAML 文件的工具

## 安装

```sh
$ npm install yaml-chinesize -g
```

## 使用

```sh
$ yaml-chinesize --help
Usage: yaml-chinesize [options] [command]

CLI to convert English YAML files to Chinese

Options:
  -V, --version            output the version number
  -h, --help               display help for command

Commands:
  extract [options] <dir>  Extract English texts of YAML files
  replace [options] <dir>  Replace English texts of YAML files to Chinese
  help [command]           display help for command
```

`yaml-chinesize` 提供了两个子命令：

- `extract`：提取代码里的英文文本
- `replace`：将代码里的英文文本替换成中文文本

### 提取

使用 `yaml-chinesize extract` 提取英文文本

```sh
$ yaml-chinesize help extract
Usage: yaml-chinesize extract <dir> [options]

Extract English texts of YAML files

Arguments:
  dir                            directory of YAML files

Options:
  -f, --fields <fields...>       the extracted fields
  -o, --output <filePath>        path of file for writing the extracted English text
  -h, --help                     display help for command
```

`extract` 有 1 个参数和 4 个选项：

- `dir`：汉化的 Angular 项目目录
- ` --fields <fields...>`：要提取英文文本的字段名
- `--output <filePath>`：输出文件路径，提取的英文文本将写入这个文件。如果没有提供，默认是 `dir` 目录下的 `chinesize/texts-to-translate.json'` 文件

比如要提取 `/config` 目录下所有的 YAML 文件

```sh
$ yaml-chinesize extract /config -f title detail
```

将 `/config` 目录下所有 YAML 文的 `title` 和 `detail` 英文文本提取到 `~/Documents/tensorboard/chinesize/texts-to-translate.json`

下面是这个文件的节选

```json
{
  "Computer Vision": "Computer Vision",
  "Natural Language Processing": "Natural Language Processing",
  "Audio/Speech Processing": "Audio/Speech Processing",
  "Conversational AI": "Conversational AI",
  "Ranking & Scoring": "Ranking & Scoring",
  "Structured Data Parsing": "Structured Data Parsing",
  "Time Series Analysis": "Time Series Analysis",
  "Videos": "Videos",
  "Generative AI": "Generative AI"
}
```

### 翻译

然后您需要将这个 json 文件翻译成中文，您可以使用翻译软件、翻译 API（[Google Translate API](https://cloud.google.com/translate)）、AI 工具或者交给您们的翻译团队翻译。下面是我用 [Codeium](https://codeium.com/) 工具生成的

```json
{
  "Computer Vision": "计算机视觉",
  "Natural Language Processing": "自然语言处理",
  "Audio/Speech Processing": "音频/语音处理",
  "Conversational AI": "对话式人工智能",
  "Ranking & Scoring": "排序与评分",
  "Structured Data Parsing": "结构化数据解析",
  "Time Series Analysis": "时间序列分析",
  "Videos": "视频",
  "Generative AI": "生成式人工智能"
}
```

### 替换

翻译好了之后，使用 `yaml-chinesize replace` 替换英文文本为中文文本

```sh
$ yaml-chinesize help replace
Usage: yaml-chinesize replace <dir> [options]

Replace English texts of YAML files to Chinese

Arguments:
  dir                               directory of YAML files

Options:
  -f, --fields <fields...>          the replaced fields
  -i, --input <filePath>            path of file for reading the Chinese text
  -h, --help                        display help for command
```

`replace` 有 1 个参数和 5 个选项：

- `dir`：汉化的 Angular 项目目录
- ` --fields <fields...>`：要替换英文文本的字段名
- `--input <filePath>`：中英文翻译的文件路径。如果没有提供，默认是 `extract` 生成的文件路径

比如要替换 `/config` 目录下所有的 YAML 文件

```sh
$ yaml-chinesize replace /config  -f title detail
```
