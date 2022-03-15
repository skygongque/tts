// ==UserScript==
// @name         微软tts 下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  微软tts 下载按钮
// @author       skygongque
// @match        https://azure.microsoft.com/zh-cn/services/cognitive-services/text-to-speech/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @run-at document-start
// ==/UserScript==

(function () {
    'use strict';
    window.xtw = {}
    window.document.addEventListener_ = document.addEventListener;
    document.addEventListener = function () {
        if (arguments[0] == "DOMContentLoaded" && arguments.length == 2) {
            //debugger
            window.initializeTTSDemo2 = function (localizedResources) {
                $(document).ready(function () {
                    if (!window.xtw.playdlbut) {
                        window.xtw.playliparent = document.getElementById('playli').parentElement
                        window.xtw.playdlbut = document.createElement("button");
                        window.xtw.playdlbut.innerHTML = "先点播放";
                        window.xtw.playdlbut.classList.add('button');
                        window.xtw.playdlbut.classList.add('button--primary01');
                        window.xtw.playdlbut.classList.add('svg-button');
                        window.xtw.playliparent.appendChild(window.xtw.playdlbut);
                    }
                    var play = document.getElementById('playbtn'),
                        playli = document.getElementById('playli'),

                        stop = document.getElementById('stopbtn'),
                        stopli = document.getElementById('stopli'),

                        language = document.getElementById('languageselect'),
                        voice = document.getElementById('voiceselect'),
                        voicestyle = document.getElementById('voicestyleselect'),
                        roleplay = document.getElementById('roleplayselect'),
                        roleplaydiv = document.getElementById('roleplayselectdiv'),
                        secondarylocale = document.getElementById('secondarylocaleselect'),
                        secondarylocalediv = document.getElementById('secondarylocaleselectdiv'),

                        text = document.getElementById('ttstext'),
                        ssml = document.getElementById('ttsssml'),
                        status = document.getElementById('ttsstatus'),

                        speed = document.getElementById('speed'),
                        speedlabel = document.getElementById('speedlabel'),
                        pitch = document.getElementById('pitch'),
                        pitchlabel = document.getElementById('pitchlabel'),

                        player = null,
                        SpeechSDK = window.SpeechSDK,
                        voiceList = {},
                        styleList = {},
                        rolePlayList = {},
                        secondaryLocaleList = {},

                        defaultText;

                    SpeechSDK = window.SpeechSDK;

                    $.ajax({
                        url: 'https://' + localizedResources.region + '.tts.speech.microsoft.com/cognitiveservices/voices/list',
                        type: 'GET',
                        beforeSend: function textToSpeechVoiceListBeforeAjaxSend(xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + localizedResources.token); },
                        success: function textToSpeechVoiceListAjaxSuccess(data) {
                            // put neural voices in front.
                            var sorted = data.sort(function (a, b) {
                                return a.VoiceType.localeCompare(b.VoiceType);
                            });
                            $.each(sorted, function (_index, element) {
                                var displayName = element.DisplayName;
                                if (element.Status === 'Deprecated') {
                                    // Don't show deprecated voices.
                                    return;
                                }
                                if (!voiceList[element.Locale]) {
                                    voiceList[element.Locale] = '';
                                }
                                if (element.VoiceType === 'Neural') {
                                    displayName += ' (Neural)';
                                }
                                if (element.LocalName !== element.DisplayName) {
                                    displayName += ' - ' + element.LocalName;
                                }
                                if (element.Status === 'Preview') {
                                    displayName += ' - ' + localizedResources.ttsPreview;
                                }
                                voiceList[element.Locale] += '<option value="' + element.ShortName + '">' + displayName + '</option>';
                                styleList[element.ShortName] = element.StyleList;
                                rolePlayList[element.ShortName] = element.RolePlayList;
                                secondaryLocaleList[element.ShortName] = element.SecondaryLocaleList;
                            });
                            language.onchange();
                        },
                        error: function textToSpeechVoiceListAjaxError(_jqXHR, _textStatus, error) {
                            status.innerText = localizedResources.srTryAgain;
                            global.Core.Util.TrackException('A Text To Speech voice list API Ajax error occurred: ' + error);
                        }
                    });

                    function SpeakOnce() {
                        var config = SpeechSDK.SpeechTranslationConfig.fromAuthorizationToken(localizedResources.token, localizedResources.region),
                            synthesizer,
                            audioConfig;

                        // due to a bug in Chromium (https://bugs.chromium.org/p/chromium/issues/detail?id=1028206)
                        // mp3 playback has some beeps, using a higher bitrate here as a workaround.
                        config.speechSynthesisOutputFormat = SpeechSDK.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;

                        player = new SpeechSDK.SpeakerAudioDestination();
                        player.onAudioEnd = function () {
                            stopli.hidden = true;
                            playli.hidden = false;
                        };

                        audioConfig = SpeechSDK.AudioConfig.fromSpeakerOutput(player);

                        synthesizer = new SpeechSDK.SpeechSynthesizer(config, audioConfig);

                        synthesizer.synthesisCompleted = function () {
                            // 此时已经合成完毕了 arguments[1].privResult.privAudioData 为MP3文件
                            //debugger;
                            window.xtw.privAudioData = arguments[1].privResult.privAudioData;
                            window.xtw.playdlbut.innerHTML = "下载音频";
                            window.xtw.playdlbut.onclick = function () {
                                // https://stackoverflow.com/questions/19327749/javascript-blob-filename-without-link
                                function saveFile(name, type, data) {
                                    if (data !== null && navigator.msSaveBlob) {
                                        return navigator.msSaveBlob(new Blob([data], { type: type }), name);
                                    }
                                    var a = $("<a style='display: none;'/>");
                                    var url = window.URL.createObjectURL(new Blob([data], { type: type }));
                                    a.attr("href", url);
                                    a.attr("download", name);
                                    $("body").append(a);
                                    a[0].click();
                                    window.URL.revokeObjectURL(url);
                                    a.remove();
                                    window.xtw.playdlbut.innerHTML = "先点播放";
                                };
                                //debugger;
                                if (window.xtw.privAudioData) {
                                    saveFile(new Date().getTime(), "audio/mp3", window.xtw.privAudioData);
                                    window.xtw.privAudioData = null;
                                } else {
                                    alert('先点播放，等按钮变成下载音频再点击')
                                }
                            };
                            synthesizer.close();
                            synthesizer = null;
                        };

                        synthesizer.SynthesisCanceled = function (s, e) {
                            var details;
                            stopli.hidden = true;
                            playli.hidden = false;
                            details = SpeechSDK.CancellationDetails.fromResult(e);
                            if (details.reason === SpeechSDK.CancellationReason.Error) {
                                status.innerText = localizedResources.srTryAgain;
                            }
                        };

                        synthesizer.speakSsmlAsync(ssml.value, function () { }, function (error) {
                            status.innerText = localizedResources.srTryAgain + ' ' + error;
                        });
                    }

                    stop.onclick = function () {
                        playli.hidden = false;
                        stopli.hidden = true;

                        if (player !== null) {
                            player.pause();
                        }

                        player = null;
                    };

                    play.onclick = function () {
                        stopli.hidden = false;
                        playli.hidden = true;
                        status.innerText = '';
                        SpeakOnce(function () { });
                    };

                    language.onchange = function () {
                        defaultText = '';
                        $.each(localizedResources.ttsDefaultText, function (key, value) {
                            if (language[language.selectedIndex].value === key) {
                                defaultText = value;
                            } else if (!defaultText && language[language.selectedIndex].value.startsWith(key)) {
                                defaultText = value;
                            }
                        });
                        if (!defaultText) {
                            defaultText = localizedResources.ttsDefaultText.default;
                        }
                        text.value = defaultText;

                        // Arabic, Hebrew, Urdu and Persian use right-to-left text direction
                        if (['ar', 'he', 'ur', 'fa', 'ps'].includes(language[language.selectedIndex].value.slice(0, 2))) {
                            text.style.direction = 'rtl';
                        } else {
                            text.style.direction = '';
                        }

                        voice.innerHTML = voiceList[language[language.selectedIndex].value];
                        voice.onchange();
                        BuildAndSetSSML();
                    };


                    voice.onchange = function () {
                        voicestyle.innerHTML = '';
                        voicestyle.options.add(new Option('General', 'general'));

                        if (styleList[voice[voice.selectedIndex].value]) {
                            $.each(styleList[voice[voice.selectedIndex].value], function (_index, element) {
                                voicestyle.options.add(new Option(
                                    (element[0].toUpperCase() + element.slice(1))
                                        .replace('Customerservice', 'Customer Service')
                                        .replace('Voiceassistant', 'Voice Assistant'), element));
                            });
                            voicestyle.disabled = false;
                        } else {
                            voicestyle.disabled = true;
                        }

                        if (rolePlayList[voice[voice.selectedIndex].value]) {
                            roleplay.innerHTML = '';
                            roleplay.options.add(new Option('Default', 'Default'));
                            $.each(rolePlayList[voice[voice.selectedIndex].value], function (_index, element) {
                                roleplay.options.add(new Option(element, element));
                            });
                            roleplaydiv.hidden = false;
                        } else {
                            roleplaydiv.hidden = true;
                        }

                        if (secondaryLocaleList[voice[voice.selectedIndex].value]) {
                            secondarylocale.innerHTML = '';
                            secondarylocale.options.add(new Option(language[language.selectedIndex].text + ' - Default', language[language.selectedIndex].value));
                            $(language.options).each(function () {
                                if (secondaryLocaleList[voice[voice.selectedIndex].value].includes($(this).attr('value'))) {
                                    secondarylocale.options.add(new Option($(this).text(), $(this).attr('value')));
                                }
                            });
                            secondarylocalediv.hidden = false;
                        } else {
                            secondarylocalediv.hidden = true;
                        }

                        pitch.disabled = false;
                        speed.disabled = false;

                        BuildAndSetSSML();
                    };

                    voicestyle.onchange = function () {
                        BuildAndSetSSML();
                    };

                    roleplay.onchange = function () {
                        BuildAndSetSSML();
                    };

                    secondarylocale.onchange = function () {
                        if (secondarylocale.selectedIndex !== 0) {
                            pitch.disabled = true;
                            speed.disabled = true;
                        } else {
                            pitch.disabled = false;
                            speed.disabled = false;
                        }

                        defaultText = '';
                        $.each(localizedResources.ttsDefaultText, function (key, value) {
                            if (secondarylocale[secondarylocale.selectedIndex].value === key) {
                                defaultText = value;
                            } else if (!defaultText && secondarylocale[secondarylocale.selectedIndex].value.startsWith(key)) {
                                defaultText = value;
                            }
                        });
                        if (!defaultText) {
                            defaultText = localizedResources.ttsDefaultText.default;
                        }
                        text.value = defaultText;

                        BuildAndSetSSML();
                    };

                    pitch.oninput = function () {
                        var normalizedVal = ((pitch.value - pitch.min) / (pitch.max - pitch.min)) * (2),
                            displayVal;
                        if (Math.abs(normalizedVal) < 1) {
                            displayVal = normalizedVal.toPrecision(2);
                        } else {
                            displayVal = normalizedVal.toPrecision(3);
                        }
                        pitchlabel.innerText = localizedResources.ttsPitch + ': ' + displayVal;
                    };

                    pitch.onchange = function () {
                        BuildAndSetSSML();
                    };

                    speed.oninput = function () {
                        var normalizedVal = ((speed.value - speed.min) / (speed.max - speed.min)) * (3),
                            displayVal;
                        if (Math.abs(normalizedVal) < 1) {
                            displayVal = normalizedVal.toPrecision(2);
                        } else {
                            displayVal = normalizedVal.toPrecision(3);
                        }
                        speedlabel.innerText = localizedResources.ttsSpeed + ': ' + displayVal;
                    };

                    speed.onchange = function () {
                        BuildAndSetSSML();
                    };

                    text.onchange = function () {
                        BuildAndSetSSML();
                    };

                    function BuildAndSetSSML() {
                        var ssmlHeader = '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">{0}</speak>',
                            ssmlVoiceName = '<voice name="{VOICE}">{0}</voice>',
                            ssmlProperties = '<prosody rate="{SPEED}" pitch="{PITCH}">{TEXT}</prosody>',
                            ssmlExpression = '<mstts:express-as {STYLE_ATTRIBUTE} {ROLE_PLAY_ATTRIBUTE}>{0}</mstts:express-as>',
                            ssmlSecondaryLocale = '<lang xml:lang="{SECONDARY_LOCALE}">{0}</lang>',

                            ssmlText = ssmlProperties,
                            escapedText;
                        ssmlText = ssmlText.replace('{SPEED}', speed.value + '%');
                        ssmlText = ssmlText.replace('{PITCH}', pitch.value + '%');

                        if (voicestyle.selectedIndex !== 0 || (!roleplaydiv.hidden && roleplay.selectedIndex !== 0)) {
                            ssmlText = ssmlExpression.replace('{0}', ssmlText);
                            if (voicestyle.selectedIndex !== 0) {
                                ssmlText = ssmlText.replace('{STYLE_ATTRIBUTE}', 'style="' + voicestyle[voicestyle.selectedIndex].value + '"');
                            } else {
                                ssmlText = ssmlText.replace('{STYLE_ATTRIBUTE}', '');
                            }
                            if (!roleplaydiv.hidden && roleplay.selectedIndex !== 0) {
                                ssmlText = ssmlText.replace('{ROLE_PLAY_ATTRIBUTE}', 'role="' + roleplay[roleplay.selectedIndex].value + '"');
                            } else {
                                ssmlText = ssmlText.replace('{ROLE_PLAY_ATTRIBUTE}', '');
                            }
                        }

                        ssmlText = ssmlVoiceName.replace('{0}', ssmlText);
                        ssmlText = ssmlText.replace('{VOICE}', voice[voice.selectedIndex].value);

                        escapedText = text.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
                            .replace(/'/g, '&apos;');

                        if (!secondarylocalediv.hidden) {
                            escapedText = ssmlSecondaryLocale.replace('{0}', escapedText);
                            escapedText = escapedText.replace('{SECONDARY_LOCALE}', secondarylocale[secondarylocale.selectedIndex].value);
                        }
                        ssmlText = ssmlHeader.replace('{0}', ssmlText);
                        ssmlText = ssmlText.replace('{TEXT}', escapedText);

                        ssml.value = ssmlText;
                    }
                });
            };
            window.document.addEventListener_("DOMContentLoaded", function (event) {
                window.initializeTTSDemo2(localizedResources);
            });
        } else if (arguments.length == 3) {
            window.document.addEventListener_(arguments[0], arguments[1], arguments[2])
        } else if (arguments.length == 2) {
            window.document.addEventListener_(arguments[0], arguments[1])
        }
    }
    // Your code here...
})();