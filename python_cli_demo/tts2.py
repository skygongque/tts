import requests
import json
import uuid
import time
import argparse
# from retrying import retry # pip install retrying 网络不稳定时可考虑重试
""" 
微软api 参考 https://github.com/LokerL/tts-vue/blob/main/electron/utils/api.ts
使用接口 https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak
该接口并不稳定，仅是microsoft的免费试用接口，不过支持切换说话风格 
"""

# @retry 
def transferMsTTSData(SSML_text, outputPath):
    """ 发送请求保存音频文件 """
    data = json.dumps({
        'ssml':SSML_text,
        'ttsAudioFormat': 'audio-24khz-160kbitrate-mono-mp3',
        'offsetInPlainText': 0,
        'properties': {'SpeakTriggerSource': 'AccTuningPagePlayButton'}
    })
    headers =  {
        'authority': "southeastasia.api.speech.microsoft.com",
        'accept': "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        'customvoiceconnectionid': str(uuid.uuid4()),
        'origin': "https://speech.microsoft.com",
        "sec-ch-ua":
            '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        "content-type": "application/json",
        }
    res = requests.post('https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak',data=data,headers=headers)
    res.raise_for_status
    with open(outputPath + '.mp3','wb') as f:
        f.write(res.content)

def get_SSML(path):
    with open(path,'r',encoding='utf-8') as f:
        return f.read()

'''命令行参数解析'''
def parseArgs():
    parser = argparse.ArgumentParser(description='text2speech')
    parser.add_argument('--input', dest='input', help='SSML(语音合成标记语言)的路径', type=str, required=True)
    parser.add_argument('--output', dest='output', help='保存mp3文件的路径', type=str, required=False)
    args = parser.parse_args()
    return args

if __name__ == "__main__":
    # SSML_text = get_SSML('说话风格.xml')
    # output_path = 'output_'+ str(int(time.time()*1000))
    args = parseArgs()
    SSML_text = get_SSML(args.input)
    output_path = args.output if args.output else 'output_'+ str(int(time.time()*1000))
    transferMsTTSData(SSML_text,output_path)
    print('completed')
    # python tts2.py --input 说话风格.xml
    # python tts2.py --input 说话风格.xml --output 保存文件名