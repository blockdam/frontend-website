const PagePersistence = require('../../../persistence/page.persistence');
const PathService = require('../../../services/path.service');
const logger = require('../../../services/logger.service');
const BooleanService = require('../../services/boolean.service');
const TranslationService = require('../../services/translation.service');



const moment = require('moment');

module.exports = {

    searchSnippetTemplate: 'search-snippet', // filename of the handlebars template,

    /**
     * Gets the data for the search snippet
     * @param data
     */
    getSearchSnippetData: (data, correlationId) => {
        return new Promise((resolve, reject) => {
            // logger.info('Get search snippet data', correlationId);

            data.calendar.startDate = data.calendar.startDate['date'];
            data.calendar.unix_startDate = moment(data.calendar.startDate).unix();
            // data.calendar.endDate = data.calendar.endDate['date'];
            // data.calendar.unix_endDate = moment(data.calendar.endDate['date']).unix();
            data.calendar.year = moment(data.calendar.startDate).format('YYYY');
            data.calendar.month = moment(data.calendar.startDate).format('MMMM');
            data.parentID = null;
            resolve(data);
        })
    },

    /**
     * Gets the data for the template
     * @param data
     */
    getTemplateData: (data, correlationId) => {
        return new Promise((resolve, reject) => {

            // let pagePersistence = new PagePersistence();

            resolve(data);
        })
    },

    /**
     * Path generator function for the url/path of the page
     * function creates the path/url of the page
     * @param data
     */
    getPath: (data, correlationId) => { // path generator for path/url of the page
        return new Promise((resolve, reject) => {

            const year = moment(data.sessions[0].date.date, 'YYYY').format('YYYY');
            const pathService = new PathService();
            const translationService = new TranslationService();
            let path = translationService.path(data.language.code,'calendar/' + year + '/' + pathService.cleanString(data.slug));

            resolve(path);
        })
    },

    /**
     * Determine page dependencies
     * Return object array of templates that also need to be rendered
     * Object in array contain template property with the name of the template and data property to pass data
     * to the template that needs to be rendered.
     * @param data
     * @param correlationId
     */
    getDependencies: (data, correlationId) => {
        return new Promise((resolve, reject) => {

            resolve([
                {template: 'homepage', data: null}
            ]);
        })
    },

    /**
     * map the data of the incoming object to the object format that will be saved in mongodb
     * @param data
     */
    getMapping: (data, correlationId) => {
        return new Promise((resolve, reject) => {

			const booleanService =  new BooleanService();
            const page = {
                _id: data.id,
                objectID: data.id, // id for algolia search
                type: data.type,
                slug: data.slug,
                url: data.url, // replace wordpress generated url for page
                status: data.status,
                language: data.language,
                title: data.title.rendered || data.title,
                content: data.content.rendered || data.content,
                excerpt: data.excerpt,
                date: data.date,
                modified: data.modified,
                author: data.author,
                main_image: data.main_image,
                location: data.location,
                sections: data.sections,
                sessions: data.sessions,
                interaction: data.interaction,
                taxonomies: data.taxonomies,
                eventIds: (data.taxonomies && data.taxonomies.events) ? data.taxonomies.events.map( c => { return c.id }) : [],
                eventSlugs: (data.taxonomies && data.taxonomies.events) ? data.taxonomies.events.map( c => { return c.slug }) : [],
                contact : data.contact,
                eventDate: data.sessions[0].date.date,
                calendar: data.calendar

            };

            resolve(page);
        })
    },

    /**
     * Executed before rendering template
     * @param path              path of the template that will be rendered
     * @param data              template data
     * @param correlationId
     */
    preRender: (path, data, correlationId) => {
        return new Promise((resolve, reject) => {
            // logger.info('Pre-render function: ' + path, correlationId);
            resolve(data);
        })
    },

    /**
     * Executed after rendering template
     * @param html              html of the rendered template
     * @param path              path of the rendered template
     * @param data              template data
     * @param correlationId
     */
    postRender: (html, path, data, correlationId) => {
        return new Promise((resolve, reject) => {

            resolve(data);
        })
    },

    preDelete: (data, correlationId) => { return new Promise((resolve, reject) => {
        // logger.info('Pre-delete function', correlationId);
        resolve(data);
    }) },

    postDelete: (data, correlationId) => { return new Promise((resolve, reject) => {
        // logger.info('Post-delete function', correlationId);
        resolve(data);
    }) }

    // getValidationSchema: function(data, callback) {}, //
}