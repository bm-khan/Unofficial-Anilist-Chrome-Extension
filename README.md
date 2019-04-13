# Unofficial Anilist Updater Chrome Extension

## Download now!
https://chrome.google.com/webstore/detail/ggjlaakenonjlionbnebgnnolhmplbje/

## How to set up
If you want to customize the application, you'll have to deal with setting this up locally, which means you'll have to set up your own client application on Anilist, and load an unpacked Chrome extension.
To set up the client app, you'll need to get a redirect URL from the Chrome extension.
Then to log in to Anilist, you'll need to get your app's clientId.

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
  - The Chrome extension only shows items that you have listed as watching/reading on Anilist, if you complete something, it will dissappear from the menu when you reload it
  - Adding items/removing items to your list isn't supported, only updating your watching/reading lists
  - Changing the progress number directly is not yet supported
  
