/*
* Global Variables
* Global Variables
*/
var vid_array = new Array();
var old_now_playing = 1;
var current_video = 1;
var current_page = 1;
	

 
/*
* Set up the initial state of the page
*/
function init() {
	// Load the video data and populate the array of all video IDs
	$.getJSON('vids.json', function(data) {
		for (var i=0;i<data.vids.length;i++) {
			if(i%2==0) {
				vid_array[(i/2)+1] = data.vids[i];
			}
		}
		switchToVideo(vid_array.length-1);
		switchToPage(1);
		changeNowPlaying(vid_array.length-1);
		populatePages();
		$('#page-1').addClass('current-page');				
	}); 
}


/* 
* Add a list item to the playlist which includes the thumbnail, video number,
* and a link to swicth the currently playing video to this video
*/
function addVidButton(index) {
	result = '<li id="video-';
	result += index;
	result += '" class="playlist-item">'
	result += '<a href="javascript:switchToVideo(';
	result += index;
	result += ')" class="playlist-link" >';
	result += '<img src="http://img.youtube.com/vi/';
	result += vid_array[index];
	result += '/0.jpg" /><span class="vid-button">#';
	result += index;
	result+='</span></a></li>';
	$('#playlist').append(result);	
} 

/*
* Replace the currently playing video with another video
*/
function  switchToVideo(index) {
	newmarkup = '<object width="425" height="350" id="playing-video-object"><param name="movie" value="http://www.youtube.com/v/';
	newmarkup += vid_array[index];
	newmarkup += '&autoplay=1&loop=1" >	</param>	<param name="wmode" value="transparent">	</param>	<embed src="http://www.youtube.com/v/';
	newmarkup += vid_array[index];
	newmarkup += '&autoplay=1&loop=1" 	type="application/x-shockwave-flash" wmode="transparent" width="425" height="350" ></embed></object>'
	$('#playing-video-object').replaceWith(newmarkup);
	changeVideoNumber(index);
	switchToPage(determinePageNumber(index));
	changeNowPlaying(index);
	current_video = index;
}

/*
* Switch the "now playing" banner to the thumbnail of the correct video button.
*/
function changeNowPlaying(index) {
	$('#now-playing').remove();
	$('#video-' + index).append('<span id="now-playing">now playing!</span></a></li>');
}

/*
* Populate the playlist with the video buttons of the current page, and then 
* populate the page selectors correctly.
*/
function switchToPage(number) {
	$('#playlist').empty();
	high_index = vid_array.length - (number * 8) + 7;
	var i = 0;
	for(i=high_index;i>high_index-8;i--) {
		if(i>0) {
			addVidButton(i);
		}
	}
	$('.current-page').removeClass('current-page');
	current_page = number;	
	populatePages();
	$('#page-' + number).addClass('current-page');
}

/*
* Change the video number in the header to the currently playing vid.
*/
function changeVideoNumber(number) {
	$('#main-vid-id-number').empty();
	$('#main-vid-id-number').append(number);
}

/*
* Figure out on which page a given video button resides. 
*/
function determinePageNumber(vid_number) {
	return Math.floor(((vid_array.length - vid_number) - 1) / 8) + 1;
	
}

/*
* Switch to a random video.
*/
function pieWalk(WonderGums) {
	random_index = Math.floor(Math.random() * (vid_array.length-1)) + 1;
	switchToVideo(random_index);
}

/*
* Switch to the video to the left in the playlist from the current one.
*/
function shiftLeft() {
	left_video = current_video + 1;
	if (left_video >= vid_array.length) {
		left_video = 1;
	}
	switchToVideo(left_video);
}

/*
* Switch to the video to the right in the playlist from the current one.
*/

function shiftRight() {
	right_video = current_video - 1;
	if(right_video < 1) {
		right_video = vid_array.length-1;
	}
	switchToVideo(right_video);
}

/*
* In order to keep the number of buttons to switch playlist pages reasonable, once the number of pages
* gets too large, only show the first few, last few, and a neighborhood around the current page.
*/
function populatePages() {
	$('#playlist-pages').empty();
	$('#playlist-pages').append('<li id="playlist-pages-label">Page: </li>')
	num_pages = Math.floor((vid_array.length-1)/8) + 1;
	if(num_pages <= 9) {
		var i = 1;
		for (i = 1; i<=num_pages; i++) {
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + i +')">' + i + '</a></li>');
		}
	}
	else {
		
		if (current_page < 4) {
			var i = 1;
			for (i = 1; i<=4; i++) {
				$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + i +')" id="page-' + i + '">' + i + '</a></li>');
			}
			$('#playlist-pages').append('<li>...</li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (num_pages - 1) +')" id="page-' + (num_pages - 1) + '">' + (num_pages-1) + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + num_pages +')" id="page-' + num_pages + '">' + num_pages + '</a></li>');
		}
		else if (num_pages - current_page < 4) {
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + 1 +')" id="page-' + 1 + '">' + 1 + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + 2 +')" id="page-' + 2 + '">' + 2 + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + 3 +')" id="page-' + 3 + '">' + 3 + '</a></li>');
			$('#playlist-pages').append('<li>...</li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (num_pages-4) +')" id="page-' + (num_pages-4) + '">' + (num_pages-4) + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (num_pages-3) +')" id="page-' + (num_pages-3) + '">' + (num_pages-3) + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (num_pages-2) +')" id="page-' + (num_pages-2) + '">' + (num_pages-2) + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (num_pages-1) +')" id="page-' + (num_pages-1) + '">' + (num_pages-1) + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (num_pages) +')" id="page-' + (num_pages) + '">' + (num_pages) + '</a></li>');						
		}
		else {
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + 1 +')" id="page-' + 1 + '">' + 1 + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + 2 +')" id="page-' + 2 + '">' + 2 + '</a></li>');
			$('#playlist-pages').append('<li>...</li>');
		
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (current_page-1) +')" id="page-' + (current_page-1) + '">' + (current_page-1) + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (current_page) +')" id="page-' + (current_page) + '">' + (current_page) + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (current_page+1) +')" id="page-' + (current_page+1) + '">' + (current_page+1) + '</a></li>');
			
			$('#playlist-pages').append('<li>...</li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (num_pages-2) +')" id="page-' + (num_pages-2) + '">' + (num_pages-2) + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + (num_pages-1) +')" id="page-' + (num_pages-1) + '">' + (num_pages-1) + '</a></li>');
			$('#playlist-pages').append('<li><a href="javascript:switchToPage(' + num_pages +')" id="page-' + num_pages + '">' + num_pages + '</a></li>');		
		}
	}

}

$(document).ready(function() {
	init();
}); 

/* 
* Allow the left and right arrow keys to navigate the playlist. 
*/
$(document).keydown(function(e){
    if (e.keyCode == 37) { 
       shiftLeft();
       return false;
    }
	if (e.keyCode == 39) { 
       shiftRight();
       return false;
    }
});

