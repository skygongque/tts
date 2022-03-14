# 文本转语音的简单demo
官方的地址
```
https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/#overview
```

# 声明
仅用于学习交流禁止商用

# 项目的目的和相关说明
- 项目的核心功能是，可以直接下载转换后的MP3文件，微软官方的网页版demo不能直接下载转换后的MP3文件（直接录音对于转换文字较多时不是很方便）
- 该项目需要python环境，需要一点点python的基础（只要会用pip 安装包，会运行代码即可）
- 因为本人UI水平比较差所以没有制作GUI，CLI的小工具打包成EXE意义不大（如果python都不会装，大概率也不会用CLI的EXE小工具）


## 使用方法

使用方法视频版本
https://www.bilibili.com/video/BV13S4y1D7u7   


安装依赖
```
pip install -r requirements.txt
```

运行
```
python tts.py --input SSML.xml
```
> 使用python 运行tts.py，通过参数input传入`SSML.xml`文件的路径

或者可以通过传入`output` 传入希望保存的文件名
```
python tts.py --input SSML.xml --output 保存文件名
```

`SSML.xml`文件的示例如下
```
<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
    <voice name="zh-CN-XiaoxiaoNeural">
        <prosody rate="0%" pitch="0%">
        这个是 SSML 语音合成标记语言
        </prosody>
    </voice>
    <voice name="zh-CN-XiaoxiaoNeural">
        <prosody rate="0%" pitch="0%">
        这个是晓晓的声音
        </prosody>
    </voice>
    <voice name="zh-CN-YunyangNeural">
        <prosody rate="0%" pitch="0%">
        这个是云扬的声音。
        </prosody>
    </voice>
</speak>
```
`voice name` 声音的名字  
`rate` 速度  
`pitch` 语调  


## 进阶玩法(选择声音和说话风格)
> 因为用的网页版背后的API 所有网页版可以选择的声音和风格，这个小工具同样可以实现    
可以先看一下[声音和风格示例](./声音和风格示例)文件夹中的xml示例学习一下  
SSML（语音合成标记语言） 的`speak`标签内嵌套一个或多个`voice`，voice name 声音的名字如`zh-CN-XiaoxiaoNeural`
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

| 中文名                     | voice name             | 支持风格 style                                               |
| -------------------------- | ---------------------- | ------------------------------------------------------------ |
| Xiaoxiao (Neural) - 晓晓   | zh-CN-XiaoxiaoNeural   | 'General', 'Assistant', 'Chat', 'Customer Service', 'Newscast', 'Affectionate', 'Angry', 'Calm', 'Cheerful', 'Disgruntled', 'Fearful', 'Gentle', 'Lyrical', 'Sad', 'Serious' |
| Yunyang (Neural) - 云扬    | zh-CN-YunyangNeural    | 'General', 'Customer Service', 'Narration-professional', 'Newscast-casual' |
| Xiaochen (Neural) - 晓辰   | zh-CN-XiaochenNeural   | 'General'                                                    |
| Xiaohan (Neural) - 晓涵    | zh-CN-XiaohanNeural    | 'General', 'Calm', 'Fearful', 'Cheerful', 'Disgruntled', 'Serious', 'Angry', 'Sad', 'Gentle', 'Affectionate', 'Embarrassed' |
| Xiaomo (Neural) - 晓墨     | zh-CN-XiaomoNeural     | 'General', 'Embarrassed', 'Calm', 'Fearful', 'Cheerful', 'Disgruntled', 'Serious', 'Angry', 'Sad', 'Depressed', 'Affectionate', 'Gentle', 'Envious' |
| Xiaoqiu (Neural) - 晓秋    | zh-CN-XiaoruiNeural    | 'General'                                                    |
| Xiaoshuang (Neural) - 晓双 | zh-CN-XiaoshuangNeural | 'General', 'Chat'                                            |
| Xiaoxuan (Neural) - 晓萱   | zh-CN-XiaoxuanNeural   | 'General', 'Calm', 'Fearful', 'Cheerful', 'Disgruntled', 'Serious', 'Angry', 'Gentle', 'Depressed' |
| Xiaoyan (Neural) - 晓颜    | zh-CN-XiaoyanNeural    | 'General'                                                    |
| Xiaoyou (Neural) - 晓悠    | zh-CN-XiaoyouNeural    | 'General'                                                    |
| Yunxi (Neural) - 云希      | zh-CN-YunxiNeural      | 'General', 'Narration-relaxed', 'Embarrassed', 'Fearful', 'Cheerful', 'Disgruntled', 'Serious', 'Angry', 'Sad', 'Depressed', 'Chat', 'Assistant', 'Newscast' |
| Yunye (Neural) - 云野      | zh-CN-YunyeNeural      | 'General', 'Embarrassed', 'Calm', 'Fearful', 'Cheerful', 'Disgruntled', 'Serious', 'Angry', 'Sad' |





## 如果对js逆向感兴趣

[可以在这里看调试过程](debugger_note.md)
