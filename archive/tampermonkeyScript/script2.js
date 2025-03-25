// ==UserScript==
// @name         Azure Speech Download
// @namespace
// @version      0.3
// @description  为微软的文本转语音服务的 demo 页面添加下载按钮
// @author       Puteulanus
// @homepage     https://greasyfork.org/zh-CN/scripts/444347-azure-speech-download
// @match        https://azure.microsoft.com/*/services/cognitive-services/text-to-speech/*
// @icon         https://www.microsoft.com/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/909438
// ==/UserScript==
 
/* globals saveAs */
/* jshint esversion: 6 */
(function() {
    'use strict';
 
    // Your code here...
    if(!window.saveAs) {
        window.saveAs = (blob, name) => {
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
 
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }
 
    const SpeechSDK = window.SpeechSDK
    let fileSize = 0
    let wavFragments = []
    let enableDownload = false
 
    const downloadStatus = document.createElement('div')
    const downloadSize = document.createElement('div')
    const downloadButton = document.getElementById('playli').cloneNode(true)
    const buttonArea = document.getElementById('playli').parentElement
 
    downloadButton.id = ('donwloadli')
    // downloadButton.querySelector('span svg').style.transform = 'rotate(90deg)'
    downloadButton.querySelector('span:last-of-type').textContent = '下载'
    downloadButton.querySelector('button').style.backgroundColor = 'green'
    downloadButton.querySelector('button').style.borderColor = 'green'
    downloadButton.addEventListener('click', () => {
        downloadStatus.textContent = '下载中'
        enableDownload = true
        document.getElementById('playbtn').click()
        enableDownload = false
    })
    downloadStatus.style.marginRight = '10px'
    buttonArea.appendChild(downloadButton)
    buttonArea.parentElement.appendChild(downloadStatus)
    buttonArea.parentElement.appendChild(downloadSize)
 
    const streamHandler = {
        write: function (dataBuffer) {
            fileSize += dataBuffer.byteLength
            downloadSize.textContent = `已接收 ${fileSize / 1000} kb`
            wavFragments.push(dataBuffer);
        },
        close: function () {
            downloadStatus.textContent = '下载完成'
            const sentAudio = new window.Uint8Array(fileSize)
            fileSize = 0
            wavFragments.reduce((size, fragment) => {
                sentAudio.set(new window.Uint8Array(fragment), size)
                return size + fragment.byteLength
            }, 0)
            wavFragments.length = 0
            saveAs(new Blob([sentAudio]), (new Date()).toISOString().replace('T', ' ').replace(':', '_').split('.')[0] + '.mp3')
        }
    }
 
    const outputStream = SpeechSDK.PushAudioOutputStream.create(streamHandler)
 
    SpeechSDK.AudioConfig.fromSpeakerOutput = (() => {
        const fromSpeakerOutput = SpeechSDK.AudioConfig.fromSpeakerOutput
        return function (audioDestination) {
            return enableDownload ? audioDestination.onAudioEnd() || SpeechSDK.AudioConfig.fromStreamOutput(outputStream) : fromSpeakerOutput(audioDestination)
        }
    })()
})();