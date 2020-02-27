import Router from 'express';

import SessionController from './app/controllers/SessionController';
import authConfig from './app/middleware/auth';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelperOrder from './app/controllers/HelperOrderController';

const routes = new Router();

routes.post('/users', SessionController.store);

routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.show);

routes.post('/students/:student_id/help-orders', HelperOrder.store);

routes.use(authConfig);

routes.get('/students', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:plan_id', PlanController.update);
routes.delete('/plans/:plan_id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:enrollment_id', EnrollmentController.update);
routes.delete('/enrollments/:enrollment_id', EnrollmentController.delete);

routes.get('/students/:student_id/helper-olders', HelperOrder.show);
routes.get('/helper-olders', HelperOrder.index);
routes.post('/help-orders/:helper_id/answer', HelperOrder.update);

export default routes;
