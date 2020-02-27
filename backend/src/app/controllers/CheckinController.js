import * as Yup from 'yup';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Student from '../models/Student';
import Checkin from '../models/Checkin';

class CheckinController {
  async show(req, res) {
    /**
     * Validation params
     */
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation is Fails' });
    }
    const { student_id } = req.params;
    /**
     * Check student exist
     */
    const student = Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id,
      },
      attributes: ['student_id', 'created_at'],
      order: [['created_at', 'DESC']],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    /**
     * Validation params
     */
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation is Fails' });
    }
    const { student_id } = req.params;
    /**
     * Check student exist
     */
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }
    console.log('ESTUDANTE', student_id);
    const today = Number(new Date());
    const startDate = Number(subDays(today, 7));

    const checkins = await Checkin.findAll({
      where: {
        student_id,
        created_at: { [Op.between]: [startOfDay(startDate), endOfDay(today)] },
      },
    });

    /**
     * Check if you checked in more than 5 times in 7 days
     */
    if (checkins && checkins.length > 5) {
      return res
        .status(401)
        .json({ error: 'You can only check-in 5 times every 7 days!' });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }
}

export default new CheckinController();
