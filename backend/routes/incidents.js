const express = require('express');
const router = express.Router();
const { getIncidents, saveIncidents, KOLKATA_AUTHORITIES } = require('../data/seedData');
const { calculateCivicPriorityScore } = require('../lib/aiEngine');

// GET /api/incidents - List all with filters
router.get('/', (req, res) => {
  const { ward, category, severity } = req.query;
  let incidents = getIncidents();

  if (ward && ward !== 'all') {
    incidents = incidents.filter((i) => i.ward === Number(ward));
  }
  if (category && category !== 'all') {
    incidents = incidents.filter((i) => i.category === category);
  }
  if (severity && severity !== 'all') {
    incidents = incidents.filter((i) => i.severity === severity);
  }

  res.json({ success: true, count: incidents.length, incidents });
});

// GET /api/incidents/:id - Get single incident
router.get('/:id', (req, res) => {
  const incidents = getIncidents();
  const inc = incidents.find((i) => i.id.toLowerCase() === req.params.id.toLowerCase());

  if (!inc) {
    return res.status(404).json({ success: false, error: 'Incident not found' });
  }

  res.json({ success: true, incident: inc });
});

// POST /api/incidents - Create a new civic incident
router.post('/', (req, res) => {
  const body = req.body;

  if (!body.title || !body.category) {
    return res.status(400).json({ success: false, error: 'Title and category are required' });
  }

  const newId = body.id || `CS-${Math.floor(1000 + Math.random() * 9000)}`;
  const priority = body.priorityBreakdown || calculateCivicPriorityScore({
    category: body.category,
    severity: body.severity || 'high',
    ward: body.ward || 48
  });

  const newIncident = {
    ...body,
    id: newId,
    priorityScore: priority.total,
    priorityBreakdown: priority,
    status: body.status || 'ai_verified',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    confirmationCount: body.confirmationCount || 1,
    affectedCitizenCount: body.affectedCitizenCount || 12,
    timeline: body.timeline || [
      {
        id: 'evt_' + Date.now(),
        incidentId: newId,
        status: 'reported',
        actor: 'Citizen Reporter',
        actorRole: 'citizen',
        timestamp: new Date().toISOString(),
        note: 'Geotagged report logged via CivicSeva.'
      }
    ]
  };

  const current = getIncidents();
  saveIncidents([newIncident, ...current]);

  res.status(201).json({ success: true, incident: newIncident });
});

// PATCH /api/incidents/:id - Update status, confirm, escalate, or verify
router.patch('/:id', (req, res) => {
  const incidents = getIncidents();
  const index = incidents.findIndex((i) => i.id.toLowerCase() === req.params.id.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Incident not found' });
  }

  const inc = incidents[index];
  const { action, status, actor, note, evidenceUrl, verdict, citizenNotes, aiScore, aiLabel, reason } = req.body;

  let updated = { ...inc, updatedAt: new Date().toISOString() };

  if (action === 'confirm') {
    const newCount = (inc.confirmationCount || 0) + 1;
    const newScore = Math.min(99, (inc.priorityScore || 50) + 2);
    updated.confirmationCount = newCount;
    updated.priorityScore = newScore;
    updated.timeline.push({
      id: 'e_' + Date.now(),
      incidentId: inc.id,
      status: inc.status,
      actor: actor || 'Community Member',
      actorRole: 'citizen',
      timestamp: new Date().toISOString(),
      note: 'Community confirmed issue ("I\'m facing this too"). Urgency increased.'
    });
  } else if (action === 'update_status') {
    updated.status = status;
    updated.timeline.push({
      id: 'e_' + Date.now(),
      incidentId: inc.id,
      status,
      actor: actor || 'KMC Engineer',
      actorRole: 'authority',
      timestamp: new Date().toISOString(),
      note: note || `Status transitioned to ${status}`,
      evidenceUrl
    });
  } else if (action === 'resolve_by_authority') {
    updated.status = 'marked_resolved';
    updated.resolution = {
      markedResolvedAt: new Date().toISOString(),
      authorityEvidenceUrl: evidenceUrl || inc.images[0],
      authorityNotes: note || 'Repairs finalized. Awaiting citizen verification.',
      citizenVerdict: 'pending'
    };
    updated.timeline.push({
      id: 'e_' + Date.now(),
      incidentId: inc.id,
      status: 'marked_resolved',
      actor: actor || 'KMC Department Head',
      actorRole: 'authority',
      timestamp: new Date().toISOString(),
      note: note || 'Work marked complete by authority.'
    });
  } else if (action === 'verify_by_citizen') {
    const isFixed = verdict === 'completely_fixed';
    updated.status = isFixed ? 'verified_resolved' : 'escalated';
    updated.resolution = {
      ...updated.resolution,
      citizenVerdict: verdict,
      citizenNotes,
      citizenEvidenceUrl: evidenceUrl || inc.images[0],
      aiVerificationScore: aiScore || 92,
      aiVerificationLabel: aiLabel || 'appears_resolved',
      verifiedAt: new Date().toISOString()
    };
    updated.timeline.push({
      id: 'e_' + Date.now(),
      incidentId: inc.id,
      status: isFixed ? 'verified_resolved' : 'escalated',
      actor: 'Citizen Ground Inspection',
      actorRole: 'citizen',
      timestamp: new Date().toISOString(),
      note: `Citizen verification: ${verdict}. AI visual match: ${aiScore || 92}%.`
    });
  } else if (action === 'escalate') {
    const newCount = (inc.escalationCount || 0) + 1;
    updated.status = 'escalated';
    updated.escalationCount = newCount;
    updated.timeline.push({
      id: 'e_' + Date.now(),
      incidentId: inc.id,
      status: 'escalated',
      actor: 'Grievance Escalation Monitor',
      actorRole: 'citizen',
      timestamp: new Date().toISOString(),
      note: `Tier-${newCount} Escalation notice dispatched: ${reason || 'SLA breached'}`
    });
  }

  incidents[index] = updated;
  saveIncidents(incidents);

  res.json({ success: true, incident: updated });
});

module.exports = router;
