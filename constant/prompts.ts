import { CaseData } from '../app/lib/caseData';

interface Suspect {
    name: string;
    age: number;
    occupation: string;
    relationship?: string;
    status: string;
    description: string;
    motive: string;
    alibi: string;
    timeline: string[];
    notes: string[];
    systemPrompt: string;
}

export function buildSuspectPrompt(suspect: Suspect, caseData: CaseData): string {
    // Build case overview section
    const caseOverview = `
CASE OVERVIEW:
Case Name: ${caseData.caseName}
Case Number: ${caseData.caseNumber}
FIR Number: ${caseData.firNumber}

VICTIM DETAILS:
${caseData.victimDetails}

CASE REPORT:
${caseData.caseReport}
`.trim();

    // Build timeline section
    const timelineSection = caseData.timeline
        .map((entry) => `- ${entry.time}: ${entry.event} (${entry.notes})`)
        .join('\n');

    const caseTimeline = `
CASE TIMELINE:
${timelineSection}
`.trim();

    // Build evidence section
    const evidenceSection = caseData.evidences
        .map(
            (evidence) =>
                `- ${evidence.name} (${evidence.type}): ${evidence.fullDescription}`
        )
        .join('\n');

    const evidenceList = `
EVIDENCE:
${evidenceSection}
`.trim();

    // Build suspect's own information section
    const suspectTimeline = suspect.timeline
        .map((entry) => `- ${entry}`)
        .join('\n');

    const suspectNotes = suspect.notes
        .map((note) => `- ${note}`)
        .join('\n');

    const suspectInfo = `
YOUR INFORMATION:
Name: ${suspect.name}
Age: ${suspect.age}
Occupation: ${suspect.occupation}
${suspect.relationship ? `Relationship to Victim: ${suspect.relationship}` : ''}
Status: ${suspect.status}
Description: ${suspect.description}
Motive: ${suspect.motive}
Alibi: ${suspect.alibi}

YOUR TIMELINE:
${suspectTimeline}

INVESTIGATION NOTES ABOUT YOU:
${suspectNotes}
`.trim();

    // Combine everything with personality prompt
    const fullPrompt = `
${caseOverview}

${caseTimeline}

${evidenceList}

${suspectInfo}

IMPORTANT CONTEXT:
- You are being interrogated by a detective investigating this case.
- You have full knowledge of the case details above, but you do NOT know details about other suspects (only general information that might be public knowledge).
- You must respond as ${suspect.name} would, following your personality and background.
- You will deny any involvement in the murder, but you may reveal information about yourself, your relationship with the victim, and your knowledge of the case.
- Stay in character and respond naturally to questions.

${suspect.systemPrompt}
`.trim();

    return fullPrompt;
}
