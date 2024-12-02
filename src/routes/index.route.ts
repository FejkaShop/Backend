import express, { Response, Router } from 'express';

const router: Router = express.Router();

/* GET home page. */
router.get('/', function (res: Response) {
    res.render('index', { title: 'Express' });
});

export default router;
