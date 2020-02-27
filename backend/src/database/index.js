import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import Checkin from '../app/models/Checkin';
import HelperOlder from '../app/models/HelperOrder';

import databaseConfig from '../config/database';

const models = [User, Recipient, Plan, Enrollment, Checkin, HelperOlder];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
