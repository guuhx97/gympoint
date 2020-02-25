import Router from 'express';

import SessionController from './app/controllers/SessionController';
import authConfig from './app/middleware/auth';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';

const routes = new Router();

routes.post('/users', SessionController.store);

routes.use(authConfig);

routes.get('/students', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:plan_id', PlanController.update);
routes.delete('/plans/:plan_id', PlanController.delete);

export default routes;
