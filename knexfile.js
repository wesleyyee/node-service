module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './example.db',
    },
    pool: {
      afterCreate: (conn, cb) => {
        conn.run('PRAGMA foreign_keys = ON', cb);
      },
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'postgres',
      database: 'postgresdb',
      user: 'postgresadmin',
      password: 'admin123',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
