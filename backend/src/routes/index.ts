import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import * as healthController from '../controllers/healthController';
import { getItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/crudController';
import { login } from '../controllers/authController';
import { uploadMedia } from '../controllers/mediaController';
import { sendMessage } from '../controllers/messagesController';
import { authenticateToken } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';

const router = Router();

// Auth routes
router.post('/auth/login', login);

// Entities
const entities = ['about', 'skills', 'projects', 'blogs', 'experience', 'testimonials', 'services'];

entities.forEach(entity => {
  // Public routes for GET
  router.get(`/${entity}`, getItems(entity));
  router.get(`/${entity}/:id`, getItemById(entity));
  
  // Protected routes for mutations
  router.post(`/${entity}`, authenticateToken, createItem(entity));
  router.put(`/${entity}/:id`, authenticateToken, updateItem(entity));
  router.delete(`/${entity}/:id`, authenticateToken, deleteItem(entity));
});

// Messages specifically
router.get('/messages', authenticateToken, getItems('messages'));
router.get('/messages/:id', authenticateToken, getItemById('messages'));
router.post('/messages', sendMessage); // Publicly accessible to send messages
router.delete('/messages/:id', authenticateToken, deleteItem('messages'));

// Media upload route (protected)
router.post('/media/upload', authenticateToken, upload.single('file'), uploadMedia);
router.get('/media', authenticateToken, getItems('media'));
router.delete('/media/:id', authenticateToken, deleteItem('media'));

router.get('/dashboard/overview', dashboardController.getOverview);
router.get('/dashboard/activity', dashboardController.getActivity);
router.get('/health', healthController.getHealth);

export default router;
