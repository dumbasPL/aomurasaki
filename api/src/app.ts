import express, {json, Request, Response, urlencoded} from 'express';
import {RegisterRoutes} from '../build/routes';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(urlencoded({extended: true}));
app.use(json());

app.use('/docs', swaggerUi.serve, async (_req: Request, res: Response) => {
  return res.send(
    swaggerUi.generateHTML(await import('../build/swagger.json'))
  );
});

RegisterRoutes(app);

export default app;
