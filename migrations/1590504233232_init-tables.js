/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('reminder_user', {
    id: 'id',
    user_name: { type: 'varchar(64)', notNull: true, unique: true },
    email: { type: 'varchar(128)', notNull: true, unique: true },
    phone: { type: ' char(10)', notNull: true, unique: true },
  });

  pgm.createTable('reminder_category', {
    id: 'id',
    category_name: { type: 'varchar(64)', notNull: true, unique: true },
    color: { type: 'varchar(32)', notNull: true },
  });

  pgm.createTable('reminder', {
    id: 'id',
    reminder_name: { type: 'varchar(64)', notNull: true },
    description: 'varchar(1024)',
    is_done: { type: 'boolean', default: 'FALSE' },
    due_timestamp_utc: { type: 'timestamp', notNull: true },
    category: { type: 'integer', references: { schema: 'public', name: 'reminder_category' }, onDelete: 'set null' },
    reminder_user: { type: 'integer', references: { schema: 'public', name: 'reminder_user' }, onDelete: 'set null' }
  });

  pgm.createTable('reminder_recurrence', {
    id: 'id',
    frequency: { type: 'varchar(10)', notNull: true },
    until_utc: { type: 'timestamp' },
    reminder: { type: 'integer', references: { schema: 'public', name: 'reminder' }, onDelete: 'cascade', unique: true }
  });
};

exports.down = pgm => {};
