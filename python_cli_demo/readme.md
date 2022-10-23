# 微软tts python版demo(cli)


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
> 在python_cli_demo目录下 使用python 运行tts.py，通过参数input传入`SSML.xml`文件的路径

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
