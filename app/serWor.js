//the serviceWorker
var staticCacheName = 'bookingStatic-v1'


self.addEventListener('install', function(event) {
    // save the scripts and styles needed for the page in cache
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                "images/lamm1-medium.jpg",
                "images/lamm1-small.jpg",
                "images/lamm10-medium.jpg",
                "images/lamm10-small.jpg",
                "images/lamm11-medium.jpg",
                "images/lamm11-small.jpg",
                "images/lamm12-medium.jpg",
                "images/lamm12-small.jpg",
                "images/lamm13-medium.jpg",
                "images/lamm13-small.jpg",
                "images/lamm14-medium.jpg",
                "images/lamm14-small.jpg",
                "images/lamm15-medium.jpg",
                "images/lamm15-small.jpg",
                "images/lamm2-medium.jpg",
                "images/lamm2-small.jpg",
                "images/lamm3-medium.jpg",
                "images/lamm3-small.jpg",
                "images/lamm4-medium.jpg",
                "images/lamm4-small.jpg",
                "images/lamm5-medium.jpg",
                "images/lamm5-small.jpg",
                "images/lamm6-medium.jpg",
                "images/lamm6-small.jpg",
                "images/lamm7-medium.jpg",
                "images/lamm7-small.jpg",
                "images/lamm8-medium.jpg",
                "images/lamm8-small.jpg",
                "images/lamm9-medium.jpg",
                "images/lamm9-small.jpg",
                'scripts/app.js',
                'scripts/main.js',
                'scripts/controllers/skins.js',
                'styles/main.css',
                'styles/responsive.css',
                'views/skins.html',
                '/favicon.ico',
                '/favicon-16x16.png',
                '/favicon-32x32.png',
                '/apple-touch-icon.png',
                '/index.html',
                '/manifest.json',
                '/vulcanizedPolymer.html',
                'bower_components/jquery/dist/jquery.js',
                'bower_components/webcomponentsjs/webcomponents.js',
                'bower_components/bootstrap/dist/css/bootstrap.css',
                'bower_components/angular/angular.js',
                'bower_components/bootstrap/dist/js/bootstrap.js',
                'bower_components/angular-aria/angular-aria.js',
                'bower_components/ng-polymer-elements/ng-polymer-elements.js',
                'bower_components/firebase/firebase.js',
                'bower_components/angularfire/dist/angularfire.js',
                'bower_components/ngstorage/ngStorage.js'
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
// curl --header "Authorization: key=APIKEY" -application/json" https://fcm.googleapis.com/fcm/send -d "{\"regi
// \"notification\":{\"title\":\"test\",\"body\":\"testing\"},\"data\":{\"title\":\"erse\"}}"
