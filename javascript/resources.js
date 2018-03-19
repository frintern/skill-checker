const Resources = {
  profile: {},
  apiKey: 'AIzaSyDekIQgs8W6fb7E22VMnaw4ftaI0XSTF1g',
  // these are the names of the different tabs on the Learning Playlist google sheet, as they map to our keys here.
  resourceKeys: {
    design: 'Design',
    analyse: 'Analyze',
    manage: 'Manage'
  },
  sheetId: '1_9AU2UCZxMDSSBaAjuTi7osLVUez7u_m_gT4Q7bRiAg',
  // sheetId: '1LpdUOpH_pcPcOk-ZPVwE4bYf8DXBmJsiddpUXcBBFsk',

  display: (valuesArr)=> {
    resourceList = ""
    $.each(valuesArr, (i, arr) => {
      resourceList += Resources.buildListElement(arr);
    });

    // append list to the page
    $('#resources').html(resourceList);
  },

  buildListElement: (listArr) => {
    if(listArr[1] === '#') {
      // build a sub-heading
      return `<h3>${listArr[0]}</h3>`
    } else {
      // build a linked paragraph --- url is present(assumption)
      return `<p>${listArr[0]} <a href='${listArr[1]}'>View resource</a></p>`
    }
  },

  initClient: () => {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
      apiKey: Resources.apiKey,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
      // clientId and scope are optional if auth is not required.
    })
    .then(() => {
      // 3. Initialize and make the API request.
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: Resources.sheetId,
        range: `${Resources.resourceKeys[Resources.profile.mostRelevant]}!A:B`,
      }).then((response) => {
        Resources.display(response.result.values);
      }, (reason) => {
        console.log('Error: ', reason.result.error);
        Resources.display(['No data found.', '#'])
      });
    });
  }
}

$( document ).ready(function() {
  const mostRelevant = sessionStorage.getItem('mostRelevant');
  const runnerUp = sessionStorage.getItem('runnerUp');

  if(mostRelevant && runnerUp) {
    Resources.profile = {
      mostRelevant: 'design',
      runnerUp: runnerUp
    };
    // 1. Load the JavaScript client library.
    gapi.load('client', Resources.initClient);
  } else {
    window.location.href = 'checker.html';
  }
});
