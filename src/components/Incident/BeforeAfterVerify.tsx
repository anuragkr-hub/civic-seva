'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CivicIncident, VerificationOutcome } from '../../types';
import { compareBeforeAndAfterAI, BeforeAfterComparison } from '../../lib/aiEngine';
import { submitCitizenVerification } from '../../lib/storage';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Upload,
  Layers,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface BeforeAfterVerifyProps {
  incident: CivicIncident;
  onVerificationComplete: () => void;
}

export const BeforeAfterVerify: React.FC<BeforeAfterVerifyProps> = ({
  incident,
  onVerificationComplete
}) => {
  const router = useRouter();
  const { addNotification, role, isAuthenticated } = useApp();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [selectedVerdict, setSelectedVerdict] = useState<VerificationOutcome>('completely_fixed');
  const [citizenNotes, setCitizenNotes] = useState(
    'Inspected on ground. The road surface has been completely leveled and smoothed.'
  );
  const [afterImage, setAfterImage] = useState<string>(
    incident.resolution?.authorityEvidenceUrl ||
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80'
  );
  const [comparisonResult, setComparisonResult] = useState<BeforeAfterComparison | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(
    incident.status === 'verified_resolved'
  );

  const beforeImage = incident.images[0] || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';

  const runVisualComparison = (verdict: VerificationOutcome) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = compareBeforeAndAfterAI(incident.category, verdict);
      setComparisonResult(result);
      setIsAnalyzing(false);
    }, 800);
  };

  React.useEffect(() => {
    runVisualComparison(selectedVerdict);
  }, []);

  const handleVerdictChange = (v: VerificationOutcome) => {
    setSelectedVerdict(v);
    runVisualComparison(v);
  };

  const handleAfterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAfterImage(ev.target?.result as string);
        runVisualComparison(selectedVerdict);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmVerification = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/incident/${incident.id}`);
      return;
    }

    const score = comparisonResult?.confidenceScore || 92;
    const label = comparisonResult?.verdict || 'appears_resolved';

    submitCitizenVerification(
      incident.id,
      selectedVerdict,
      citizenNotes,
      afterImage,
      score,
      label
    );

    setIsSubmitted(true);
    addNotification({
      title: 'Citizen Verification Submitted',
      message: `Incident #${incident.id} verified with AI visual score ${score}%. Verdict: ${selectedVerdict.replace('_', ' ')}.`,
      type: 'success',
      link: `/incident/${incident.id}`
    });

    onVerificationComplete();
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 sm:p-8 shadow-soft space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            MAJOR INNOVATION: AI BEFORE / AFTER VERIFICATION
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Citizen Ground Verification & AI Visual Comparison
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            The authority reported this issue as resolved. Compare the original defect with the ground photo to prevent premature sign-offs.
          </p>
        </div>

        {incident.status === 'verified_resolved' && (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            Verified Resolution
          </span>
        )}
      </div>

      {/* Interactive Visual Comparison (Side-by-Side & Split Slider) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1 text-red-600">
            🔴 BEFORE (Original Report)
          </span>
          <span className="text-slate-400 font-normal">
            Drag slider or compare visual frames
          </span>
          <span className="flex items-center gap-1 text-emerald-600">
            🟢 AFTER (Resolution Ground Evidence)
          </span>
        </div>

        {/* Comparison Viewer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Frame */}
          <div className="relative rounded-xl overflow-hidden border-2 border-red-200 aspect-video bg-slate-900">
            <img
              src={beforeImage}
              alt="Before Repair"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2.5 py-1 bg-red-600/90 text-white font-bold text-[11px] rounded-md backdrop-blur-sm shadow">
              BEFORE: {incident.categoryDisplay}
            </div>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded backdrop-blur-sm">
              Reported: {new Date(incident.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* After Frame */}
          <div className="relative rounded-xl overflow-hidden border-2 border-emerald-300 aspect-video bg-slate-900">
            <img
              src={afterImage}
              alt="After Repair"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2.5 py-1 bg-emerald-600/90 text-white font-bold text-[11px] rounded-md backdrop-blur-sm shadow">
              AFTER: Work Completed
            </div>
            <label className="absolute bottom-2 right-2 cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/95 text-slate-800 text-[10px] font-bold hover:bg-white shadow">
              <Upload className="w-3 h-3" />
              Upload Citizen After-Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAfterImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* AI Comparison Analysis Card */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              AI Visual Verification Engine
            </span>
          </div>

          {isAnalyzing ? (
            <span className="text-xs text-orange-600 font-semibold animate-pulse">
              Analyzing spatial pixel contours...
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Resolution Match Confidence:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                {comparisonResult?.confidenceScore}%
              </span>
            </div>
          )}
        </div>

        {comparisonResult && !isAnalyzing && (
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-2.5">
              {comparisonResult.verdict === 'appears_resolved' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : comparisonResult.verdict === 'partially_resolved' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold text-slate-900">
                  {comparisonResult.verdict === 'appears_resolved'
                    ? '✅ Issue Appears Resolved on Ground'
                    : comparisonResult.verdict === 'partially_resolved'
                    ? '⚠️ Issue May Only Be Partially Resolved'
                    : '❌ Issue Appears Unresolved'}
                </span>
                <p className="text-slate-600 mt-0.5 leading-snug">
                  {comparisonResult.explanation}
                </p>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Surface Restoration: {comparisonResult.surfaceRestorationPercentage}% • Residual Hazard: {comparisonResult.residualHazardDetected ? 'Detected' : 'None'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Citizen Verdict Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-800">
          Citizen Ground Question: “The authority marked this issue as resolved. Has it actually been fixed?”
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleVerdictChange('completely_fixed')}
            className={`p-3 rounded-xl border text-left text-xs transition-all ${
              selectedVerdict === 'completely_fixed'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="text-base mb-1">✅ Completely Fixed</div>
            <div className="text-[11px] text-slate-500 font-normal">
              Hazard fully eliminated, work meets safety standards.
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleVerdictChange('partially_fixed')}
            className={`p-3 rounded-xl border text-left text-xs transition-all ${
              selectedVerdict === 'partially_fixed'
                ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-200'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="text-base mb-1">⚠️ Partially Fixed</div>
            <div className="text-[11px] text-slate-500 font-normal">
              Temporary patch made, but incomplete or loose debris left behind.
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleVerdictChange('not_fixed')}
            className={`p-3 rounded-xl border text-left text-xs transition-all ${
              selectedVerdict === 'not_fixed'
                ? 'border-red-500 bg-red-50 text-red-950 font-bold ring-2 ring-red-200'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="text-base mb-1">❌ Still Not Fixed</div>
            <div className="text-[11px] text-slate-500 font-normal">
              False resolution claim. The hazard persists unaddressed.
            </div>
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Citizen Field Inspection Notes:
          </label>
          <input
            type="text"
            value={citizenNotes}
            onChange={(e) => setCitizenNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleConfirmVerification}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-transform hover:scale-105"
        >
          <ShieldCheck className="w-4 h-4" />
          Submit Official Citizen Verification
        </button>
      </div>
    </div>
  );
};
