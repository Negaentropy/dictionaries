// Generated by CoffeeScript 1.10.0
define(["jquery", "utils", "background/setting", "background/ext", "background/storage", "background/dict.js", "background/dictwindow.js"], function($, utils, setting, ext, storage, dict, dictWindow) {
  console.log("[message] init");
  return chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var dictionary, history;
    if (request.type === 'getJson') {
      utils.getJson(request.url, request.data).then((function(res) {
        return sendResponse(res);
      }), sendResponse);
    } else if (request.type === 'postJson') {
      utils.postJson(request.url, request.data).then((function(res) {
        return sendResponse(res);
      }), sendResponse);
    } else if (request.type === 'look up') {
      if (request.means === 'mouse') {
        if (!setting.getValue('enableMinidict')) {
          return true;
        }
      }
      dictWindow.lookup(request.text);
    } else if (request.type === 'look up pain') {
      dict.queryWordPain(request.text).then(function(res) {
        return sendResponse(res);
      });
    } else if (request.type === 'query') {
      if (request.dictionary) {
        setting.setValue('dictionary', request.dictionary);
      }
      dictWindow.queryDict(request.text, request.dictionary, request.inHistory);
    } else if (request.type === 'dictionary') {
      dictionary = setting.getValue('dictionary');
      history = storage.history;
      sendResponse({
        allDicts: dict.allDicts,
        dictionary: dictionary,
        history: history
      });
      dictWindow.onDictInited();
    } else if (request.type === 'setting') {
      sendResponse(setting.configCache);
    } else if (request.type === 'save setting') {
      setting.setValue(request.key, request.value);
      if (request.key === 'enableMinidict') {
        ext.setBrowserIcon(request.value);
      }
    } else if (request.type === 'rating') {
      storage.addRating(request.text, request.value);
    } else if (request.type === 'deleteHistory') {
      storage.deleteHistory(request.text);
    } else if (request.type === 'injected') {
      dictWindow.onContentInjected(request.url, sender.tab.id);
    }
    return true;
  });
});
