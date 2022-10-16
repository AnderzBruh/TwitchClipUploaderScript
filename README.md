# TwitchClipUploaderScript

This script automatically uploads edited twitch clips of mine to youtube (tiktok not working for some reason, still figuring it out.)


Steps it does this:

1. Connects to a spreadsheet of twitch clips I have

2. Filters throuh them to select a ransom one that isn't uploaded yet and also wasn't blacklisted by me to not be uploaded automatically.

3. Gets the clip info using the twitch API and outputs an array with the clip title, duration, and raw video link.

4. Makes a request to the shotstack editing API to edit the video to be vertical and with my face cam on top.

5. Takes the output edited video and uploads it to youtube using the youtube data API.

7. (working on this) Connects to the Ayrshare API to upload the video to tiktok on my behalf becasue I don't think I can get an official API key. (outputs {"action":"post","status":"error","code":162,"message":"Missing post parameter. Please verify a non-empty post field is sent. https://docs.ayrshare.com/rest-api/endpoints/post" } for saome reason.

9. Specifies that the clip has been uploaded in the spreadsheet so it doesn't select it again.


All of this is on a 48 hour timer trigger running in Google Apps Scripts
