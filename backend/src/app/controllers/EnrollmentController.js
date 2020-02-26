import * as Yup from 'yup';
import { parseISO, isBefore, addMonths } from 'date-fns';

import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';
import Student from '../model/Student';

class EnrollmentController {
  async index(req, res) {}

  async store(req, res) {
    /**
     * Validation body
     */
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Body is fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    /**
     * Check User doesn't other enrollment
     */
    const enrollment = await Enrollment.findOne({ where: { student_id } });
    if (enrollment) {
      return res.status(400).json({ error: 'User has been enrollments' });
    }

    /**
     * Check Plan exist
     */
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    /**
     * Check students Exist
     */
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const formattedDate = parseISO(start_date);

    /**
     *  Check date past
     */

    if (isBefore(formattedDate, new Date())) {
      return res.status(400).json({ error: 'Date already past' });
    }

    const duration = addMonths(formattedDate, plan.duration);
    const price = plan.duration * plan.price;
  }

  async update(req, res) {}

  async delete(req, res) {}
}

export default new EnrollmentController();
