# Unofficial Anilist Updater Chrome Extension

## How to set up
Since I'm too lazy to actually complete this thing and put it up on the Chrome Web Store, you'll have to deal with setting this up locally, which means you'll have to set up your own client application on Anilist, and install an unpacked Chrome extension
To do that, you need to get a clientId, and to do that you need to set up the chrome extension locally.

### Installing the Chrome extension:
  - Download the repository and unzip the download somewhere
  - Head to chrome://extensions/
  - Click 'Load unpacked'
  - Select the folder that you unzipped
  - Go to the Anilist Updater in your extensions and click 'Details'
  - Copy the ID string, this will be part of your client ID when setting up the API client on Anilist
  
### Setting up an API client on Anilist  
  - Head to https://anilist.co/settings/developer
  - Click 'Create New Client'
  - You can make the name whatever you like, although you might be legally obligated to say "UNOFFICIAL" in the title I'm not really sure
  - Change the redirect url to: https://[CHROME-EXT-ID].chromiumapp.org/, but replace [CHROME-EXT-ID] with the ID you copied from the details page of the Chrome extension
  - Save the client, there should now be a Client ID and Client Secret, don't let anyone see these
  - Copy the Client ID, and go back to where you installed the Chrome Extension
  - Open up the "data.js" file and replace the "YOUR CLIENT ID HERE" with "[CLIENTID]", where [CLIENTID] is the client ID you copied earlier

With that, the application should be ready to use.

## Use
  - Click the Anilist Updater icon in your toolbar to open the pop-up
  - 'Log in' will open a log in prompt for Anilist so the Chrome extension can access your lists. You can revoke this application's access to your account by going to https://anilist.co/settings/apps and revoking the application
  - 'Log out' will remove your token from storage and log you out
  - 'Refresh display' will simply refresh whatever content the app is displaying, handy if you think something went wrong
  - 'Toggle' will switch from displaying your anime list or your manga list
  - 'Search' will display whatever content on your list matches your search. As of now, only querying for the English and Romaji titles of media is supported
  - Click the '-' or '+' buttons to increment progress for a title
  
## Notes
  - Volumes for manga list items (including light novels) aren't supported, only chapters are shown
  - If the total number of chapters/episodes isn't finalized on Anilist (for currently releasing media) a '?' is shown instead
  - Sometimes things like episode numbers and images will load/update slowly
  - The Chrome extension only shows items that you have listed as watching/reading on Anilist, If you complete something, it will dissappear from the menu when you reload it
  - Adding items/removing items to your list isnt supported, only updating your watching/reading lists
  - Changing the progress number directly is not yet supported
  
