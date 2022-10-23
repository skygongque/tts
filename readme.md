# 微软tts音频下载解决方案
> 微软tts 使用 119 种语言和变体，超过 270 种神经语音来吸引全球观众。使用极具表现力和类似人类的声音将你的方案(如文本阅读器和支持语音的助手)变为现实。神经文本到语音转换功能支持若干种话语风格，包括聊天、新闻播报和客户服务，以及各种情感(如快乐和同情)。

## 官方的demo地址
```
https://azure.microsoft.com/zh-cn/products/cognitive-services/text-to-speech/#overview
```

# 项目目的和声明
- 本项目的目的是解决微软官方的网页版demo，不能直接下载转换后的MP3文件
- 本项目仅用于学习交流禁止用于商业用途

# 微软tts音频下载解决方案和对比
1. python 制作的命令行（cli）小工具
2. tampermonkey 脚本

|                | python 制作的命令行（cli）小工具                             | tampermonkey 脚本                                            |
| -------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 使用方法       | 1. 安装python 并安装依赖 2. `python tts.py --input SSML.xml` 根据 SSML.xml 生成音频 [详细步骤](./python_cli_demo/readme.md) | 1.安装tampermonkey 2. 安装脚本[脚本主页](https://greasyfork.org/zh-CN/scripts/441531-%E5%BE%AE%E8%BD%AFtts-%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE) 3. 推荐[大佬的更全功能的脚本](https://greasyfork.org/zh-CN/scripts/444347-azure-speech-download)4. [稍详细说明](./tampermonkeyScript/readme.md) |
| 易用性         | 无UI界面需要一定的学习成本                                   | 简单易用，原有网页添加下载音频按钮，其他使用方法相同         |
| 扩展性和灵活性 | 易扩展更灵活                                                 | 相对不易扩展                                                 |
