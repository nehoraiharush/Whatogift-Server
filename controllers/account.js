import express from 'express';
const router = express.Router();

router.get('/', async (request, response) => {
    return response.status(200).json({
        message: 'hello from account controller'
    })
});
export default router;