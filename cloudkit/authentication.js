var user;

function setUpAuth() {
    // Get the container.
    var container = CloudKit.getDefaultContainer();
    function gotoAuthenticatedState(userIdentity) {
      var name = userIdentity.nameComponents;
      user = userIdentity.userRecordName; //grab userRecordName for pet transaction data
      if(name) {
        displayUserName(name.givenName + ' ' + name.familyName);
      } else {
        if (userIdentity.userRecordName == '_bb5bc7e827f283a4eab12e6ca4abf480') {
            displayUserName('Hello, Ben Friedman');
        } else {
            displayUserName('User record name: ' + userIdentity.userRecordName);
        }
        fetchRecords(); //fetch goals and transactions after login
      }
      container
        .whenUserSignsOut()
        .then(gotoUnauthenticatedState);
    }
    function gotoUnauthenticatedState(error) {

      if(error && error.ckErrorCode === 'AUTH_PERSIST_ERROR') {
        showDialogForPersistError();
      }

      displayUserName(' ');
      container
        .whenUserSignsIn()
        .then(gotoAuthenticatedState)
        .catch(gotoUnauthenticatedState);
    }

    // Check a user is signed in and render the appropriate button.
    return container.setUpAuth()
      .then(function(userIdentity) {

        // Either a sign-in or a sign-out button was added to the DOM.

        // userIdentity is the signed-in user or null.
        if(userIdentity) {
          gotoAuthenticatedState(userIdentity);
        } else {
          gotoUnauthenticatedState();
        }
      });
}

function fetchCurrentUserIdentity() {
  var container = CloudKit.getDefaultContainer();

  // Fetch user's info.
  return container.fetchCurrentUserIdentity()
    .then(function(userIdentity) {
      var title = 'UserIdentity for current '+
        (userIdentity.nameComponents ? 'discoverable' : 'non-discoverable')+
        ' user:';

      // Render the user's identity.
      //return renderUserIdentity(title,userIdentity);
    });
}

var displayUserName = function(name) {
  //will display your first and last name from your appleID if you have granted permission
  var displayedUserName = document.getElementById('displayed-username');
  if(displayedUserName) {
    displayedUserName.textContent = name;
  }
};

//calls to run the above functions
////check if authenticated and if not display apple login button/window
setUpAuth();
////should diplay the discoverable userID after you have logged in and allowed discovery
fetchCurrentUserIdentity();