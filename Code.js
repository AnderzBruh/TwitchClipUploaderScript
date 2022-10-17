



function setupTrigger() {

  ScriptApp.newTrigger("main")
    .timeBased()
    .atHour(15)
    .everyDays(2)
    .create()
}







function main() {

  var twitchClip = getViableTwitchClip()
  upload(editClip(twitchClip), getClipInfo(twitchClip)[0]);

  var ss = SpreadsheetApp.openByUrl("CLIPS SPREADSHEET GOES HERE")
  var sheet = ss.getSheets()[0]
  sheet.getRange(sheet.createTextFinder(twitchClip).findNext().getRow(), 1).setBackground("#9900ff")
}








function getViableTwitchClip() {

  var ss = SpreadsheetApp.openByUrl("CLIPS SPREADSHEET GOES HERE")
  var sheet = ss.getSheets()[0]
  var possibilities = []
  console.log("last: " + sheet.getLastRow())
  for (var i = 7; i <= sheet.getLastRow(); i++) {

    if (sheet.getRange(i, 1).getBackground() == "#ffffff") {

      possibilities.push(sheet.getRange(i, 3).getValue())
      console.log(i)
    }

  }

  var selection = possibilities[Math.round(Math.random() * possibilities.length)]
  console.log(selection)
  return (selection)
}













function editClip(twitchClip) {


  var clipInfo = getClipInfo(twitchClip)


  const url = "https://api.shotstack.io/v1/render";
  const params = {
    method: "post",
    headers: { "x-api-key": "SHOTSTACK API KEY GOES HERE" },
    contentType: "application/json",
    payload: JSON.stringify(


      {
        "timeline": {
          "background": "#36ffd7",
          "tracks": [
            {
              "clips": [
                //face cam
                {
                  "asset": {
                    "type": "video",
                    "src": clipInfo[1],
                    "crop": {
                      "top": 0.195,
                      "bottom": 0.53,
                      "left": 0.775,
                      "right": 0
                    }
                  },
                  "start": 0,
                  "offset": {
                    "x": -0,
                    "y": 0.2779
                  },
                  "position": "topRight",
                  "scale": 1.41,
                  "length": parseFloat(clipInfo[2])
                },
                {//main gameplay
                  "asset": {
                    "type": "video",
                    "src": clipInfo[1]
                  },
                  "start": 0,
                  "offset": {
                    "x": 0,
                    "y": 0
                  },
                  "position": "bottom",
                  "scale": 0.615,
                  "length": parseFloat(clipInfo[2])
                }
              ]




            }
          ]
        },
        "output": {
          "format": "mp4",
          "size": {
            "width": 1080,
            "height": 1920
          },
          "fps": 30
        }
      }



    )
  };
  const response = UrlFetchApp.fetch(url, params);
  var outputJSON = response.getContentText();
  var vidID = outputJSON.slice(outputJSON.indexOf(',"id":"') + 7, outputJSON.length - 3)



  const newurl = "https://api.shotstack.io/v1/render/" + vidID;
  const newparams = {
    method: "get",
    headers: { "x-api-key": "SHOTSTACK API KEY GOES HERE" },
    contentType: "application/json"
  };

  var outputJSON = "poggers"
  Utilities.sleep(clipInfo[2] * 2000)

  while (!outputJSON.includes('"status":"done"') && !outputJSON.includes('"status":"failed"')) {
    Utilities.sleep(5000)
    const newresponse = UrlFetchApp.fetch(newurl, newparams);
    outputJSON = newresponse.getContentText();
    console.log("Still rendering...")
  }


  console.log(outputJSON)

  if (outputJSON.includes('"status":"done"')) {

    console.log('EDIT SUCCESS')
    var finishedVidLink = outputJSON.slice(outputJSON.indexOf(',"url":"') + 8, outputJSON.indexOf('.mp4","') + 4)
    return (finishedVidLink)

  } else {

    console.log('ATTEMPTING EDIT AGAIN')
    return (editClip(twitchClip))

  }
}














function testingTikTok() {
  var videoTitle = "test upload #foryoupage #foryou #And3rz #gaming #funny https://www.tiktok.com"
  var editedRawVideo = "TESTING LINK GOES HERE"

  const data = {
    "post": videoTitle,
    "platforms": ["tiktok"],
    "mediaUrls": [editedRawVideo]
  };

  const requestOptions = {
    muteHttpExceptions: true,
    method: 'POST',
    headers: {
      "Authorization": `Bearer AYRSHARE API KEY GOES HERE`,
      "Content-Type": "application/json"
    },

    body: JSON.stringify(data),
  };
  console.log(UrlFetchApp.fetch("https://app.ayrshare.com/api/post", requestOptions).getContentText())


}















function upload(editedRawVideo, videoTitle) {

  try {
    var video = UrlFetchApp.fetch(editedRawVideo);
    YouTube.Videos.insert({
      snippet: {
        title: videoTitle,
        description: "Catch me LIVE: \nTwitch.tv/And3rzPog\n\nFollow my Tiktok:\nTiktok.com/@and3rzpog",
        tags: [""]
      },
      status:
      {
        privacyStatus: "private",
        selfDeclaredMadeForKids: false,
      },
    },
      "snippet,status", video);
    return ContentService.createTextOutput("done")
  }
  catch (err) {
    return ContentService.createTextOutput(err.message)
  }


}












function getClipInfo(twitchClip) {
  var clipID = twitchClip.slice(24, twitchClip.length)
  console.log(clipID)
  const t_url = "https://api.twitch.tv/helix/clips?id=" + clipID
  const t_params = {
    method: "get",
    headers: {
      'Authorization': 'Bearer ' + getNewTwitchToken(),
      'Client-Id': 'TWITCH CLIENT ID GOES HERE'
    }

  };

  const t_response = UrlFetchApp.fetch(t_url, t_params);
  var outputJSON = t_response.getContentText();
  console.log(outputJSON)
  var clipInfo = []
  clipInfo.push(outputJSON.slice(outputJSON.indexOf(',"title":"') + 10, outputJSON.indexOf('","view_count":')))
  clipInfo.push(outputJSON.slice(outputJSON.indexOf('","thumbnail_url":"') + 19, outputJSON.indexOf('-preview-')) + '.mp4')
  clipInfo.push(outputJSON.slice(outputJSON.indexOf('","duration":') + 13, outputJSON.indexOf(',"vod_offset":')))
  console.log(clipInfo)
  return (clipInfo)
}










function getNewTwitchToken() {

  const tokenResponse = UrlFetchApp.fetch('https://id.twitch.tv/oauth2/token?client_id={TWITCH CLIENT ID GOES HERE}&client_secret={TWITCH CLIENT SECRET GOES HERE}&grant_type=client_credentials', { method: 'POST', })
  var tokenOutputJSON = tokenResponse.getContentText();
  console.log(tokenOutputJSON)
  var token = tokenOutputJSON.slice(tokenOutputJSON.indexOf('{"access_token":"') + 17, tokenOutputJSON.indexOf('","expires_in"'))
  console.log(token)
  return (token)

}


