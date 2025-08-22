// utils/database.js
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres', 'admin', 'root', {
  host: 'postgres_db',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

const Counters = sequelize.define(
  'counters',
  {
    name: { type: DataTypes.STRING, unique: true },
    description: DataTypes.TEXT,
    username: DataTypes.STRING,
    usage_count: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
  },
  {
    // Keep using the existing table to avoid breaking data now
    tableName: 'tags',
    freezeTableName: true,
  }
);

// Ensure table exists
Counters.sync();

module.exports = { sequelize, Counters };
