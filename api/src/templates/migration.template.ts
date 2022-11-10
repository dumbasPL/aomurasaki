import {Migration} from 'src/migrations';

export const up: Migration = async ({context: queryInterface}) => {
  await queryInterface.sequelize.transaction(async transaction => {
  });
};

export const down: Migration = async ({context: queryInterface}) => {
  await queryInterface.sequelize.transaction(async transaction => {
  });
};
