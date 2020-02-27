import * as Yup from 'yup';
import HelperOrder from '../models/HelperOrder';
import Student from '../models/Student';

class HelperOrderController {
  async show(req, res) {
    /**
     * Validation params
     */
    const schemaParams = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation parmas is fail' });
    }
    const { student_id } = req.params;
    /**
     * Check student exist
     */
    const student = Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }
    const helperOrders = await HelperOrder.findAll({
      where: {
        student_id,
      },
    });

    return res.json(helperOrders);
  }

  async index(req, res) {
    const helperOrders = await HelperOrder.findAll({
      where: {
        answer: null,
        answer_at: null,
      },
    });

    return res.json(helperOrders);
  }

  async store(req, res) {
    const { student_id } = req.params;
    const { question } = req.body;
    /**
     * Validation params
     */
    const schemaParams = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation parmas is fail' });
    }

    /**
     * Validation body
     */
    const schemaBody = Yup.object().shape({
      question: Yup.string()
        .min(6)
        .required(),
    });
    if (!(await schemaBody.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation body is fail' });
    }

    /**
     * Check student exist
     */
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exits' });
    }

    const helperOrder = await HelperOrder.create({
      student_id,
      question,
    });

    return res.json(helperOrder);
  }

  async update(req, res) {
    const schemaParams = Yup.object().shape({
      helper_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation parmas is fail' });
    }

    /**
     * Validation body
     */
    const schemaBody = Yup.object().shape({
      answer: Yup.string()
        .min(6)
        .required(),
    });
    if (!(await schemaBody.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation body is fail' });
    }

    const { answer } = req.body;
    /**
     * Check Helper Orders exist
     */
    const helperOrder = await HelperOrder.findOne({
      where: {
        id: req.params.helper_id,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });
    if (!helperOrder) {
      return res.status(400).json({ error: 'Helper Order does not exist' });
    }

    const { id, student_id, question, answer_at } = await helperOrder.update({
      answer,
      answer_at: new Date(),
    });

    // ENVIAR EMAILS

    return res.json({ id, student_id, question, answer, answer_at });
  }
}

export default new HelperOrderController();
