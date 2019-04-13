var doc = document;
var storage = chrome.storage.local;
const NAMESPACES = {
  token: "token",
  userId: "userId",
  type: "type",
};

// Different for everyones install
var client_id = clientData.clientId;
var webAuthUrl = "https://anilist.co/api/v2/oauth/authorize?client_id=" + client_id + "&response_type=token";
var token;
const SERVICE_URL = 'https://graphql.anilist.co'
const METHOD = 'POST';
var userId = "";
var headers = {
  'Authorization': 'Bearer ',
  'Content-Type': 'applicaton/json',
  'Accept': 'application/json'
}

var fullList = [];
var displayedList = [];
var displayedType = "ANIME";
// var watching = [];
// var aitingWatching = [];
var display = doc.getElementById("display");
const COLUMNS = 4;
const thumbHeight = 130;
const thumbWidth = 100;

var logIn = doc.getElementById("logIn");
logIn.addEventListener('click', function() {
  console.log("launching web auth flow");
  chrome.identity.launchWebAuthFlow({url: webAuthUrl, interactive: true}, function(redirectUrl) {
    console.log(redirectUrl);
    //parse token from here
    let access_token = redirectUrl.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
    console.log("token: ", access_token);
    token = access_token;
    storage.set({[NAMESPACES.token]: token});
    headers['Authorization'] = 'Bearer ' + token;

    if (token) {
      let query = `
      query {
        Viewer {
          id
        }
      }`;

      let options = getOptions(query);
      console.log(options);
      fetch(SERVICE_URL, options)
        .then(handleResponse)
        .then(function(response) {
          console.log(response)
          userId = response.data.Viewer.id;
          storage.set({[NAMESPACES.userId]: userId});
          logIn.style.display = "none";
          logOut.style.display = "";
          refreshList();
        })
        .catch(handleError);
    }
  });
})

var logOut = doc.getElementById("logout");
logOut.addEventListener('click', function() {
  storage.set({[NAMESPACES.token]: ``, [NAMESPACES.userId]: ``});
  headers[`Authorization`] = "Bearer ";
  token = "";
  userId = "";
  refreshList();
  logOut.style.display = "none";
  logIn.style.display = "";
});

function getOptions(query, variables) {
  let options = {
    method: METHOD,
    headers: headers,
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  };
  return options;
}

async function refreshList() {
  fullList = await getWatching();
  displayedList = fullList;
  updateImages();
}

async function getWatching() {
  // IF you change type to MANGA it still (kinda) works
  let type;
  let format;
  if (displayedType === "MANGA") {
    type = "MANGA";
    format = "chapters";
  } else {
    type = "ANIME";
    format = "episodes";
  }
  query = `
    query($userId : Int) {
      MediaListCollection(userId : $userId, type:${type}, status : CURRENT, sort: UPDATED_TIME) {
        lists {
          isCustomList
          name
          entries {
            id
            mediaId
            progress
            media {
              status
              ${format}
              title {
                romaji
                english
              }
              coverImage {
                medium
              }
            }
          }
        }
      }
    }`
  ;

  variables = {
    userId: userId,
  }
  let watchingList;
  await fetch(SERVICE_URL, getOptions(query, variables))
    .then(handleResponse)
    .then(function(data) {
      console.log("fetched", data);
      watchingList = data.data.MediaListCollection.lists[0].entries;
    }).catch(handleError);
  return watchingList;
}

function handleResponse(response) {
  return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
  });
}

function handleError(error) {
    // alert('Error, check console');
    console.error(error);
}

