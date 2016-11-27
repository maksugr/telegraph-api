const system = require('system');
const args = system.args;

const TELEGRAPH_URL = 'http://telegra.ph/';
const PHANTOM_TIMEOUT = 3000;

/*
 * This function wraps WebPage.evaluate, and offers the possibility to pass
 * parameters into the webpage function. The PhantomJS issue is here:
 *
 * http://code.google.com/p/phantomjs/issues/detail?id=132
 *
 * This is from comment #43.
 */
function evaluate(page, func) {
	const args = [].slice.call(arguments, 2);
	const fn = "function() { return (" + func.toString() + ").apply(this, " + JSON.stringify(args) + ");}";

	return page.evaluate(fn);
}

/**
 * Get header from args
 *
 * @param {Object} args Args
 *
 * @returns {String} Header
 */
const getHeader = args => {
	const header = args[1];
	const headerContent = header.substring(header.indexOf(':') + 1);

	return headerContent;
}

/**
 * Get author from args
 *
 * @param {Object} args Args
 *
 * @returns {String} Author
 */
const getAuthor = args => {
	const author = args[2];
	const authorContent = author.substring(author.indexOf(':') + 1);

	return authorContent;
}

/**
 * Get paragraph from args
 *
 * @param {Object} args Args
 *
 * @returns {Strung[]} Paragraphs
 */
const getParagraphs = args => {
	const paragraphs = args[3];
	const paragraphsContent = paragraphs.substring(paragraphs.indexOf(':') + 1);
	const paragraphsContentSplited = paragraphsContent.split('|');

	return paragraphsContentSplited;
}

const header = getHeader(args);
const author = getAuthor(args);
const paragraphs = getParagraphs(args);

/**
 * Publish Post
 *
 * @param {Object} page Page object
 */
const publishPost = page => {
	const content = {header, author, paragraphs};

	evaluate(page, content => {
		$('h1').text(content.header);

		content.author && $('address').text(content.author);

		if (content.paragraphs.length > 0) {
			$('p').text(content.paragraphs[0]);
			content.paragraphs.forEach((paragraph, i) => {
				if (i > 0) {
					$('<p></p>').text(paragraph).appendTo('.ql-editor');
				}
			});
		}

		$('#publish_button').click();

		console.log('status: published');
	}, content);
}

/**
 * Get url to the Post
 *
 * @param {Object} page Page object
 *
 * @returns {String} Url to Post
 */
const getUrl = page => {
	const detectorUrl = `${TELEGRAPH_URL}${header}`;
	const urlDecoded = decodeURI(page.url);

	if (urlDecoded.indexOf(detectorUrl) >= 0) {
		console.log(`url:${page.url}`);
	}
}

const page = require('webpage').create();

page.onConsoleMessage = msg => {
	const PUBLISHED = 'status: published';

	if (msg === PUBLISHED) {
		setTimeout(() => phantom.exit(), PHANTOM_TIMEOUT);
	}
};

page.onResourceReceived = () => getUrl(page);

page.open(TELEGRAPH_URL, status => {
	if (status !== 'success') {
		console.log('Unable to access network');
		phantom.exit();
	} else {
		publishPost(page);
	}
});