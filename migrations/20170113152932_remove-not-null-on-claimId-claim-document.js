exports.up = function (knex, Promise) {
  return knex.raw('ALTER TABLE ExtSchema.ClaimDocument ALTER COLUMN ClaimId INT NULL')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}

exports.down = function (knex, Promise) {
  return knex.raw('ALTER TABLE ExtSchema.ClaimDocument ALTER COLUMN ClaimId INT NOT NULL')
    .catch(function (error) {
      console.log(error)
      throw error
    })
}
