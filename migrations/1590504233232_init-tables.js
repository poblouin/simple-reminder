/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('user', {
    id: 'id',
    name: { type: 'varchar(64)', notNull: true, unique: true },
    email: { type: 'varchar(128)', notNull: true, unique: true },
    phone: { type: ' char(10)', notNull: true, unique: true },
  });

  pgm.createTable('reminder_category', {
    id: 'id',
    name: { type: 'varchar(64)', notNull: true, unique: true },
    color: { type: 'varchar(32)', notNull: true },
  });

  pgm.createTable('reminder', {
    id: 'id',
    name: { type: 'varchar(64)', notNull: true, unique: true },
    description: 'varchar(1024)',
    is_done: { type: 'boolean', default: 'FALSE' },
    due_timestamp_utc: { type: 'timestamp', notNull: true },
    category: { type: 'integer', references: { schema: 'public', name: 'reminder_category' } },
    user: { type: 'integer', references: { schema: 'public', name: 'user' } },
  });
};

exports.down = pgm => {};
