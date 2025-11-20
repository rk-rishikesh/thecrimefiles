import caseData from '../../data/case.json';

export interface CaseData {
  caseName: string;
  reportHeading: string;
  caseNumber: string;
  firNumber: string;
  victimDetails: string;
  caseReport: string;
  suspects: Array<{
    name: string;
    age: number;
    occupation: string;
    relationship?: string;
    status: string;
    oneLiner: string;
    description: string;
    motive: string;
    alibi: string;
    timeline: string[];
    notes: string[];
    relatedEvidence?: string[];
    systemPrompt: string;
  }>;
  timeline: Array<{
    time: string;
    event: string;
    notes: string;
  }>;
  evidences: Array<{
    name: string;
    description: string;
    fullDescription: string;
    image?: string;
    type: string;
    status: string;
    collectedDate: string;
    collectedTime: string;
    foundAt?: string;
    relatedTo?: string;
    id?: string;
  }>;
}

export function getCaseData(): CaseData {
  return caseData as CaseData;
}

export function getSuspectById(id: number) {
  const data = getCaseData();
  return data.suspects[id - 1] || null;
}

export function getEvidenceById(id: string) {
  const data = getCaseData();
  // If id is numeric, use index; otherwise search by name or id field
  const index = parseInt(id);
  if (!isNaN(index)) {
    return data.evidences[index - 1] || null;
  }
  return data.evidences.find(ev => ev.id === id || ev.name === id) || null;
}

