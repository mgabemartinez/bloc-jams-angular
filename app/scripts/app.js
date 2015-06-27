//require('./landing');
//require('./collection');
//require('./album');
//require("./profile");



 // Example album.
 var albumPicasso = {
   name: 'CAARGO EP',
   artist: 'CAARGO',
   label: 'G/M',
   year: '2015',
   albumArtUrl: '/images/album-placeholder.png',
 
   songs: [
       { name: 'Traveler', length: '4:36', audioUrl: '/music/placeholders/Traveler' }, 
       { name: 'Dreamreader', length: '4:26', audioUrl: '/music/placeholders/Dreamreader' },
       { name: 'Mala', length: '4:36', audioUrl: '/music/placeholders/Mala' },
       { name: 'Gold', length: '6:22', audioUrl: '/music/placeholders/Gold' },
       { name: 'Above', length: '7:06', audioUrl: '/music/placeholders/Above' }
     ]
 };



// App Config //

blocJams = angular.module('BlocJams', ['ui.router']);

blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   $locationProvider.html5Mode(true);
 
   $stateProvider.state('landing', {
     url: '/',
     controller: 'Landing.controller',
     templateUrl: '/templates/landing.html'
   });

   $stateProvider.state('song', {
     url: '/song',
     controller: 'Landing.controller',
     templateUrl: '/templates/song.html'
   });

    $stateProvider.state('collection', {
     url: '/collection',
     controller: 'Collection.controller',
     templateUrl: '/templates/collection.html'
   });

    $stateProvider.state('album', {
      url: '/album',
      templateUrl: '/templates/album.html',
      controller: 'Album.controller'
    });

 }]);



/// Call the controller ///

blocJams.controller('Landing.controller', ['$scope', function($scope) {
  console.log("Landing.controller");
  $scope.subText = "Turn the music up!";
  $scope.mainText = "Bloc Yams";

  $scope.subTextClicked = function() {
    $scope.subText += '!';
  };

  $scope.mainTextClicked = function() {
    $scope.mainText += '!';
  };

  $scope.albumURLs = [
    '/images/album-placeholders/album-1.jpg',
    '/images/album-placeholders/album-2.jpg',
    '/images/album-placeholders/album-3.jpg',
    '/images/album-placeholders/album-4.jpg',
    '/images/album-placeholders/album-5.jpg',
    '/images/album-placeholders/album-6.jpg',
    '/images/album-placeholders/album-7.jpg',
    '/images/album-placeholders/album-8.jpg',
    '/images/album-placeholders/album-9.jpg',
  ];

}]);


blocJams.controller('Collection.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
   $scope.albums = [];
    for (var i = 0; i < 33; i++) {
      $scope.albums.push(angular.copy(albumPicasso));
    }


   $scope.playAlbum = function(album){
     SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
   }
 }]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.album = angular.copy(albumPicasso);

  var hoveredSong = null;
 
   $scope.onHoverSong = function(song) {
     hoveredSong = song;
   };
 
   $scope.offHoverSong = function(song) {
     hoveredSong = null;
   };

 $scope.getSongState = function(song) {
     if (song === SongPlayer.currentSong && SongPlayer.playing) {
       return 'playing';
     }
     else if (song === hoveredSong) {
       return 'hovered';
     }
     return 'default';
   };

  $scope.playSong = function(song) {
    SongPlayer.setSong($scope.album, song);
  };

  $scope.pauseSong = function(song) {
    SongPlayer.pause();
  };
}]);



blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;
}]);
 


blocJams.service('SongPlayer', function() {
  var currentSoundFile = null;

  var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
  }

  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,
 
    play: function() {
      this.playing = true;
      currentSoundFile.play();
    },
    pause: function() {
      this.playing = false;
      currentSoundFile.pause();
    },

    next: function() {
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex++;
      if (currentTrackIndex >= this.currentAlbum.songs.length) {
        currentTrackIndex = 0;
      }
      var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);     
      },

    previous: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex--;
       if (currentTrackIndex < 0) {
         currentTrackIndex = this.currentAlbum.songs.length - 1;
       }

      var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
     },

    setSong: function(album, song) {
      if (currentSoundFile) {
        currentSoundFile.stop();
      }
      this.currentAlbum = album;
      this.currentSong = song;
      currentSoundFile = new buzz.sound(song.audioUrl, {
        formats: [ "mp3"],
        preload: true
      });

      this.play();
    }
  };
});






