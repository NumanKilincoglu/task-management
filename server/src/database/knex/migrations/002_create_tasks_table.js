exports.up = function (knex) {
    return knex.schema.createTable('tasks', function (table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.string('title', 255).notNullable();
        table.text('description').nullable();
        table.enum('priority', ['low', 'medium', 'high']).notNullable();
        table.date('end_date').notNullable();
        table.string('file_path', 255).nullable();
        table.string('file_name', 255).nullable();
        table.string('attachment_type', 255).nullable();
        table.boolean('is_completed').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tasks');
};