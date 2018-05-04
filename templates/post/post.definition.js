const PagePersistence = require('../../../persistence/page.persistence');
const PathService = require('../../../services/path.service');
const logger = require('../../../services/logger.service');
const BooleanService = require('../../services/boolean.service');

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
            resolve(data);
        })
    },

    /**
     * Gets the data for the template
     * @param data
     */
    getTemplateData: (data, correlationId) => {
        return new Promise((resolve, reject) => {

            let pagePersistence = new PagePersistence();

            let postOptions = {
                query : {
                    type:"post",
                    slug: { $ne : data.slug }
                },
                "sort": {"date":-1},
                "limit":3
            };
            let findPosts = pagePersistence.find(postOptions);

            Promise.all([findPosts]).then(values => {

                data.related_posts = values[0];
                logger.info('Get template data', correlationId)
                resolve(data)

            });
        })
    },

    /**
     * Path generator function for the url/path of the page
     * function creates the path/url of the page
     * @param data
     */
    getPath: (data, correlationId) => { // path generator for path/url of the page
        return new Promise((resolve, reject) => {
            const date = moment(data.date, 'YYYY').format('YYYY');
            const pathService = new PathService();
            const path = 'nieuws/' + date + '/' + pathService.cleanString(data.slug);
            // logger.info('Generated post path: ' + path, correlationId);
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
            // logger.info('Get template dependencies for ' + data.type, correlationId);
            resolve([
                {template: 'homepage', data: null},
                {template: 'blog', data: null}
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
                title: data.title,
                content: data.content,
                excerpt: data.excerpt,
                date: data.date,
                modified: data.modified,
                categories: data.categories,
                static: data.static,
                catIds: (data.categories) ? data.categories.map( c => { return c.id }) : '',
                catSlugs: (data.categories) ? data.categories.map( c => { return c.slug }) : '',
                tags: data.tags,
                author: data.author,
                comments: data.comments,
                comment_count: parseInt(data.comment_count) || 0,
                comment_status: data.comment_status,
                sections: data.sections,
                main_image: data.main_image,
                korte_titel: data.korte_titel,
                chapeau: data.chapeau,
                cover: data.cover,
                covertext: data.covertext,
                co_author: data.co_auteur

            };
            // logger.info('Mapped post fields', correlationId);
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
            // logger.info('Post-render function: ' + path, correlationId);
            resolve(html);
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
