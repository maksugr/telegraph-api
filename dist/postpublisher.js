'use strict';

var system = require('system');
var args = system.args;

var TELEGRAPH_URL = 'http://telegra.ph/';
var PHANTOM_TIMEOUT = 3000;

/*
 * This function wraps WebPage.evaluate, and offers the possibility to pass
 * parameters into the webpage function. The PhantomJS issue is here:
 *
 * http://code.google.com/p/phantomjs/issues/detail?id=132
 *
 * This is from comment #43.
 */
function evaluate(page, func) {
	var args = [].slice.call(arguments, 2);
	var fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";

	return page.evaluate(fn);
}

/**
 * Get header from args
 *
 * @param {Object} args Args
 *
 * @returns {String} Header
 */
var getHeader = function getHeader(args) {
	var header = args[1];
	var headerContent = header.substring(header.indexOf(':') + 1);

	return headerContent;
};

/**
 * Get author from args
 *
 * @param {Object} args Args
 *
 * @returns {String} Author
 */
var getAuthor = function getAuthor(args) {
	var author = args[2];
	var authorContent = author.substring(author.indexOf(':') + 1);

	return authorContent;
};

/**
 * Get paragraph from args
 *
 * @param {Object} args Args
 *
 * @returns {Strung[]} Paragraphs
 */
var getParagraphs = function getParagraphs(args) {
	var paragraphs = args[3];
	var paragraphsContent = paragraphs.substring(paragraphs.indexOf(':') + 1);
	var paragraphsContentSplited = paragraphsContent.split('|');

	return paragraphsContentSplited;
};

var header = getHeader(args);
var author = getAuthor(args);
var paragraphs = getParagraphs(args);

/**
 * Publish Post
 *
 * @param {Object} page Page object
 */
var publishPost = function publishPost(page) {
	var content = { header: header, author: author, paragraphs: paragraphs };

	evaluate(page, function (content) {
		$('h1').text(content.header);

		content.author && $('address').text(content.author);

		if (content.paragraphs.length > 0) {
			$('p').text(content.paragraphs[0]);
			content.paragraphs.forEach(function (paragraph, i) {
				if (i > 0) {
					$('<p></p>').text(paragraph).appendTo('.ql-editor');
				}
			});
		}

		$('#publish_button').click();

		console.log('status: published');
	}, content);
};

/**
 * Get url to the Post
 *
 * @param {Object} page Page object
 *
 * @returns {String} Url to Post
 */
var getUrl = function getUrl(page) {
	var detectorUrl = '' + TELEGRAPH_URL + header;
	var urlDecoded = decodeURI(page.url);

	if (urlDecoded.indexOf(detectorUrl) >= 0) {
		console.log('url:' + page.url);
	}
};

var page = require('webpage').create();

page.onConsoleMessage = function (msg) {
	var PUBLISHED = 'status: published';

	if (msg === PUBLISHED) {
		setTimeout(function () {
			return phantom.exit();
		}, PHANTOM_TIMEOUT);
	}
};

page.onResourceReceived = function () {
	return getUrl(page);
};

page.open(TELEGRAPH_URL, function (status) {
	if (status !== 'success') {
		console.log('Unable to access network');
		phantom.exit();
	} else {
		publishPost(page);
	}
});