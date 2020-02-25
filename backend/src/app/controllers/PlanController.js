import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    /**
     * Validation body
     */
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation body is fails' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    /**
     * Validation params
     */
    const schemaParams = Yup.object().shape({
      plan_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation params is fail' });
    }

    /**
     * Validation body
     */
    const schemaBody = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().positive(),
      price: Yup.number().positive(),
    });
    if (!(await schemaBody.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation body is fails' });
    }

    /**
     * Check Plan exist
     */
    const plan = await Plan.findByPk(req.params.plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    /**
     * Validation params
     */
    const schemaParams = Yup.object().shape({
      plan_id: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schemaParams.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation params is fail' });
    }

    /**
     * Check Plan exist
     */
    const plan = await Plan.findByPk(req.params.plan_id);
    if (!plan) {
      return res.json({ error: 'Plan does not exist' });
    }
    await plan.destroy({ where: plan });

    return res.json({ error: 'Plan has been deleted' });
  }
}

export default new PlanController();
