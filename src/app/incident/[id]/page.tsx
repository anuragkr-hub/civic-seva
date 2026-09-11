'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { CivicIncident, IncidentStatus } from '../../../types';
import {
  getIncidentById,
  addCommunityConfirmation,
  updateIncidentStatus,
  submitAuthorityResolution,
  triggerEscalation
} from '../../../lib/storage';
import { BeforeAfterVerify } from '../../../components/Incident/BeforeAfterVerify';
import {
  MapPin,
  Flame,
  Shield,
  Clock,
  ThumbsUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Mail,
  Share2,
  ChevronRight,
  ArrowLeft,
  Upload,
  Calendar,
  Layers,
  Activity,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { role, refreshIncidents, addNotification, isAuthenticated, user } = useApp();

  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const [incident, setIncident] = useState<CivicIncident | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Authority quick-action state
  const [authorityNote, setAuthorityNote] = useState('');
  const [authorityEvidenceUrl, setAuthorityEvidenceUrl] = useState(
    'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80'
  );

  // Escalation state
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationReason, setEscalationReason] = useState(
    'No repair crew or physical action observed at the site for over 7 days. Public hazard continues to compromise vehicle and pedestrian safety.'
  );

  const loadData = () => {
    if (id) {
      const found = getIncidentById(id);
      if (found) {
        setIncident({ ...found });
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!incident) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Incident #{id} Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          The requested civic issue record could not be located in the Kolkata registry.
        </p>
        <Link
          href="/map"
          className="inline-block mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-semibold"
        >
          Return to Civic Map
        </Link>
      </div>
    );
  }

  const handleConfirm = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/incident/${incident.id}`);
      return;
    }
    const updated = addCommunityConfirmation(incident.id, user?.id || 'citizen_viewer_' + Date.now());
    if (updated) {
      setIncident({ ...updated });
      refreshIncidents();
      addNotification({
        title: 'Confirmation Logged',
        message: `You confirmed #${incident.id}. Urgency priority boosted to ${updated.priorityScore}/100!`,
        type: 'success',
        link: `/incident/${incident.id}`
      });
    }
  };

  const handleAuthorityStatusUpdate = (status: IncidentStatus, note: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/incident/${incident.id}`);
      return;
    }
    const updated = updateIncidentStatus(
      incident.id,
      status,
      user?.name || 'KMC Executive Engineer (Borough Ops)',
      note
    );
    if (updated) {
      setIncident({ ...updated });
      refreshIncidents();
      addNotification({
        title: 'Status Updated',
        message: `Incident #${incident.id} transitioned to: ${status.replace('_', ' ').toUpperCase()}`,
        type: 'info',
        link: `/incident/${incident.id}`
      });
    }
  };

  const handleMarkResolvedByAuthority = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/incident/${incident.id}`);
      return;
    }
    const updated = submitAuthorityResolution(
      incident.id,
      authorityNote || 'Repair and maintenance work finalized per municipal safety standards.',
      authorityEvidenceUrl
    );
    if (updated) {
      setIncident({ ...updated });
      refreshIncidents();
      addNotification({
        title: 'Marked Resolved by Authority',
        message: `Incident #${incident.id} marked as resolved. Pending citizen verification!`,
        type: 'info',
        link: `/incident/${incident.id}`
      });
    }
  };

  const handleEscalate = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/incident/${incident.id}`);
      return;
    }
    const updated = triggerEscalation(incident.id, escalationReason);
    if (updated) {
      setIncident({ ...updated });
      refreshIncidents();
      setShowEscalationModal(false);
      addNotification({
        title: 'Civic Grievance Escalated',
        message: `Incident #${incident.id} escalated to Municipal Commissioner. Tier-${updated.escalationCount} Notice dispatched.`,
        type: 'escalation',
        link: `/incident/${incident.id}`
      });
    }
  };

  // Check if issue is overdue (> 5 days without completion)
  const isOverdue =
    (incident.status === 'in_progress' || incident.status === 'acknowledged' || incident.status === 'reported' || incident.status === 'escalated') &&
    new Date().getTime() - new Date(incident.createdAt).getTime() > 4 * 24 * 60 * 60 * 1000;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-6">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <Link
          href="/map"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Civic Map
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedLink ? 'Link Copied!' : 'Share Incident'}
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                #{incident.id}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold uppercase">
                {incident.categoryDisplay}
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                  incident.status === 'verified_resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : incident.status === 'marked_resolved'
                    ? 'bg-blue-100 text-blue-800'
                    : incident.status === 'escalated'
                    ? 'bg-red-100 text-red-800 animate-pulse'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                Status: {incident.status.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {incident.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                {incident.address} (Ward {incident.ward}, {incident.borough})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Reported {new Date(incident.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Priority Score Gauge */}
          <div className="flex items-center gap-4 bg-slate-900 text-white p-4 rounded-2xl shrink-0 shadow">
            <div>
              <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                Civic Priority Score
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {incident.priorityScore}
                </span>
                <span className="text-sm text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-700" />
            <div className="text-right">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  incident.priorityScore >= 85
                    ? 'bg-red-500/30 text-red-300'
                    : 'bg-orange-500/30 text-orange-300'
                }`}
              >
                {incident.severity.toUpperCase()}
              </span>
              <div className="text-[10px] text-slate-400 mt-1">
                {incident.confirmationCount} Confirmations
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar: "I'm facing this too" + Escalation */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold hover:bg-orange-100 transition-all hover:scale-105 shadow-sm"
            >
              <ThumbsUp className="w-4 h-4 text-orange-600" />
              <span>I&apos;m facing this too (+1)</span>
              <span className="px-1.5 py-0.5 rounded-full bg-orange-200 text-orange-900 text-[10px]">
                {incident.confirmationCount}
              </span>
            </button>

            <span className="text-xs text-slate-500 hidden sm:inline">
              👥 <strong>{incident.affectedCitizenCount}</strong> estimated citizens impacted
            </span>
          </div>

          {/* Smart Escalation Trigger */}
          {isOverdue && incident.status !== 'verified_resolved' && (
            <button
              onClick={() => setShowEscalationModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold hover:bg-red-100 shadow-sm transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Generate Escalation (Overdue &gt; 7 Days)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Photos, AI Breakdown & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos & Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Photo Evidence & On-Ground Report
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {incident.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-950"
                >
                  <img
                    src={img}
                    alt={`Incident evidence ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] backdrop-blur-sm">
                    Geotagged Ward {incident.ward} Evidence
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">
                Citizen Field Description:
              </span>
              <p>{incident.description}</p>
              {incident.aiSuggestedDescription && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-slate-500">
                  <span className="font-semibold text-orange-700 block text-[11px]">
                    AI Structured Analysis:
                  </span>
                  <p className="italic">{incident.aiSuggestedDescription}</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Priority Breakdown Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600" />
                AI Priority Score Computation ({incident.priorityScore}/100)
              </h3>
              <span className="text-xs font-semibold text-orange-600">
                {incident.severity.toUpperCase()} URGENCY
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-[11px]">Safety Risk</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {incident.priorityBreakdown.safetyRisk} / 30
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-[11px]">Citizen Impact</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {incident.priorityBreakdown.citizenImpact} / 30
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-[11px]">Location Sensitivity</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {incident.priorityBreakdown.locationSensitivity} / 20
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-[11px]">Issue Severity</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {incident.priorityBreakdown.issueSeverity} / 20
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              {incident.priorityBreakdown.factors.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-orange-500">•</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Verification & AI Visual Comparison (Section 16 & 17) */}
          {(incident.status === 'marked_resolved' ||
            incident.status === 'citizen_verification' ||
            incident.status === 'verified_resolved') && (
            <BeforeAfterVerify
              incident={incident}
              onVerificationComplete={loadData}
            />
          )}

          {/* Activity History / Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-600" />
              Complete Incident Lifecycle & Audit Trail
            </h3>

            <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {incident.timeline.map((evt, idx) => (
                <div key={evt.id || idx} className="relative group">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-orange-600 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 uppercase text-[11px]">
                        {evt.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Actor: {evt.actor} ({evt.actorRole})
                    </div>
                    <p className="text-slate-700 mt-1">{evt.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Authority Card, Official Email & Authority Actions */}
        <div className="space-y-6">
          {/* Authority Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Assigned Authority
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                {incident.responsibleAuthorityName}
              </div>
              <div className="text-slate-600">
                Department: <strong>{incident.department}</strong>
              </div>
              <div className="text-slate-500">
                Ward Coverage: <strong>Ward {incident.ward}</strong> ({incident.borough})
              </div>
              <div className="text-slate-500">
                Landmark: <strong>{incident.nearestLandmark}</strong>
              </div>
            </div>
          </div>

          {/* Official Email Notice */}
          {incident.officialEmail && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <Mail className="w-4 h-4 text-orange-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Dispatched Official Complaint
                </h3>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-bold">
                  Subject:
                </div>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {incident.officialEmail.subject}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold mt-2">
                  ✓ Citizen Approved & Dispatched to Municipal Desk
                </div>
              </div>
            </div>
          )}

          {/* KMC Officer Status Controls (Enabled in Authority Role) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-elevated space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Officer Action Desk
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-600 text-white font-bold uppercase">
                {role === 'authority' ? 'Active Officer' : 'Demo Switch'}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Government engineers can update status, dispatch crews, and submit completion evidence here:
            </p>

            <div className="space-y-2">
              <button
                onClick={() =>
                  handleAuthorityStatusUpdate(
                    'acknowledged',
                    'Inspected by Ward AE. Scheduled repair team.'
                  )
                }
                disabled={incident.status === 'acknowledged' || incident.status === 'work_started'}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 text-left flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>1. Acknowledge Incident</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() =>
                  handleAuthorityStatusUpdate(
                    'work_started',
                    'Repair crew mobilized on site with materials and machinery.'
                  )
                }
                disabled={incident.status === 'work_started'}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 text-left flex items-center justify-between transition-colors disabled:opacity-50"
              >
                <span>2. Mark Work Started</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="block text-[11px] font-bold text-slate-300 uppercase">
                Mark Resolved & Submit Ground Photo:
              </label>
              <textarea
                rows={2}
                value={authorityNote}
                onChange={(e) => setAuthorityNote(e.target.value)}
                placeholder="Details of remedial work conducted..."
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                onClick={handleMarkResolvedByAuthority}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-transform hover:scale-[1.02]"
              >
                Mark Work Completed & Request Citizen Verification
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Smart Escalation Protocol
                </h3>
                <p className="text-xs text-slate-500">
                  This issue has exceeded the standard Kolkata Municipal response threshold.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 space-y-1">
              <div><strong>Incident:</strong> #{incident.id} ({incident.categoryDisplay})</div>
              <div><strong>Priority:</strong> {incident.priorityScore}/100 • <strong>Ward:</strong> {incident.ward}</div>
              <div><strong>Confirmations:</strong> {incident.confirmationCount} citizens affected</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Escalation Notice Justification:
              </label>
              <textarea
                rows={4}
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowEscalationModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEscalate}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow"
              >
                Dispatch Escalation Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
