# 微软tts python版demo(cli)

## 写在前面

本仓库一开始的目的，是为了解决微软官方azure的网页版demo。不能直接下载转换后的MP3文件的问题

目前azure的网页版demo已经关闭，tampermonky版本失效，作为替代方法本仓库简单实现了，通过edge大声朗读接口和microsoft语音合成试用接口，下载合成后MP3文件的python版本，**仅用于学习交流之用，禁止用于商业用途**。

为了通俗易懂代码没有进行任何不必要的封装，tts.py 和tts2.py在均可独立运行。

如果需要成品软件强烈建议直接下载LokerL大佬编写的成品软件，https://github.com/LokerL/tts-vue/releases

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



## 进阶玩法(选择声音和说话风格，edge接口不支持说法风格)
> 因为用的网页版背后的API 所有网页版可以选择的声音和风格，这个小工具同样可以实现    
可以先看一下[声音和风格示例](./声音和风格示例)文件夹中的xml示例学习一下  
SSML（语音合成标记语言） 的`speak`标签内嵌套一个`voice`，voice name 声音的名字如`zh-CN-XiaoxiaoNeural`
`voice` 中可以嵌套`mstts`，`mstts`标签内可以指定说法的风格如`chat`聊天风格
，简单了解之后就可以通过调整 SSML，以控制文本不同部分的声音效果。

```
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
    <voice name="zh-CN-XiaoxiaoNeural">
        <mstts:express-as style="chat">
            <prosody rate="0%" pitch="0%">晓晓聊天声音</prosody>
        </mstts:express-as>
    </voice>
</speak>
```
### 常用声音和风格列表

注'General'不用添加到sytle中

> edge接口不支持说法风格

|           中文名           | voice name             | 支持风格 style                                               |
| :------------------------: | ---------------------- | ------------------------------------------------------------ |
|  Xiaoxiao (Neural) - 晓晓  | zh-CN-XiaoxiaoNeural   | 'general', 'assistant', 'chat', 'customerservice', 'newscast', 'affectionate', 'angry', 'calm', 'cheerful', 'disgruntled', 'fearful', 'gentle', 'lyrical', 'sad', 'serious' |
|  Yunyang (Neural) - 云扬   | zh-CN-YunyangNeural    | 'general', 'customerservice', 'narration-professional', 'newscast-casual' |
|  Xiaochen (Neural) - 晓辰  | zh-CN-XiaochenNeural   | 'general'                                                    |
|  Xiaohan (Neural) - 晓涵   | zh-CN-XiaohanNeural    | 'general', 'calm', 'fearful', 'cheerful', 'disgruntled', 'serious', 'angry', 'sad', 'gentle', 'affectionate', 'embarrassed' |
|   Xiaomo (Neural) - 晓墨   | zh-CN-XiaomoNeural     | 'general', 'embarrassed', 'calm', 'fearful', 'cheerful', 'disgruntled', 'serious', 'angry', 'sad', 'depressed', 'affectionate', 'gentle', 'envious' |
|  Xiaoqiu (Neural) - 晓秋   | zh-CN-XiaoruiNeural    | 'general'                                                    |
|  Xiaorui (Neural) - 晓睿   | zh-CN-XiaoruiNeural    | 'general', 'calm', 'fearful', 'angry', 'sad'                 |
| Xiaoshuang (Neural) - 晓双 | zh-CN-XiaoshuangNeural | 'general', 'chat'                                            |
|  Xiaoxuan (Neural) - 晓萱  | zh-CN-XiaoxuanNeural   | 'general', 'calm', 'fearful', 'cheerful', 'disgruntled', 'serious', 'angry', 'gentle', 'depressed' |
|  Xiaoyan (Neural) - 晓颜   | zh-CN-XiaoyanNeural    | 'general'                                                    |
|  Xiaoyou (Neural) - 晓悠   | zh-CN-XiaoyouNeural    | 'general'                                                    |
|   Yunxi (Neural) - 云希    | zh-CN-YunxiNeural      | 'general', 'narration-relaxed', 'embarrassed', 'fearful', 'cheerful', 'disgruntled', 'serious', 'angry', 'sad', 'depressed', 'chat', 'assistant', 'newscast' |
|   Yunye (Neural) - 云野    | zh-CN-YunyeNeural      | 'general', 'embarrassed', 'calm', 'fearful', 'cheerful', 'disgruntled', 'serious', 'angry', 'sad' |

以上是中文部分的，微软的tts支持100多种语音，其他的语音自己在网页上查看吧



## 如果对js逆向感兴趣

[可以在这里看调试过程](debugger_note.md)


## 参考代码
```
https://github.com/OS984/DiscordBotBackend/blob/3b06b8be39e4dbc07722b0afefeee4c18c136102/NeuralTTS.py
https://github.com/rany2/edge-tts/blob/master/src/edge_tts/communicate.py
https://github.com/LokerL/tts-vue/blob/main/electron/utils/api.ts
```