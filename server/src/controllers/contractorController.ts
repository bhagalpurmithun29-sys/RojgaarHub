import { Request, Response } from 'express';
import Project, { ProjectStatus } from '../models/Project';
import User, { UserRole } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get contractor dashboard metrics
// @route   GET /api/contractors/dashboard
// @access  Private (Contractor)
export const getContractorDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'contractor') {
      return res.status(403).json({ message: 'Access denied: Contractor credentials required.' });
    }

    const contractorId = req.user._id;

    // Fetch Contractor's projects
    const projects = await Project.find({ contractor: contractorId });
    const totalWorkers = await User.countDocuments({ role: UserRole.LABOUR }); // Mocking total pool of managed workers
    
    const activeProjectsCount = projects.filter(p => p.status === ProjectStatus.ACTIVE).length;
    const pendingProjectsCount = projects.filter(p => p.status === ProjectStatus.PENDING).length;

    // Calculate aggregated revenue (Sum of budgets of active & completed projects)
    const revenue = projects
      .filter(p => p.status === ProjectStatus.ACTIVE || p.status === ProjectStatus.COMPLETED)
      .reduce((sum, p) => sum + p.budget, 0);

    // Mock analytical indicators
    const analytics = {
      teamPerformance: 94, // 94% completion success rate
      averageRatings: 4.8,
      responseMinutes: 12,
    };

    res.json({
      totalWorkers,
      activeProjectsCount,
      pendingProjectsCount,
      revenue,
      projects,
      analytics,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new large contractor project with bulk workers
// @route   POST /api/contractors/projects
// @access  Private (Contractor)
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'contractor') {
      return res.status(403).json({ message: 'Access denied: Contractor credentials required.' });
    }

    const { title, description, assignedWorkers, deadline, budget } = req.body;

    const project = await Project.create({
      contractor: req.user._id,
      title,
      description,
      assignedWorkers: assignedWorkers || [],
      deadline: new Date(deadline),
      budget,
      status: ProjectStatus.PENDING,
      completionProgress: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Bulk project successfully drafted and initialized.',
      project,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign additional workers to a project
// @route   PUT /api/contractors/projects/:id/assign
// @access  Private (Contractor)
export const assignWorkersToProject = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'contractor') {
      return res.status(403).json({ message: 'Access denied: Contractor credentials required.' });
    }

    const { id } = req.params;
    const { workerIds } = req.body; // Array of worker User Object IDs

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.contractor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage this project.' });
    }

    // Append workers ensuring no duplicate references
    workerIds.forEach((workerId: string) => {
      if (!project.assignedWorkers.includes(workerId as any)) {
        project.assignedWorkers.push(workerId as any);
      }
    });

    await project.save();

    res.json({
      success: true,
      message: 'Bulk worker dispatches updated successfully.',
      project,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project progress and status details
// @route   PUT /api/contractors/projects/:id/progress
// @access  Private (Contractor)
export const updateProjectProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'contractor') {
      return res.status(403).json({ message: 'Access denied: Contractor credentials required.' });
    }

    const { id } = req.params;
    const { completionProgress, status } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    if (project.contractor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to manage this project.' });
    }

    if (completionProgress !== undefined) {
      project.completionProgress = completionProgress;
    }
    if (status) {
      project.status = status;
    }

    await project.save();

    res.json({
      success: true,
      message: 'Project status tracker updated.',
      project,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
