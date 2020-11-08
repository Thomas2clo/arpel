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
			path = 'assets/sounds/',
			extension = '',
			tracks = [
				{
					name: 'Dans ma Folie',
					duration: '2:55',
					file: 'dans-ma-folie'
				},
				{
					name: 'Hasta la Muerte',
					duration: '4:49',
					file: 'hasta-la-muerte'
				},
				{
					name: 'Medellín',
					duration: '3:52',
					file: 'medellin'
				}
			],
			build_playlist = $.each(tracks, function(key, value) {
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
			}),
			track_count = tracks.length,
			audio = $('#player')
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
			// btnPrev = $('#btn__prev').on('click', function() {
			// 	if (index - 1 > -1) {
			// 		index--;
			// 		loadTrack(index);
			// 		if (playing) {
			// 			audio.play();
			// 		}
			// 	} else {
			// 		audio.pause();
			// 		index = 0;
			// 		loadTrack(index);
			// 	}
			// }),
			// btnNext = $('#btn__next').on('click', function() {
			// 	if (index + 1 < track_count) {
			// 		index++;
			// 		loadTrack(index);
			// 		if (playing) {
			// 			audio.play();
			// 		}
			// 	} else {
			// 		audio.pause();
			// 		index = 0;
			// 		loadTrack(index);
			// 	}
			// }),
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
		loadTrack(index);
	} else {
		// no audio support
		var noSupport = $(audio).text();
		$(wrapper).append('<p class="no-support">' + noSupport + '</p>');
	}
});
