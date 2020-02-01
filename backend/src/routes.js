import Router from 'express';

import SessionController from './app/controllers/SessionController';
import authConfig from './app/middleware/auth';
import StudentController from './app/controllers/StudentController';

const routes = new Router();

routes.post('/users', SessionController.store);

routes.use(authConfig);

routes.get('/students', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

export default routes;
