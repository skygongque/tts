# 微软tts音频下载解决方案
> 微软tts 使用 119 种语言和变体，超过 270 种神经语音来吸引全球观众。使用极具表现力和类似人类的声音将你的方案(如文本阅读器和支持语音的助手)变为现实。神经文本到语音转换功能支持若干种话语风格，包括聊天、新闻播报和客户服务，以及各种情感(如快乐和同情)。

## 官方的demo地址（目前仅有介绍不支持语音合成）
```
https://azure.microsoft.com/zh-cn/products/cognitive-services/text-to-speech/#overview
```
> 目前azure的网页版demo已经关闭，原先的tampermonkey方法失效  

# 项目目的和声明
- 本项目用python实现了microsoft语音合成试用接口、edge大声朗读接口的调用（见**python_cli_demo**文件夹）
- 本项目仅用于学习交流禁止用于商业用途


## 使用方法

使用方法视频版本
https://www.bilibili.com/video/BV13S4y1D7u7   


安装依赖

```
pip install -r requirements.txt
```

运行

```bash
python tts.py --input SSML.xml 
## 或者 
python tts2.py --input SSML.xml
```

> 在python_cli_demo目录下 使用python 运行tts.py，通过参数input传入`SSML.xml`文件的路径

或者可以通过传入`output` 传入希望保存的文件名

```bash
python tts.py --input SSML.xml --output 保存文件名 
# 或者
python tts2.py --input SSML.xml --output 保存文件名 
```

`SSML.xml`文件的示例如下

```
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
    <voice name="zh-CN-XiaoxiaoNeural">
        <prosody rate="0%" pitch="0%">
        这个是 SSML 语音合成标记语言
        </prosody>
    </voice>
</speak>
```
> 为了通俗易懂代码没有进行任何不必要的封装，tts.py 和tts2.py在均可独立运行。
>

## 接口说明

**tts.py** 使用edge大声朗读接口（下称edge接口）   

接口地址 wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1

**tts2.py** 使用microsoft语音合成试用接口（下称microsoft接口）

接口地址 https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak

|               | 稳定性 | 是否付费 | 是否支持说话风格 | 代码示例   |
| ------------- | ------ | -------- | ---------------- | ---------- |
| edge接口      | 中     | 免费     | 否               | tts.py     |
| microsoft接口 | 低     | 免费     | 是               | tts2.py    |
| azure接口     | 高     | 付费     | 是               | 见官方文档 |

## 其他项目
如果需要成品软件建议直接下载LokerL大佬编写的成品软件，有UI界面适合没有编程基础的一般用户，https://github.com/LokerL/tts-vue/releases 



