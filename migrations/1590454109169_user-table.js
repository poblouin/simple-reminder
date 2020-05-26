/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user', {
    id: 'id',
    name: { type: 'varchar(64)', notNull: true, unique: true },
    email: { type: 'varchar(128)', notNull: true, primaryKey: true },
    phone: { type: ' char(10)', notNull: true, unique: true },
  });
};
