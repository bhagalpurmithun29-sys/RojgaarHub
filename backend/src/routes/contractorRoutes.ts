import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
  getContractorDashboard,
  createProject,
  assignWorkersToProject,
  updateProjectProgress,
} from '../controllers/contractorController';

const router = express.Router();

// Apply auth locks on all endpoints verifying JWT token and Contractor Role
router.use(protect, authorize('contractor'));

router.get('/dashboard', getContractorDashboard);
router.post('/projects', createProject);
router.put('/projects/:id/assign', assignWorkersToProject);
router.put('/projects/:id/progress', updateProjectProgress);

export default router;
