import express from 'express';
const router = express.Router();

// 🟢 GET all projects (public)
router.get('/', async (req, res) => {
  try {
    const prisma = (req as any).prisma;
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// 🟢 GET single project by ID
router.get('/', async (req, res) => {
  try {
    const prisma = (req as any).prisma;
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    console.error('🔥 Prisma error while fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// 🟠 CREATE a new project
router.post('/', async (req, res) => {
  try {
    const prisma = (req as any).prisma;
    const { title, description, budget, skills, status } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget,
        skills,
        status: status || 'OPEN',
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// 🟡 UPDATE a project
router.put('/:id', async (req, res) => {
  try {
    const prisma = (req as any).prisma;
    const id = parseInt(req.params.id, 10);
    const { title, description, budget, skills, status } = req.body;

    const updated = await prisma.project.update({
      where: { id },
      data: { title, description, budget, skills, status },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// 🔴 DELETE a project
router.delete('/:id', async (req, res) => {
  try {
    const prisma = (req as any).prisma;
    const id = parseInt(req.params.id, 10);

    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
