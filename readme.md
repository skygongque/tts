# 文本转语音的简单demo
官方的地址
```
https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/#features
```
# 申明
仅用于学习交流禁止商用

# 项目的目的和相关说明
- 项目的核心功能是，可以直接下载转换后的MP3文件，微软官方的网页版demo不能直接下载转换后的MP3文件（直接录音对于转换文字较多时不是很方便）

## 使用方法
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

## 如果对js逆向感兴趣
[可以在这里看调试过程](debugger_note.md)
