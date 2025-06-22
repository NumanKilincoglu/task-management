const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'task_manager',
        },
        migrations: {
            directory: './src/database/knex/migrations',
            tableName: 'knex_migrations',
        },
    },
    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'task_manager',
        },
        migrations: {
            directory: './src/database/knex/migrations',
            tableName: 'knex_migrations',
        },
    },
};