const path = require('path');
const spawn = require('child_process').spawn;

class TelegraphPost {
	/**
	 * Params for the TelegraphPost
	 *
	 * @param {Object} [params={}] Params
	 * @param {String} [params.header=''] Header
	 * @param {String} [params.author=''] Author
	 * @param {String[]} [params.paragraphs=[]] Paragraphs
	 */
	constructor(params={}) {
		const {
			header = '',
			author = '',
			paragraphs = []
		} = params;

		/**
		 * Header
		 *
		 * @type {String}
		 */
		this._header = header;

		/**
		 * Author
		 *
		 * @type {String}
		 */
		this._author = author;

		/**
		 * Paragraphs
		 *
		 * @type {String[]}
		 */
		this._paragraphs = paragraphs;
	}

	/**
	 * Get header of the TelegraphPost
	 *
	 * @public
	 *
	 * @returns {String} Header
	 */
	getHeader() {
		return this._header;
	}

	/**
	 * Set header to the TelegraphPost
	 *
	 * @param {String} header Header
	 *
	 * @public
	 */
	setHeader(header) {
		this._header = header;
	}

	/**
	 * Get author of the TelegraphPost
	 *
	 * @public
	 *
	 * @returns {String} Author
	 */
	getAuthor() {
		return this._author;
	}

	/**
	 * Set author to the TelegraphPost
	 *
	 * @param {String} author Author
	 *
	 * @public
	 */
	setAuthor(author) {
		this._author = author;
	}

	/**
	 * Get paragraphs of the TelegraphPost
	 *
	 * @public
	 *
	 * @returns {String[]} Paragraphs
	 */
	getParagraphs() {
		return this._paragraphs;
	}

	/**
	 * Set paragraphs to the TelegraphPost
	 *
	 * @param {String[]} paragraphs Paragraphs
	 *
	 * @public
	 */
	setParagraphs(paragraphs) {
		this._paragraphs = paragraphs;
	}

	/**
	 * Set paragraph to the TelegraphPost
	 *
	 * @param {String} paragraph Paragraph
	 *
	 * @public
	 */
	setParagraph(paragraph) {
		this._paragraphs.push(paragraph)
	}

	/**
	 * Remove last paragraph of the TelegraphPost
	 *
	 * @public
	 */
	removeLastParagraph() {
		this._paragraphs.pop();
	}

	/**
	 * Empty header of the TelegraphPost
	 *
	 * @public
	 */
	emptyHeader() {
		this._header = '';
	}

	/**
	 * Empty author of the TelegraphPost
	 *
	 * @public
	 */
	emptyAuthor() {
		this._author = '';
	}

	/**
	 * Empty paragraphs of the TelegraphPost
	 *
	 * @public
	 */
	emptyParagraphs() {
		this._paragraphs = [];
	}

	/**
	 * Publish Post
	 *
	 * @param {Function} callback Callback that takes error and url as arguments
	 *
	 * @public
	 */
	publishPost(callback) {
		if (!this._header) {
			callback('Try set header of the Post');
		}

		this._url = '';

		const phantomJs = path.join(__dirname, '../node_modules/phantomjs-prebuilt/bin/phantomjs');
		const postPublisher = path.join(__dirname, 'postpublisher.js');

		const header = `header:${this._header}`;
		const author = `author:${this._author}`;
		const paragraphs = `paragraphs:${this._paragraphs.join('|')}`;

		const phantomjs = spawn(phantomJs, [postPublisher, header, author, paragraphs]);

		phantomjs.stdout.on('data', data => {
			const dataString = data.toString('utf-8');

			if (dataString.indexOf('url:') >= 0 && !this._url) {
				this._url = dataString.split('url:')[1];
				callback(null, this._url);
			}
		});

		phantomjs.stderr.on('data', data => callback(data));
		phantomjs.on('close', code => console.log(`phantomjs process exited with code ${code}`));
	}
}

module.exports = TelegraphPost;