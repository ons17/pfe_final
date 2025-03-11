import { Router } from 'express';
import { createEmployee, getAllEmployees } from '../controllers/adminController';
import { isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Admin route to create a new employee
router.post('/creer-travailleur', isAdmin, createEmployee);

// Admin route to get all employees
router.get('/employees', isAdmin, getAllEmployees);

export default router;