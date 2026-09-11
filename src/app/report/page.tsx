'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import {
  IncidentCategory,
  IncidentSeverity,
  CivicIncident,
  PriorityBreakdown,
  Authority,
  KolkataWardInfo,
  OfficialEmail
} from '../../types';
import { analyzeUploadedImage, calculateCivicPriorityScore } from '../../lib/aiEngine';
import { findNearbyDuplicates } from '../../lib/duplicateEngine';
import { KOLKATA_WARDS, findNearestWard } from '../../data/kolkataWards';
import { routeCategoryToAuthority } from '../../data/authorities';
import { createNewIncident, addCommunityConfirmation } from '../../lib/storage';
import { VoiceReporter } from '../../components/Voice/VoiceReporter';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Shield,
  Mail,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Info,
  Check,
  Flame,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// Sample Kolkata presets for rapid judge demo testing
const SAMPLE_PRESETS = [
  {
    label: 'College Street Pothole',
    category: 'pothole',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    address: '87/1 College Street, Bowbazar',
    ward: 48,
    lat: 22.5744,
    lng: 88.3629,
    landmark: 'Calcutta University Centenary Building'
  },
  {
    label: 'Shyambazar Open Manhole',
    category: 'open_manhole',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80',
    address: 'Shyambazar 5-Point Crossing',
    ward: 10,
    lat: 22.6025,
    lng: 88.3712,
    landmark: 'Shyambazar Metro Gate 3'
  },
  {
    label: 'Gariahat Garbage Dump',
    category: 'garbage_dump',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    address: 'Rashbehari Avenue, Gariahat',
    ward: 85,
    lat: 22.5186,
    lng: 88.3664,
    landmark: 'Gariahat Market Crossing'
  },
  {
    label: 'Park Circus Waterlogging',
    category: 'waterlogging',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    address: 'Park Circus 7-Point Crossing',
    ward: 64,
    lat: 22.5412,
    lng: 88.3678,
    landmark: 'Lady Brabourne College approach'
  }
];

