'use strict';

const moment = require('moment');
const logger = require('../../services/logger.service');

module.exports = [{
        name: 'ifEquals',
        helper: (a, b, options) => {
            if (a === b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    },
    {
        name: 'or',
        helper: (first, second) => {

            if(first && first !== '') {
                return first;
            } else {
                return second;
            }
        }
    },
    {
        name: 'ifIn',
        helper: (elem, list, options) => {
            if (list.indexOf(elem) > -1) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    },
    {
        name: 'unlessIn',
        helper: (elem, list, options) => {
            if (list.indexOf(elem) > -1) {
                return options.inverse(this);
            }
            return options.fn(this);
        }
    },
	{
        name: 'limit',
        helper: (arr, limit) => {
			if(arr && arr.constructor === Array) {
				return arr.slice(0, limit);
			} else {
				return;
			}
        }
    },
    {
        name: 'offset',
        helper: (arr, offset) => {
            if(arr && arr.constructor === Array) {
                return arr.slice(offset, arr.length);
            } else {
                return;
            }
        }
    },
    {
        name: 'ifMoreThan',
        helper: (a, b, options) => {
            if (parseInt(a) > b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    },
    {
        name: 'ifLongerThan',
        helper: (a, b, options) => {
            if (a.length > parseInt(b)) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    },
    {
        name: 'formatDate',
        helper: (datetime, format) => {
            let DateFormats = {
                short: "DD MMM YYYY",
                long: "dddd D MMMM YYYY",
                time: "D MMMM hh:mm:ss",
                year: "YYYY",
                comment: "D MMMM YYYY | HH:mm",
                comment_small: "D/M HH:mm"
            };

            if (moment) {
                // can use other formats like 'lll' too
                format = DateFormats[format] || format;
                return moment(datetime).locale('nl').format(format);
            } else {
                return datetime;
            }
        }
    },
    {
        name: 'containerClass',
        helper: (type) => {
            if (type === 'image-full-width' || type === 'images-duo-full-width' || type === 'documents') {
                return 'full-width';
            } else if (type === 'image-single-large' || type === 'images-trio' || type === 'image-single-left' || type === 'image-single-right') {
                return 'container-large';
            } else if (type === 'streamer') {
                return 'container-small';
            } else if (type === 'video' || type === 'paragraph' || type === 'images-duo' || type === 'tweet' || type === 'paragraph-plus' || type === 'quote' || type === 'story') {
                return 'container-small';
            }
        }
    },
    {
        name: 'imageFormat',
        helper: (index,count,orientation) => {

            if (count === 'single') {

                return 'camera';

            } else if (count === 'duo') {

                if ((orientation === 'left' && index === 0) || (orientation === 'right' && index === 1) || orientation === 'center') {

                    return 'camera';

                } else {

                    return 'square';
                }
            } else if (count === 'trio') {

                return'camera';
            }
        }
    },
    {
        name: 'excerpt',
        helper: (content) => {
            if (content !== null && content !== undefined && content !== "") {
                let strippedFromHtml = content.toString().replace(/(&nbsp;|<([^>]+)>)/ig, "");
                let sentences = strippedFromHtml.split(".");
                let newContent;
                if (sentences[0].length > 140) {
                    newContent = sentences[0] + '.';
                } else if (sentences[1] && sentences[0].length + sentences[1].length > 140) {
                    newContent = sentences[0] + '.' + sentences[1] + '.';
                } else if (sentences[1] && sentences[2] && sentences[0].length + sentences[1].length + sentences[2].length > 140) {
                    newContent = sentences[0] + '.' + sentences[1] + '.' + sentences[2] + '.';
                } else {
                    newContent = sentences[0] + '.' + sentences[1] + '.';
                }
                return newContent;
            } else {
                return '';
            }
        }
    },
    {
        name: 'longTitle',
        helper: (content) => {

            if (content !== null && content !== undefined && content.length > 80) {

                return 'longTitle';

            } else {
                return '';
            }
        }
    },
    {
        name: 'indexBump',
        helper: (index) => {

           return parseInt(index + 1);
        }
    },
    {
        name: 'trimmed',
            helper: (content) =>
        {
            if (content !== null && content !== undefined) {

                if (content.length > 180) {
                    return content.slice(0, 140) + ' <span class="orange">...</span>';
                } else {
                    return content;
                }
            } else {
                return '';
            }
        }
    },
    {
        name: 'searchExcerpt',
        helper: (content) => {
            if (content !== null && content !== undefined) {
                let strippedFromHtml = content.toString().replace(/(&nbsp;|<([^>]+)>)/ig, "");
                let newContent = strippedFromHtml.slice(0, 140);
                newContent = newContent + ' ...';
                return newContent;
            } else {
                return '';
            }
        }
    },
    {
        name: 'stripHTML',
        helper: (content) => {
            if (content !== null && content !== undefined) {
                let strippedFromHtml = content.toString().replace(/(&nbsp;|<([^>]+)>)/ig, "");
                return strippedFromHtml;
            } else {
                return '';
            }
        }
    },
    {
        name: 'stripFromHashTags',
        helper: (content) => {
            if (content !== null && content !== undefined) {
                let strippedFromHashTags = content.replace(/^(\s*#\w+\s*)+$/gm, "")
                return strippedFromHashTags;
            } else {
                return '';
            }
        }
    },
    {
        name: 'explode',
        helper: (array) => {
            if (array && array.length > 0) {
                let mappedArray = array.map(object => {
                    return object.slug;
                });
                return mappedArray.join(' ');
            } else {
                return '';
            }
        }
    },
    {
        name: 'lowercase',
        helper: (words) => {
            if (words !== undefined && words !== null && typeof words !== 'object') {
                return words.toLowerCase();
            } else {
                return '';
            }
        }
    },
    {
        name: 'sluggify',
        helper: (words) => {
            if (words !== undefined && words !== null && typeof words !== 'object') {
                return words.toLowerCase().replace(/[^a-zA-Z ]/g, "").trim().split(' ').join('-');
            } else {
                return 'fout in naam';
            }
        }
    },
    {
        name: 'anchorify',
        helper: (words) => {
            if (words !== undefined && words !== null && typeof words !== 'object') {
                return words.toString().replace(/(&nbsp;|<([^>]+)>)/ig, "").toLowerCase().replace(/[^a-zA-Z ]/g, "").trim().split(' ').slice(0, 3).join('-');
            } else {
                return 'fout-in-anchor';
            }
        }
    },
    {
        name: 'triangulizer',
        helper: (content) => {

            if (content) {
                var text = content.replace(/<(?:.|\n)*?>/gm, '');
                // if (screen === 'tablet' || screen === 'desktop' || screen === 'landscape') {
                    text = text.replace(/^(.{57}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{118}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{168}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{218}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{265}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{306}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{355}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{390}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{420}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{460}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{490}[^\s]*)/, "$1<br>");
                    text = text.replace(/^(.{520}[^\s]*)/, "$1<br>");
                // }
                return text;
            }
            else {
                return '';
            }

        }
    },
    {
        name: 'index_of',
        helper: (context, index) => {
            return context[index];
        }
    },
    {
        name: 'log',
        helper: (data) => {
            return '<script>console.log(' + data + ');</script>';
            // return '<script></script>';
        }
    },
    {
        name: 'json',
        helper: (context) => {
            return JSON.stringify(context);
        }
    },
    {
        name: 'concat',
        helper: (string1, string2) => {
            return string1 + string2;
        }
    },
    {
        name: 'slice',
        helper: (context, block) => {

            var ret = "";

            if (context !== undefined && block !== undefined) {
                let offset = parseInt(block.hash.offset) || 0,
                    limit = parseInt(block.hash.limit) || 5,
                    i = (offset < context.length) ? offset : 0,
                    j = ((limit + offset) < context.length) ? (limit + offset) : context.length;

                for (i, j; i < j; i++) {
                    ret += block.fn(context[i]);
                }
            }

            return ret;
        }
    },
    {
        name: 'translate',
        helper: (text, lan) => {

            if (lan === 'en') {

                let array = [

                    {'Reacties' : 'Comments'},
                    {'Agenda' : 'Calendar'}
                ];

                let match = array.find ( (pair) => {
                    if (Object.keys(pair)[0] === text) {
                        // Object.values(pair) werkt vanaf node 7.0
                        return pair;
                    }
                });

                if (match) {
                    return match[text];
                } else {
                    return text;
                }

            } else {
                return text;
            }
        }
    },
];
