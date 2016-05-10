import express from 'express';
import staticRoutes from './routes/static';
import apiRoutes from './routes/api';
import viewRoutes from './routes/views';

var router = express.Router();

router.use(staticRoutes);
router.use(viewRoutes);
router.use('/api', apiRoutes);

export default router;