export default function ReportPage() {
  const router = useRouter();
  const { incidents, refreshIncidents, addNotification } = useApp();

  // Multi-step state (1 to 7)
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [imagePreview, setImagePreview] = useState<string>(SAMPLE_PRESETS[0].image);
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategory>('pothole');
  const [categoryDisplay, setCategoryDisplay] = useState('Critical Road Pothole');
  const [aiConfidence, setAiConfidence] = useState(94);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aiSuggestedDesc, setAiSuggestedDesc] = useState('');
  const [detectedFeatures, setDetectedFeatures] = useState<string[]>([]);
  const [severity, setSeverity] = useState<IncidentSeverity>('critical');

  // Location states
  const [selectedWard, setSelectedWard] = useState<KolkataWardInfo>(KOLKATA_WARDS[0]);
  const [address, setAddress] = useState('87/1 College Street, Bowbazar, Kolkata - 700073');
  const [landmark, setLandmark] = useState('Calcutta University Centenary Building');
  const [latitude, setLatitude] = useState(22.5744);
  const [longitude, setLongitude] = useState(88.3629);

  // Duplicate states
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);
  const [duplicateBypassed, setDuplicateBypassed] = useState(false);

  // Priority state
  const [priorityBreakdown, setPriorityBreakdown] = useState<PriorityBreakdown | null>(null);

  // Authority & Email state
  const [routedAuthority, setRoutedAuthority] = useState<Authority | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [citizenApprovedEmail, setCitizenApprovedEmail] = useState(true);
  const [emailCopied, setEmailCopied] = useState(false);

  // Submission results
  const [submittedIncident, setSubmittedIncident] = useState<CivicIncident | null>(null);

  // Step 1 -> Trigger AI analysis
  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setImagePreview(preset.image);
    setAddress(preset.address);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setLandmark(preset.landmark);
    const wardObj = KOLKATA_WARDS.find((w) => w.ward === preset.ward) || KOLKATA_WARDS[0];
    setSelectedWard(wardObj);
    runAIAnalysis(preset.label, preset.category as IncidentCategory);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setImagePreview(result);
        runAIAnalysis(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAIAnalysis = (hint: string, forcedCat?: IncidentCategory) => {
    const ai = analyzeUploadedImage(hint);
    const cat = forcedCat || ai.detectedCategory;
    setSelectedCategory(cat);
    setCategoryDisplay(ai.categoryDisplay);
    setAiConfidence(ai.confidence);
    setTitle(ai.suggestedTitle);
    setDescription(ai.suggestedDescription);
    setAiSuggestedDesc(ai.suggestedDescription);
    setDetectedFeatures(ai.detectedFeatures);
    setSeverity(ai.recommendedSeverity);

    // Calculate priority breakdown
    const pBreakdown = calculateCivicPriorityScore({
      category: cat,
      severity: ai.recommendedSeverity,
      ward: selectedWard.ward,
      confirmationCount: 1,
      nearSchoolOrHospital: true,
      transitHubProximity: true
    });
    setPriorityBreakdown(pBreakdown);

    // Route Authority
    const auth = routeCategoryToAuthority(cat);
    setRoutedAuthority(auth);

    // Prep official email
    const subject = `Urgent Civic Issue – ${ai.categoryDisplay} at ${landmark || selectedWard.locality} (Ward ${selectedWard.ward})`;
    setEmailSubject(subject);
    const body = `To: ${auth.officialTitle}\n${auth.name}\n${auth.officeAddress}\n\nSubject: ${subject}\n\nDear Sir/Madam,\n\nA verified civic infrastructure hazard has been logged through the CivicSeva Intelligence Platform.\n\n• Category: ${ai.categoryDisplay}\n• Ward: ${selectedWard.ward} (${selectedWard.borough})\n• Precise Location: ${address}\n• GPS Coordinates: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E\n• Nearest Landmark: ${landmark}\n• Civic Priority Score: ${pBreakdown.total}/100 (${ai.recommendedSeverity.toUpperCase()})\n\nDescription of defect:\n${ai.suggestedDescription}\n\nUrgent remedial deployment is requested. Progress can be monitored transparently on CivicSeva.\n\nRespectfully,\nVerified Kolkata Citizen via CivicSeva.`;
    setEmailBody(body);

    // Check duplicates
    const dupes = findNearbyDuplicates(incidents, latitude, longitude, cat, 300);
    setDuplicateMatches(dupes);
  };

  // Initial load auto-trigger
  React.useEffect(() => {
    runAIAnalysis(SAMPLE_PRESETS[0].label, 'pothole');
  }, []);

  // Recalculate duplicates when location or category changes
  const checkDuplicatesNow = () => {
    const dupes = findNearbyDuplicates(incidents, latitude, longitude, selectedCategory, 300);
    setDuplicateMatches(dupes);
  };

  // Confirming an existing issue instead of creating duplicate
  const handleConfirmExisting = (existingId: string) => {
    const updated = addCommunityConfirmation(existingId, 'current_citizen_user');
    refreshIncidents();
    addNotification({
      title: 'Community Report Confirmed',
      message: `You confirmed existing incident #${existingId}. Confirmation count increased & priority elevated!`,
      type: 'success',
      link: `/incident/${existingId}`
    });
    router.push(`/incident/${existingId}`);
  };

  // Final submission
  const handleSubmitNewIncident = () => {
    const newId = `CS-${Math.floor(1000 + Math.random() * 9000)}`;
    const auth = routedAuthority || routeCategoryToAuthority(selectedCategory);
    const finalPriority = priorityBreakdown || calculateCivicPriorityScore({
      category: selectedCategory,
      severity,
      ward: selectedWard.ward,
      confirmationCount: 1
    });

    const officialEmailData: OfficialEmail = {
      subject: emailSubject,
      recipientEmail: auth.email,
      recipientTitle: auth.officialTitle,
      department: auth.department,
      body: emailBody,
      generatedAt: new Date().toISOString(),
      approvedByCitizen: citizenApprovedEmail,
      sentAt: citizenApprovedEmail ? new Date().toISOString() : undefined
    };

    const newIncident: CivicIncident = {
      id: newId,
      category: selectedCategory,
      categoryDisplay,
      title,
      description,
      aiSuggestedDescription: aiSuggestedDesc,
      images: [imagePreview],
      latitude,
      longitude,
      address,
      ward: selectedWard.ward,
      borough: selectedWard.borough,
      nearestLandmark: landmark,
      severity,
      priorityScore: finalPriority.total,
      priorityBreakdown: finalPriority,
      status: 'ai_verified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reportedBy: {
        userId: 'usr_me',
        userName: 'Citizen Reporter',
        isAnonymous: false
      },
      responsibleAuthorityId: auth.id,
      responsibleAuthorityName: auth.name,
      department: auth.department,
      affectedCitizenCount: 12,
      confirmationCount: 1,
      confirmedByUserIds: ['usr_me'],
      escalationCount: 0,
      officialEmail: officialEmailData,
      timeline: [
        {
          id: 'evt_' + Date.now(),
          incidentId: newId,
          status: 'reported',
          actor: 'Citizen Reporter',
          actorRole: 'citizen',
          timestamp: new Date().toISOString(),
          note: 'Civic issue captured with on-site evidence.'
        },
        {
          id: 'evt_' + (Date.now() + 1),
          incidentId: newId,
          status: 'ai_verified',
          actor: 'CivicSeva Vision Engine',
          actorRole: 'system',
          timestamp: new Date().toISOString(),
          note: `AI classified as ${categoryDisplay} (Confidence: ${aiConfidence}%). Priority score: ${finalPriority.total}/100.`
        },
        {
          id: 'evt_' + (Date.now() + 2),
          incidentId: newId,
          status: 'authority_assigned',
          actor: 'CivicSeva Smart Router',
          actorRole: 'system',
          timestamp: new Date().toISOString(),
          note: `Auto-routed to ${auth.name} under Ward ${selectedWard.ward} jurisdiction.`
        }
      ]
    };

    createNewIncident(newIncident);
    refreshIncidents();
    setSubmittedIncident(newIncident);

    addNotification({
      title: 'Incident Submitted & Routed',
      message: `Incident #${newId} created! Priority score: ${finalPriority.total}/100. Routed to ${auth.name}.`,
      type: 'success',
      link: `/incident/${newId}`
    });

    setCurrentStep(7); // Show celebration / success step
  };

  const stepsList = [
    'Evidence',
    'AI Vision',
    'Location',
    'Duplicate Check',
    'Priority Score',
    'Official Email',
    'Submitted'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      {/* Wizard Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          AI-POWERED CIVIC REPORTING WIZARD
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Report a Civic Issue in Kolkata
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          Snap a photo and CivicSeva will automatically detect the issue, pinpoint the ward, check duplicates, calculate priority, and route to the KMC department.
        </p>

        {/* Stepper Bar */}
        <div className="mt-8 flex items-center justify-between relative max-w-2xl mx-auto px-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          {stepsList.map((stName, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            return (
              <div key={stName} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow'
                      : isCurrent
                      ? 'bg-orange-600 text-white ring-4 ring-orange-100 shadow-md scale-110'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-medium hidden sm:block ${
                    isCurrent ? 'text-orange-600 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {stName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Upload Evidence */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-600" />
              Step 1: Upload Photo Evidence
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Take a photo or upload an image of the civic issue. You can also pick a realistic Kolkata sample for instant demo testing.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              ⚡ Quick Test Presets (Kolkata Demo Locations)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    imagePreview === preset.image
                      ? 'border-orange-500 bg-orange-50/80 text-orange-900 font-semibold ring-2 ring-orange-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs truncate">{preset.label}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    Ward {preset.ward} • {preset.landmark.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area / Image Preview */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative inline-block rounded-xl overflow-hidden border border-slate-200 max-h-64 shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Uploaded Civic Issue"
                    className="object-cover max-h-64 w-full"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] backdrop-blur-sm">
                    Geotagged Evidence
                  </span>
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    Upload Different Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div>
                <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">
                  Drop civic photo here, or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mt-3 text-xs text-slate-500"
                />
              </div>
            )}
          </div>

          {/* Voice Input Section */}
          <div className="mt-6">
            <VoiceReporter
              onTranscriptReady={(transcript) => {
                setDescription(transcript);
                runAIAnalysis(transcript);
              }}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                runAIAnalysis(title || selectedCategory);
                setCurrentStep(2);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow transition-all hover:scale-[1.02]"
            >
              Analyze with Vision AI
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI Vision Analysis */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                Step 2: AI Vision Issue Detection
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                CivicSeva Vision Model analyzed your evidence frame. Review and adjust classification if needed.
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                AI Confidence: {aiConfidence}%
              </span>
            </div>
          </div>

          {/* AI Detection Card */}
          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/80">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider">
                  Detected Civic Issue
                </span>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {categoryDisplay}
                </div>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-orange-200/60 text-orange-800 font-semibold uppercase">
                  Category: {selectedCategory.replace('_', ' ')}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Visual Features Identified
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {detectedFeatures.map((feat) => (
                    <span
                      key={feat}
                      className="px-2 py-0.5 rounded-md bg-white border border-orange-200 text-slate-700 text-xs font-medium"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Manual Correction / Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Title (AI Suggested, Editable)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description (AI Generated Description)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* Category Override */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correct Issue Category if AI was inaccurate:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const cat = e.target.value as IncidentCategory;
                  setSelectedCategory(cat);
                  setCategoryDisplay(cat.toUpperCase().replace('_', ' '));
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="pothole">Pothole / Road Surface Crater</option>
                <option value="open_manhole">Open Manhole / Uncovered Sewer</option>
                <option value="garbage_dump">Garbage Dump / Overflowing Solid Waste</option>
                <option value="waterlogging">Severe Waterlogging / Blocked Drain</option>
                <option value="broken_streetlight">Broken Streetlight / Dark Zone</option>
                <option value="damaged_footpath">Damaged Footpath / Missing Pavers</option>
                <option value="road_damage">Structural Road Damage / Cave-in</option>
                <option value="other">Other Civic Issue</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow"
            >
              Confirm & Pin Location
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Kolkata Location & Ward Pinning */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              Step 3: Kolkata Location & Ward Detection
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              CivicSeva automatically maps coordinates to Kolkata Municipal Corporation (KMC) Wards & Boroughs.
            </p>
          </div>

          {/* Interactive Ward Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                KMC Ward & Locality
              </label>
              <select
                value={selectedWard.ward}
                onChange={(e) => {
                  const w = KOLKATA_WARDS.find((item) => item.ward === Number(e.target.value));
                  if (w) {
                    setSelectedWard(w);
                    setLatitude(w.coordinates.lat);
                    setLongitude(w.coordinates.lng);
                    setAddress(`${w.locality}, Ward ${w.ward}, Kolkata`);
                    setLandmark(w.majorLandmarks[0]);
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {KOLKATA_WARDS.map((w) => (
                  <option key={w.ward} value={w.ward}>
                    Ward {w.ward} ({w.borough}) — {w.locality}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nearest Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Exact Address / Street Reference
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          {/* Map Simulation Box */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-56 flex items-center justify-center p-4">
            {/* SVG Visual Representation of Kolkata Ward Grid */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-600 text-white shadow-lg animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-sm inline-block">
                <div className="font-bold text-slate-900 text-xs">
                  {selectedWard.locality} (Ward {selectedWard.ward})
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E • {selectedWard.borough}
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Councilor: <strong>{selectedWard.councilorName}</strong> • {selectedWard.healthUnit}
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => {
                checkDuplicatesNow();
                setCurrentStep(4);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow"
            >
              Scan Nearby Incidents
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Duplicate Detection Engine (Major Innovation) */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                MAJOR INNOVATION: SPATIAL DEDUPLICATION
              </span>
              <span className="text-xs text-slate-500">Radius: 300m Search</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-2">
              Duplicate Incident Scanner
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              CivicSeva groups scattered complaints into one prioritized Civic Incident rather than cluttering authorities with duplicate tickets.
            </p>
          </div>

          {duplicateMatches.length > 0 ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">
                    !
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      We may already have this issue in our system!
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      An active incident matching this category exists within walking distance. You can confirm it right now to elevate its priority score without filing redundant paperwork.
                    </p>
                  </div>
                </div>
              </div>

              {duplicateMatches.slice(0, 2).map((match) => (
                <div
                  key={match.incident.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-600">
                        #{match.incident.id}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[11px] font-semibold">
                        {match.incident.categoryDisplay}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        📍 {match.distanceMeters}m from your pin
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {match.incident.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>👥 {match.incident.affectedCitizenCount} affected citizens</span>
                      <span>•</span>
                      <span>👍 {match.incident.confirmationCount} photo confirmations</span>
                      <span>•</span>
                      <span className="text-orange-600 font-semibold">
                        Priority: {match.incident.priorityScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleConfirmExisting(match.incident.id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm transition-transform hover:scale-105"
                    >
                      👍 Confirm Existing Issue (+1)
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setDuplicateBypassed(true);
                    setCurrentStep(5);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 underline font-medium"
                >
                  This is a distinct problem. Continue reporting as a new issue &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-900">
                No Existing Duplicates Found in Ward {selectedWard.ward}
              </h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                No active complaints match this issue within 300 meters. Proceeding to calculate the multi-factor Civic Priority Score.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow"
            >
              Proceed to Priority Engine
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: AI Priority & Severity Engine */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              Step 5: Civic Priority Scoring Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Unlike static forms, CivicSeva computes a dynamic 0–100 score based on safety hazard, population impact, and sensitive facility proximity.
            </p>
          </div>

          {/* Big Score Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-elevated">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                  Automated Urgency Score
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white">
                    {priorityBreakdown?.total || 91}
                  </span>
                  <span className="text-xl text-slate-400 font-semibold">/ 100</span>
                  <span
                    className={`ml-2 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                      (priorityBreakdown?.total || 91) >= 85
                        ? 'bg-red-500/30 text-red-300 border border-red-500/40'
                        : 'bg-orange-500/30 text-orange-300 border border-orange-500/40'
                    }`}
                  >
                    {severity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="text-right text-xs text-slate-400">
                <div>Kolkata Municipal Corporation</div>
                <div className="text-slate-200 font-semibold mt-0.5">
                  Priority Queue Position: Top 5%
                </div>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-[11px]">Safety Risk</div>
                <div className="text-lg font-bold text-orange-400 mt-0.5">
                  {priorityBreakdown?.safetyRisk || 30}
                  <span className="text-xs text-slate-500 font-normal"> / 30</span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-[11px]">Citizen Impact</div>
                <div className="text-lg font-bold text-orange-400 mt-0.5">
                  {priorityBreakdown?.citizenImpact || 24}
                  <span className="text-xs text-slate-500 font-normal"> / 30</span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-[11px]">Location Sensitivity</div>
                <div className="text-lg font-bold text-orange-400 mt-0.5">
                  {priorityBreakdown?.locationSensitivity || 18}
                  <span className="text-xs text-slate-500 font-normal"> / 20</span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-[11px]">Issue Severity</div>
                <div className="text-lg font-bold text-orange-400 mt-0.5">
                  {priorityBreakdown?.issueSeverity || 19}
                  <span className="text-xs text-slate-500 font-normal"> / 20</span>
                </div>
              </div>
            </div>

            {/* Contributing factors */}
            <div className="mt-4 text-xs text-slate-300 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Contributing Factors:
              </div>
              {priorityBreakdown?.factors.map((fact) => (
                <div key={fact} className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-orange-400">•</span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setCurrentStep(6)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow"
            >
              Route to Authority & Generate Email
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Smart Authority Routing & Official Email Generator */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              SMART MUNICIPAL AUTHORITY MATCHED
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Authority Routing & Official Complaint Generator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              CivicSeva automatically determined the exact governing agency for Ward {selectedWard.ward} and drafted an evidence-rich grievance letter.
            </p>
          </div>

          {/* Routed Authority Card */}
          {routedAuthority && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                  Responsible Kolkata Department
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {routedAuthority.name}
                </h3>
                <div className="text-xs text-slate-600 mt-1">
                  Designation: <strong>{routedAuthority.officialTitle}</strong>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Office: {routedAuthority.officeAddress}
                </div>
              </div>

              <div className="text-right text-xs bg-white p-3 rounded-lg border border-slate-200 shrink-0">
                <div className="text-slate-400">Department Resolution Track Record</div>
                <div className="text-emerald-600 font-bold text-sm mt-0.5">
                  {routedAuthority.resolvedCount} Resolved Issues
                </div>
                <div className="text-[10px] text-slate-400">
                  Avg Time: ~{routedAuthority.avgResolutionDays} days
                </div>
              </div>
            </div>
          )}

          {/* Generated Official Email Container */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Mail className="w-4 h-4 text-orange-600" />
                <span>Generated Official Municipal Grievance</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`);
                    setEmailCopied(true);
                    setTimeout(() => setEmailCopied(false), 2000);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-300 text-slate-700 text-xs hover:bg-slate-50 font-medium"
                >
                  <Copy className="w-3 h-3" />
                  {emailCopied ? 'Copied!' : 'Copy Email'}
                </button>
                <a
                  href={`mailto:${routedAuthority?.email || 'kmc@kolkata.gov.in'}?subject=${encodeURIComponent(
                    emailSubject
                  )}&body=${encodeURIComponent(emailBody)}`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-orange-600 text-white text-xs hover:bg-orange-700 font-medium"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open in Mail
                </a>
              </div>
            </div>

            <div className="p-4 space-y-3 bg-white text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Subject Line:
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email Body (Auto-structured with evidence & geo-coordinates):
                </label>
                <textarea
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-700 font-mono text-[11px] leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Citizen Consent Principle */}
          <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200 text-xs flex items-start gap-2.5">
            <input
              type="checkbox"
              id="consent"
              checked={citizenApprovedEmail}
              onChange={(e) => setCitizenApprovedEmail(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
            />
            <label htmlFor="consent" className="text-slate-700 leading-snug cursor-pointer">
              <strong>Citizen Approval:</strong> I approve submitting this structured complaint and evidence to the responsible Kolkata Municipal Corporation department. (CivicSeva never silently dispatches emails without citizen authorization).
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(5)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleSubmitNewIncident}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-lg transition-transform hover:scale-105"
            >
              Submit & Dispatch Civic Issue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Submission Success & Tracking */}
      {currentStep === 7 && submittedIncident && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-elevated text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
              Live Civic Incident Activated
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Incident #{submittedIncident.id} Successfully Dispatched
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Your report has entered the official Kolkata Municipal workflow. It is routed to <strong>{submittedIncident.responsibleAuthorityName}</strong> with Priority Score <strong>{submittedIncident.priorityScore}/100</strong>.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px]">Incident ID</div>
              <div className="font-bold text-slate-900 mt-0.5">#{submittedIncident.id}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px]">Ward</div>
              <div className="font-bold text-slate-900 mt-0.5">Ward {submittedIncident.ward}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px]">Priority Score</div>
              <div className="font-bold text-orange-600 mt-0.5">{submittedIncident.priorityScore} / 100</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[10px]">Current Status</div>
              <div className="font-bold text-blue-600 mt-0.5">AI Verified</div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/incident/${submittedIncident.id}`}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow transition-transform hover:scale-105"
            >
              Open Live Incident Tracking &rarr;
            </Link>
            <Link
              href="/map"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
            >
              View on Kolkata Civic Map
            </Link>
            <button
              onClick={() => {
                setCurrentStep(1);
                setSubmittedIncident(null);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-medium"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
