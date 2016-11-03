CloudKit.configure({
    locale: 'en-us',
    containers: [{
        // Change this to a container identifier you own.
        containerIdentifier: 'iCloud.com.capstone.fs2016.PettyCash',
        apiTokenAuth: {
            // And generate a web token through CloudKit Dashboard.
            apiToken: '9c9c00a6f10c996af97645f2fdcee03966dd52837de28e96cee16aa5c45c353c',
            persist: true, // Sets a cookie.
            signInButton: {
                id: 'apple-sign-in-button',
                theme: 'black' // Other options: 'white', 'white-with-outline'.
            },
            signOutButton: {
                id: 'apple-sign-out-button',
                theme: 'black'
            }
        },
        auth : {persist: true},
        environment: 'development'		
    }]
});