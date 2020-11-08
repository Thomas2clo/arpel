import $ from 'jquery';
import Plyr from 'plyr';

import './styles/main.scss';
import './styles/plyr.css';

$(function() {
	'use strict';

	var b = document.documentElement;
	b.setAttribute('data-useragent', navigator.userAgent);
	b.setAttribute('data-platform', navigator.platform);

	// App ------------------------------
	var container = document.createElement('div');
	$(container).addClass('container');

	var header = document.createElement('div');
	$(header).addClass('container__header');
	$(container).append(header);

	var h1 = document.createElement('h1');
	$(h1)
		.addClass('container__header__h1')
		.text('arpel');
	$(header).append(h1);

	var wrapper = document.createElement('div');
	$(wrapper).addClass('container__wrapper');
	$(container).append(wrapper);

	// var status = document.createElement('div');
	// $(status).addClass('container__wrapper__status');
	// $(wrapper).append(status);

	// $(status).append(
	// 	'<div id="current"></div>\
	//   <div id="status">Paused</div>'
	// );

	var audio = document.createElement('div');
	$(audio).addClass('container__wrapper__audio');
	$(wrapper).append(audio);

	var player = document.createElement('div');
	$(player).addClass('container__wrapper__audio__player');
	$(audio).append(player);

	$(player).append(
		'<audio id="player" preload controls>Your browser does not support HTML5 Audio</audio>'
	);

	// var tracks = document.createElement('div');
	// $(tracks).addClass('container__wrapper__audio__tracks');
	// $(audio).append(tracks);

	// $(tracks).append(
	// 	'<button id="btn__prev">Prev</button><button id="btn__next">Next</button>'
	// );

	var playlist = document.createElement('div');
	$(playlist).addClass('container__wrapper__playlist');
	$(wrapper).append(playlist);

	var list = document.createElement('ul');
	$(list).attr('id', 'list');
	$(playlist).append(list);

	var app = $('#root');
	app.append(container);

	// Player ------------------------------
	var supportsAudio = !!document.createElement('audio').canPlayType;
	if (supportsAudio) {
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
			mediaPath = 'assets/',
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
			buildPlaylist = $.each(tracks, function(key, value) {
				var trackNumber = key + 1,
					trackName = value.name,
					trackDuration = value.duration;
				if (trackNumber.toString().length === 1) {
					trackNumber = '0' + trackNumber;
				}
				$('#list').append(`<li class="song"> \
          <div class="song__num">${trackNumber}</div> \
          <div class="song__title">${trackName}</div> \
          <div class="song__length">${trackDuration}</div> \
        </li>`);
			}),
			trackCount = tracks.length,
			// status = $('#status'),
			// title = $('#current'),
			audio = $('#player')
				.on('play', function() {
					playing = true;
					// status.text('Now Playing...');
				})
				.on('pause', function() {
					playing = false;
					// status.text('Paused');
				})
				.on('ended', function() {
					// status.text('Paused');
					if (index + 1 < trackCount) {
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
			// 	if (index + 1 < trackCount) {
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
			li = $('#list li').on('click', function() {
				var id = parseInt($(this).index());
				playTrack(id);
				// if (id !== index) {}
			}),
			loadTrack = function(id) {
				$('.selected').removeClass('selected');
				$('#list li:eq(' + id + ')').addClass('selected');
				// title.text(tracks[id].name);
				index = id;
				audio.src = mediaPath + tracks[id].file + extension;
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
		var noSupport = $('#audio').text();
		$(wrapper).append('<p class="no-support">' + noSupport + '</p>');
	}
});
