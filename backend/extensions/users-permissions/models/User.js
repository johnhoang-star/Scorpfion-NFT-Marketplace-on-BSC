'use strict';

/**
 * Lifecycle callbacks for the `User` model.
 */

module.exports = {
 lifecycles: {
    // Called after an entry is created
    async afterCreate(data) {
        const authorData = {
            username: data.username,
            users_permissions_user: data.id,
            social: '',
            wallet: '',
            followers: 0,
            about: ''
        };
        
        await strapi.services.author.create(authorData);
    },
 }
};