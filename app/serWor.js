//the serviceWorker
var staticCacheName = 'bookingStatic-v1'

self.addEventListener('install', function(event) {
    // save the scripts and styles needed for the page in cache
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                'images/*.jpg',
                'scripts/app.js',
                'scripts/main.js',
                'scripts/controllers/skins.js',
                '/vulcanizedPolymer.html',
                'styles/main.css',
                'styles/responsive.css',
                'bower_components/jquery/dist/jquery.js',
                'bower_components/webcomponentsjs/webcomponents.js',
                'bower_components/bootstrap/dist/css/bootstrap.css',
                'bower_components/angular/angular.js',
                'bower_components/bootstrap/dist/js/bootstrap.js',
                'bower_components/angular-aria/angular-aria.js',
                'bower_components/ng-polymer-elements/ng-polymer-elements.js',
                'bower_components/firebase/firebase.js',
                'bower_components/angularfire/dist/angularfire.js'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all( //wait for all promises to resolve
                cacheNames.filter(function(cacheName) {
                    // delete all the old versions of our cache that is not the current cache
                    return cacheName.startsWith('bookingStatic-') && cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


self.addEventListener('fetch', function(event) {
    // return with cached item if there is any otherwise take them from network
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) return response;
            return fetch(event.request);
        })
    );
});


// listen for a waiting service worker to install
self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
        console.log('waiting worker installed')
    }
});

// listen for push notifications
self.addEventListener('push', function(event) {

var apiPath = '<apiPath>';
event.waitUntil(registration.pushManager.getSubscription().then(function (subscription){

    return fetch(apiPath).then(function(response){
        if(response.status !== 200){
            throw new Error();
        }

        return response.json().then(function(data){
            var title = data.title;
            var message = data.body;
            var icon = data.icon;
            var tag = data.tag;
            var url = data.url;
            return self.registration.showNotification(title,{
               body: message,
               icon: icon,
               tag: tag,
               data: url
            });
        })
    }).catch(function(err){

    })

}));
return;
});

// manifest.json
// {
//   "name": "APPNAME",
//   "gcm_sender_id": "SENDERID"
// }
// cURL request
// curl --header "Authorization: key=APIKEY" -application/json" https://fcm.googleapis.com/fcm/send -d "{\"registration_ids\":[\"REGISTRATIONID\"],\"notification\":{\"title\":\"test\",\"body\":\"testing\"},\"data\":{\"title\":\"erse\"}}"
