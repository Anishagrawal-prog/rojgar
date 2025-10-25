import express from 'express';
import { authMiddleware, requireRole } from '../lib/auth';
const router = express.Router();

router.post('/schedule', authMiddleware, requireRole(['RECRUITER','ADMIN']), async (req, res) => {
  const prisma = (req as any).prisma;
  const { candidateId, scheduledAt, meetingLink } = req.body;
  const interview = await prisma.interview.create({
    data: {
      candidateId,
      interviewerId: (req as any).user.id,
      scheduledAt: new Date(scheduledAt),
      meetingLink
    }
  });
  // TODO: enqueue email to candidate with meeting link (SendGrid)
  res.json(interview);
});

router.get('/', authMiddleware, async (req, res) => {
  const prisma = (req as any).prisma;
  const user = (req as any).user;
  if(user.role === 'CANDIDATE'){
    const data = await prisma.interview.findMany({ where: { candidateId: user.id }});
    return res.json(data);
  }
  const data = await prisma.interview.findMany({ include: { candidate: true }});
  res.json(data);
});

router.post('/result/:id', authMiddleware, requireRole(['RECRUITER','ADMIN']), async (req, res) => {
  const prisma = (req as any).prisma;
  const { result, notes } = req.body;
  const interview = await prisma.interview.update({
    where: { id: req.params.id },
    data: { result, status: 'COMPLETED', notes }
  });
  // update candidate's interviewStatus if passed
  if(result === 'PASS') {
    await prisma.user.update({ where: { id: interview.candidateId }, data: { interviewStatus: 'PENDING' }});
  }
  res.json(interview);
});

export default router;
