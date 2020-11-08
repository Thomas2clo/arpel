import $ from 'jquery';
import Plyr from 'plyr';

$(function() {
	'use strict';

	var b = document.documentElement;
	b.setAttribute('data-useragent', navigator.userAgent);
	b.setAttribute('data-platform', navigator.platform);

	// Player ------------------------------
	var supportsAudio = !!document.createElement('audio').canPlayType;
	if (supportsAudio) {
		var current_title = $('#current_title'),
			status = $('#status'),
			playlist = $('#playlist'),
			audio = $('#player');

		// init Plyr
		var player = new Plyr('#player', {
			controls: [
				'restart',
				'play',
				'progress',
				'current-time',
				'duration',
				'mute',
				'volume'
			]
		});

		var index = 0,
			playing = false,
			path = './assets/sounds/',
			extension = '',
			tracks = [],
			track_count = 0;

		load_playlist();

		var audio = $('#player')
				.on('play', function() {
					playing = true;
					$(status).text('Playing');
				})
				.on('pause', function() {
					playing = false;
					$(status).text('Paused');
				})
				.on('ended', function() {
					$(status).text('Paused');
					if (index + 1 < track_count) {
						index++;
						loadTrack(index);
						audio.play();
					} else {
						audio.pause();
						index = 0;
						loadTrack(index);
					}
				})
				.get(0),
			loadTrack = function(id) {
				$('.selected').removeClass('selected');
				$(playlist)
					.find('li:eq(' + id + ')')
					.addClass('selected');

				$(current_title).text(tracks[id].name);
				index = id;
				audio.src = path + tracks[id].file + extension;
				updateDownload(id, audio.src);
			},
			updateDownload = function(id, source) {
				player.on('loadedmetadata', function() {
					$('a[data-plyr="download"]').attr('href', source);
				});
			},
			playTrack = function(id) {
				loadTrack(id);
				audio.play();
			};

		extension = audio.canPlayType('audio/mpeg')
			? '.mp3'
			: audio.canPlayType('audio/ogg')
			? '.ogg'
			: '';
	} else {
		// no audio support
		var noSupport = $(audio).text();
		$(wrapper).append('<p class="no-support">' + noSupport + '</p>');
	}

	function load_playlist() {
		$.getJSON('./playlist.json', function(data) {
			$.each(data, function(key, value) {
				tracks.push(value);
				console.log(value);
			});
			track_count = tracks.length;
		})
			.fail(function() {
				console.log('error');
				alert('error, plese try again');
			})
			.always(function() {
				build_playlist();
				loadTrack(index);
			});
	}

	function build_playlist() {
		$.each(tracks, function(key, value) {
			var track_number = key + 1;

			var song = document.createElement('li'),
				song_number = document.createElement('span'),
				song_name = document.createElement('span'),
				song_duration = document.createElement('span');
			$(song).addClass('song');
			$(song_number)
				.addClass('song__num')
				.text(
					track_number.toString().length === 1
						? `0${track_number}`
						: track_number
				);
			$(song_name)
				.addClass('song__title')
				.text(value.name);
			$(song_duration)
				.addClass('song__length')
				.text(value.duration);

			$(song)
				.append(song_number)
				.append(song_name)
				.append(song_duration)
				.on('click', function() {
					var id = parseInt($(this).index());
					playTrack(id);
					// if (id !== index) {}
				});

			$(playlist).append(song);
		});
	}
});
