exports.up = function (knex, Promise) {
  return knex.raw('ALTER TABLE ExtSchema.Task ALTER COLUMN AdditionalData nvarchar(1200)')
}

exports.down = function (knex, Promise) {
  return knex.raw('ALTER TABLE ExtSchema.Task ALTER COLUMN AdditionalData nvarchar(MAX)')
}