function updateImages() {
  display.innerHTML = '<tbody></tbody>';
  let displayBody = display.tBodies[0];
  console.log("UPDATE IMAGES");
  if (displayedList === undefined || displayedList.length === 0) {
    let noItems = doc.createElement('H5');
    let text = doc.createTextNode("Doesn't look like anythings here, are you logged in?");
    noItems.appendChild(text);
    display.appendChild(noItems);
  }
  let newRowHtmlString = "";

  for (let i = displayedList.length - 1; i >= 0; i--) {
    let mediaList = displayedList[i];

    let imgHtmlString = `<img `;
    imgHtmlString += `id="mediaList-${mediaList.id}" `;
    imgHtmlString += `height="${thumbHeight}px" `;
    imgHtmlString += `width="${thumbWidth}px" `;
    imgHtmlString += `src="${mediaList.media.coverImage.medium}" `;
    imgHtmlString += `title="${mediaList.media.title.romaji}" `;
    imgHtmlString += `>`;

    let decrement = `<button `;
    decrement += `id="dec-${mediaList.id}" `;
    decrement += `style="float: left" `;
    decrement += `height="${1}" `;
    decrement += `width="${1}" `;
    decrement += `>`;
    decrement += `-`;
    decrement += `</button>`;

    let totalEpisodes;
    if (displayedType === "MANGA") {
      totalEpisodes = mediaList.media.chapters || '';
    } else {
      totalEpisodes = mediaList.media.episodes || '';
    }

    let text = `<span `;
    text += `id="prog-${mediaList.id}"`;
    text += `>`;
    text += `${mediaList.progress}/${totalEpisodes || '?'}`;
    text += `</span>`;
    let increment = `<button `;
    increment += `id="inc-${mediaList.id}" `;
    increment += `style="float: right" `;
    increment += `height="${1}" `;
    increment += `width="${1}" `;
    increment += `>`;
    increment += `+`;
    increment += `</button>`;

    let span = `<div class="centerText">${decrement} ${text} ${increment}</div>`;


    let cellHtmlString = `<td class="cell"> ${imgHtmlString} ${span}</td>`
    newRowHtmlString += cellHtmlString
    if ((displayedList.length - 1 - i)%COLUMNS === COLUMNS-1) {
      newRowHtmlString = '<tr>' + newRowHtmlString + '</tr>'
      displayBody.innerHTML += newRowHtmlString;
      newRowHtmlString = "";
    }

  }
  if (newRowHtmlString !== "") {
    newRowHtmlString = '<tr>' + newRowHtmlString + '</tr>'
    displayBody.innerHTML += newRowHtmlString;
  }
  for (i = displayedList.length - 1; i >= 0; i--) {
    let mediaList = displayedList[i];
    // doc.getElementById(`mediaList-${mediaList.id}`).addEventListener("click", mediaClick(mediaList));
    doc.getElementById(`dec-${mediaList.id}`).addEventListener("click", mediaClick(mediaList, -1));
    doc.getElementById(`inc-${mediaList.id}`).addEventListener("click", mediaClick(mediaList, 1));
  }
}

function mediaClick(mediaList, i) {
  return async function(e) {
    let progress;
    if (!i) {
      let containerRect = e.target.getBoundingClientRect();
      let x = e.clientX - containerRect.left;
      let y = e.clientY - containerRect.top;
      console.log(x, y);
      console.log(mediaList.media.title.romaji, x < (thumbWidth/2) ? "left" : "right");
      progress = mediaList.progress + (x <= (thumbWidth/2) ? -1 : 1); //Click left, decrement, right, incremenet
    } else {
      progress = mediaList.progress + i;
      console.log("oho");
    }
    console.log("prog: ", mediaList.progress, "new", progress);
    let query = `
      mutation ($id: Int, $progress: Int) {
        SaveMediaListEntry (id: $id, progress: $progress) {
          id
          progress
        }
      }
    `;
    let variables = {
      "id": mediaList.id,
      "progress": progress
    };
    let options = getOptions(query, variables);
    fetch(SERVICE_URL, options).then(handleResponse).then(function (data) {
      console.log(data);
      mediaList.progress = data.data.SaveMediaListEntry.progress
      doc.getElementById(`prog-${mediaList.id}`).innerText = `${mediaList.progress}/${mediaList.media.episodes}`;
    }).catch(handleError);

  }
}

async function toggleList() {
  displayedType = displayedType === "ANIME" ? "MANGA" : "ANIME";
  storage.set({[NAMESPACES.type]: displayedType});
  refreshList();
}

function searchList(e) {
  e.preventDefault();
  let query = searchInput.value;
  if (query) {
    console.log(typeof(query));
    query = query.toUpperCase();
    displayedList = fullList.filter(function(mediaList) {
      console.log(mediaList);
      console.log(mediaList.media.title.romaji, mediaList.media.title.english);
      let romaji = mediaList.media.title.romaji || "";
      let english = mediaList.media.title.english || "";
      return romaji.toUpperCase().includes(query) || english.toUpperCase().includes(query);
    });
    updateImages();
  } else {
    displayedList = fullList;
    updateImages();
  }
}

var refresh = doc.getElementById("refreshDisplay");
refresh.addEventListener('click', updateImages);

var toggle = doc.getElementById("toggle");
toggle.addEventListener('click', toggleList);

var searchInput = doc.getElementById("search");
var searchButton = doc.getElementById("go");
searchButton.addEventListener('click', searchList);

storage.get([NAMESPACES.token, NAMESPACES.userId, NAMESPACES.type], async function(result) {
  if (result.type) {
    displayedType = result.type
  } else {
    displayedType = "ANIME"; // default type
  }
  console.log("token retrieved: ", result.token);
  token = result.token;
  headers['Authorization'] = 'Bearer ' + token;

  console.log("User id retrieved: ", result.userId);
  userId = result.userId;
  if (token && userId) {
    logIn.style.display = "none";
  } else {
    logOut.style.display = "none";
  }
  refreshList();
  // if (userId && token) {
  //   let watching = await getWatching();
  //   console.log("Watching: ",  watching);
  //   let airing = [];
  //   watching.forEach(mediaList => {
  //     if (mediaList.media.status === "RELEASING") {
  //       airing.push(mediaList);
  //       console.log(mediaList.media.coverImage.medium);
  //     }
  //   });
  //   // displayedList = airing;  //Set this if you want airing
  //   displayedList = watching;   //Set this if you want airing or watching
  // }
  // updateImages();
});
