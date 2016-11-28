'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var spawn = require('child_process').spawn;

var TelegraphPost = function () {
	/**
  * Params for the TelegraphPost
  *
  * @param {Object} [params={}] Params
  * @param {String} [params.header=''] Header
  * @param {String} [params.author=''] Author
  * @param {String[]} [params.paragraphs=[]] Paragraphs
  */
	function TelegraphPost() {
		var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, TelegraphPost);

		var _params$header = params.header,
		    header = _params$header === undefined ? '' : _params$header,
		    _params$author = params.author,
		    author = _params$author === undefined ? '' : _params$author,
		    _params$paragraphs = params.paragraphs,
		    paragraphs = _params$paragraphs === undefined ? [] : _params$paragraphs;

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


	_createClass(TelegraphPost, [{
		key: 'getHeader',
		value: function getHeader() {
			return this._header;
		}

		/**
   * Set header to the TelegraphPost
   *
   * @param {String} header Header
   *
   * @public
   */

	}, {
		key: 'setHeader',
		value: function setHeader(header) {
			this._header = header;
		}

		/**
   * Get author of the TelegraphPost
   *
   * @public
   *
   * @returns {String} Author
   */

	}, {
		key: 'getAuthor',
		value: function getAuthor() {
			return this._author;
		}

		/**
   * Set author to the TelegraphPost
   *
   * @param {String} author Author
   *
   * @public
   */

	}, {
		key: 'setAuthor',
		value: function setAuthor(author) {
			this._author = author;
		}

		/**
   * Get paragraphs of the TelegraphPost
   *
   * @public
   *
   * @returns {String[]} Paragraphs
   */

	}, {
		key: 'getParagraphs',
		value: function getParagraphs() {
			return this._paragraphs;
		}

		/**
   * Set paragraphs to the TelegraphPost
   *
   * @param {String[]} paragraphs Paragraphs
   *
   * @public
   */

	}, {
		key: 'setParagraphs',
		value: function setParagraphs(paragraphs) {
			this._paragraphs = paragraphs;
		}

		/**
   * Set paragraph to the TelegraphPost
   *
   * @param {String} paragraph Paragraph
   *
   * @public
   */

	}, {
		key: 'setParagraph',
		value: function setParagraph(paragraph) {
			this._paragraphs.push(paragraph);
		}

		/**
   * Remove last paragraph of the TelegraphPost
   *
   * @public
   */

	}, {
		key: 'removeLastParagraph',
		value: function removeLastParagraph() {
			this._paragraphs.pop();
		}

		/**
   * Empty header of the TelegraphPost
   *
   * @public
   */

	}, {
		key: 'emptyHeader',
		value: function emptyHeader() {
			this._header = '';
		}

		/**
   * Empty author of the TelegraphPost
   *
   * @public
   */

	}, {
		key: 'emptyAuthor',
		value: function emptyAuthor() {
			this._author = '';
		}

		/**
   * Empty paragraphs of the TelegraphPost
   *
   * @public
   */

	}, {
		key: 'emptyParagraphs',
		value: function emptyParagraphs() {
			this._paragraphs = [];
		}

		/**
   * Publish Post
   *
   * @param {Function} callback Callback that takes error and url as arguments
   *
   * @public
   */

	}, {
		key: 'publishPost',
		value: function publishPost(callback) {
			var _this = this;

			if (!this._header) {
				callback('Try set header of the Post');
			}

			this._url = '';

			var phantomJs = path.join(__dirname, '../node_modules/phantomjs-prebuilt/bin/phantomjs');
			var postPublisher = path.join(__dirname, 'postpublisher.js');

			var header = 'header#:#' + this._header;
			var author = 'author#:#' + this._author;
			var paragraphs = 'paragraphs#:#' + this._paragraphs.join('#|#');

			var phantomjs = spawn(phantomJs, [postPublisher, header, author, paragraphs]);

			phantomjs.stdout.on('data', function (data) {
				var dataString = data.toString('utf-8');

				if (dataString.indexOf('url:') >= 0 && !_this._url) {
					_this._url = dataString.split('url:')[1];
					callback(null, _this._url);
				}
			});

			phantomjs.stderr.on('data', function (data) {
				return callback(data);
			});
			phantomjs.on('close', function (code) {
				return console.log('phantomjs process exited with code ' + code);
			});
		}
	}]);

	return TelegraphPost;
}();

module.exports = TelegraphPost;