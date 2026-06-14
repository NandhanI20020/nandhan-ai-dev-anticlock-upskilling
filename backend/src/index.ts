import express from 'express';
import cors from 'cors';
import pipelinesRouter from './routes/pipelines';
import dealsRouter from './routes/deals';
import notesRouter from './routes/notes';
import savedViewsRouter from './routes/savedViews';
import peopleRouter from './routes/people';
import organizationsRouter from './routes/organizations';
import activitiesRouter from './routes/activities';
import insightsRouter from './routes/insights';
import searchRouter from './routes/search';
import leadsRouter from './routes/leads';
import forecastRouter from './routes/forecast';
import archiveRouter from './routes/archive';

const app = express();
const PORT = 3001;

app.use(cors({ origin: /^http:\/\/localhost/ }));
app.use(express.json());

app.use('/api/pipelines', pipelinesRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/saved-views', savedViewsRouter);
app.use('/api/people', peopleRouter);
app.use('/api/labels', peopleRouter);
app.use('/api/organizations', organizationsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/search', searchRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/forecast', forecastRouter);
app.use('/api/archive', archiveRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
