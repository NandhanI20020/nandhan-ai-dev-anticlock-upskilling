import { Router, Request, Response } from 'express';
import dealsData from '../../data/deals.json';
import peopleData from '../../data/people.json';
import organizationsData from '../../data/organizations.json';
import type { SearchResponse, SearchResult } from '../../../shared/types/search';

const router = Router();

interface Deal { id: string; title: string; orgId: string | null; status: string; }
interface Person { id: string; name: string; jobTitle: string; orgId: string | null; }
interface Org { id: string; name: string; address: string; }

const deals: Deal[] = dealsData as unknown as Deal[];
const people: Person[] = peopleData as Person[];
const orgs: Org[] = organizationsData as Org[];

// GET /api/search?q=
router.get('/', (req: Request, res: Response) => {
  const q = ((req.query.q as string) ?? '').trim().toLowerCase();
  if (q.length < 2) { res.json({ deals: [], people: [], orgs: [] } as SearchResponse); return; }

  const matchedDeals: SearchResult[] = deals
    .filter((d) => d.title.toLowerCase().includes(q))
    .slice(0, 5)
    .map((d) => {
      const org = orgs.find((o) => o.id === d.orgId);
      return { id: d.id, type: 'deal', title: d.title, subtitle: org?.name ?? '', url: `/deals/${d.id}` };
    });

  const matchedPeople: SearchResult[] = people
    .filter((p) => p.name.toLowerCase().includes(q))
    .slice(0, 5)
    .map((p) => ({ id: p.id, type: 'person', title: p.name, subtitle: p.jobTitle, url: `/contacts/people/${p.id}` }));

  const matchedOrgs: SearchResult[] = orgs
    .filter((o) => o.name.toLowerCase().includes(q))
    .slice(0, 5)
    .map((o) => ({ id: o.id, type: 'org', title: o.name, subtitle: o.address, url: `/contacts/organizations/${o.id}` }));

  res.json({ deals: matchedDeals, people: matchedPeople, orgs: matchedOrgs } as SearchResponse);
});

export default router;
