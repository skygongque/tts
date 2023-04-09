'''
参考代码
https://github.com/OS984/DiscordBotBackend/blob/3b06b8be39e4dbc07722b0afefeee4c18c136102/NeuralTTS.py
https://github.com/rany2/edge-tts/blob/master/src/edge_tts/communicate.py
'''


import websockets
import asyncio
from datetime import datetime
import time
import re
import uuid
import argparse


'''命令行参数解析'''
def parseArgs():
    parser = argparse.ArgumentParser(description='text2speech')
    parser.add_argument('--input', dest='input', help='SSML(语音合成标记语言)的路径', type=str, required=True)
    parser.add_argument('--output', dest='output', help='保存mp3文件的路径', type=str, required=False)
    args = parser.parse_args()
    return args

# Fix the time to match Americanisms
def hr_cr(hr):
    corrected = (hr - 1) % 24
    return str(corrected)

# Add zeros in the right places i.e 22:1:5 -> 22:01:05
def fr(input_string):
    corr = ''
    i = 2 - len(input_string)
    while (i > 0):
        corr += '0'
        i -= 1
    return corr + input_string

# Generate X-Timestamp all correctly formatted
def getXTime():
    now = datetime.now()
    return fr(str(now.year)) + '-' + fr(str(now.month)) + '-' + fr(str(now.day)) + 'T' + fr(hr_cr(int(now.hour))) + ':' + fr(str(now.minute)) + ':' + fr(str(now.second)) + '.' + str(now.microsecond)[:3] + 'Z'

# Async function for actually communicating with the websocket
async def transferMsTTSData(SSML_text, outputPath):
    req_id = uuid.uuid4().hex.upper()
    print(req_id)
    # TOKEN来源 https://github.com/rany2/edge-tts/blob/master/src/edge_tts/constants.py
    # 查看支持声音列表 https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4
    TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4"
    WSS_URL = (
        "wss://speech.platform.bing.com/consumer/speech/synthesize/"
        + "readaloud/edge/v1?TrustedClientToken="
        + TRUSTED_CLIENT_TOKEN
    )
    endpoint2 = f"{WSS_URL}&ConnectionId={req_id}"
    async with websockets.connect(endpoint2,extra_headers={
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Origin": "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        " (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.41"}) as websocket:
        message_1 = (
                    f"X-Timestamp:{getXTime()}\r\n"
                    "Content-Type:application/json; charset=utf-8\r\n"
                    "Path:speech.config\r\n\r\n"
                    '{"context":{"synthesis":{"audio":{"metadataoptions":{'
                    '"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":true},'
                    '"outputFormat":"audio-24khz-48kbitrate-mono-mp3"'
                    "}}}}\r\n"
                )
        await websocket.send(message_1)

        message_2 = (
        f"X-RequestId:{req_id}\r\n"
        "Content-Type:application/ssml+xml\r\n"
        f"X-Timestamp:{getXTime()}Z\r\n"  # This is not a mistake, Microsoft Edge bug.
        "Path:ssml\r\n\r\n"
        f"{SSML_text}")
        await websocket.send(message_2)

        # Checks for close connection message
        end_resp_pat = re.compile('Path:turn.end')
        audio_stream = b''
        while(True):
            response = await websocket.recv()
            print('receiving...')
            # print(response)
            # Make sure the message isn't telling us to stop
            if (re.search(end_resp_pat, str(response)) == None):
                # Check if our response is text data or the audio bytes
                if type(response) == type(bytes()):
                    # Extract binary data
                    try:
                        needle = b'Path:audio\r\n'
                        start_ind = response.find(needle) + len(needle)
                        audio_stream += response[start_ind:]
                    except:
                        pass
            else:
                break
        with open(f'{outputPath}.mp3', 'wb') as audio_out:
            audio_out.write(audio_stream)


async def mainSeq(SSML_text, outputPath):
    await transferMsTTSData(SSML_text, outputPath)

def get_SSML(path):
    with open(path,'r',encoding='utf-8') as f:
        return f.read()

if __name__ == "__main__":
    args = parseArgs()
    SSML_text = get_SSML(args.input)
    output_path = args.output if args.output else 'output_'+ str(int(time.time()*1000))
    asyncio.get_event_loop().run_until_complete(mainSeq(SSML_text, output_path))
    print('completed')
    # python tts.py --input SSML.xml
    # python tts.py --input SSML.xml --output 保存文件名