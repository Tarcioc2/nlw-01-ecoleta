import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('collectPoints_items', table =>{
        table.increments('id').primary();
        table.integer('collectPoint_id')
            .notNullable()
            .references('id')
            .inTable('collectPoints');
        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items');

        
    })
}
export async function down(knex: Knex){
    return knex.schema.dropTable('collectPoints_items');
}