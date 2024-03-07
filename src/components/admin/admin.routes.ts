import { Router } from 'express';

import {
  createAdmin,
  deleteAdminById,
  getAdminByEmail,
  getAdminById,
  getAllAdmins,
  updateAdminById,
} from './admin.controller';

const adminRouter: Router = Router();

adminRouter.get('/', getAllAdmins);
adminRouter.get('/:id', getAdminById);
adminRouter.get('/email/:email', getAdminByEmail);
adminRouter.post('/', createAdmin);
adminRouter.patch('/:id', updateAdminById);
adminRouter.delete('/:id', deleteAdminById);

export { adminRouter };
