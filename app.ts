import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import productRoutes from './src/routes/product.route';
import categoryRoutes from './src/routes/category.route';
import userRoutes from './src/routes/user.route';
import orderRoute from './src/routes/order.route';
import imageRoute from './src/routes/image.route';
import reviewRoute from './src/routes/review.route';
import path from 'node:path';
import { Socket } from 'node:net';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoute);
app.use('/images', imageRoute);
app.use('/reviews', reviewRoute);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// I have no fucking idea, how to gracefully stop application
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections: Socket[] = [];
server.on('connection', (connection) => {
    connections.push(connection);
    connection.on('close', () => (connections = connections.filter((curr) => curr !== connection)));
});

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');

    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    connections.forEach((curr) => curr.end());
    setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
}
