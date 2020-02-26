import * as Yup from 'yup';
import { parseISO, isBefore, addMonths } from 'date-fns';

import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';

class EnrollmentController {
  async index(req, res) {
    const enrollment = await Enrollment.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });
    return res.json(enrollment);
  }

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
    const enrollmentStudent = await Enrollment.findOne({
      where: { student_id },
    });
    if (enrollmentStudent) {
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

    const end_date = addMonths(formattedDate, plan.duration);
    const price = plan.duration * plan.price;
    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    const createdEnrollment = await Enrollment.findByPk(enrollment.id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    // ENVIA EMAIL

    return res.json(createdEnrollment);
  }

  async update(req, res) {
    /**
     * Validation params
     */
    const schemaParams = Yup.object().shape({
      enrollment_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation params is fails' });
    }

    /**
     * Validation body
     */
    const schemaBody = Yup.object().shape({
      plan_id: Yup.number()
        .positive()
        .required(),
      start_date: Yup.date(),
    });
    if (!(await schemaBody.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation body is fail' });
    }
    /**
     * Check Enrollment exist
     */
    const enrollment = await Enrollment.findByPk(req.params.enrollment_id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exist' });
    }

    const { plan_id, start_date } = req.body;

    /**
     * Check new Plan exist
     */
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const formatedDate = parseISO(start_date);
    const end_date = addMonths(formatedDate, plan.duration);
    const price = plan.duration * plan.price;

    return res.json(
      await enrollment.update({
        plan_id,
        start_date,
        end_date,
        price,
      })
    );
  }

  async delete(req, res) {
    /**
     * Validation params
     */
    const schemaParams = Yup.object().shape({
      enrollment_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation params is fail' });
    }

    /**
     * Check Plan exist
     */
    const enrollment = await Enrollment.findByPk(req.params.enrollment_id);
    if (!enrollment) {
      return res.json({ error: 'Enrollment does not exist' });
    }
    await enrollment.destroy({ where: enrollment });

    return res.json({ error: 'Enrollment has been deleted' });
  }
}

export default new EnrollmentController();
