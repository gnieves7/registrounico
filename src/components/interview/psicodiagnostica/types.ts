export interface PsicodiagFormData {
  // I. Identification
  fullName: string;
  birthDate: string;
  age: string;
  gender: string;
  dni: string;
  nationality: string;
  maritalStatus: string;
  education: string;
  occupation: string;
  address: string;
  phone: string;
  email: string;
  insurance: string;
  referredBy: string;
  sessionDate: string;
  modality: string;
  encounterType: string;
  consentSigned: string;
  householdComposition: string;

  // II. Motivo
  motiveOwn: string;
  motiveProf: string;
  priorTherapy: string;
  priorTherapyType: string;
  psychiatric: string;
  medication: string;
  urgencySubj: string;
  urgencyObj: string;
  insight: string;
  motivation: string;

  // III. Historia
  earlyHistory: string;
  familyHistory: string;
  educationHistory: string;
  workHistory: string;
  relationshipHistory: string;
  traumaHistory: string;

  // IV. EEM
  eemAppearance: string;
  eemAttitude: string;
  eemConsciousness: string;
  eemAttention: string;
  eemSpeech: string;
  eemThoughtContent: string;
  eemPerception: string;
  eemMood: string;
  eemJudgment: string;
  eemSuicidal: string;

  // V. Áreas
  sleep: string;
  eating: string;
  sexuality: string;
  substances: string;
  socialNetwork: string;
  resources: string;

  // VI. Diagnóstico
  diagnosticHypothesis: string;
  diagnosticCode: string;
  evaluationPlan: string;
  recommendations: string;
  nextStep: string;
  followUpDate: string;
  observations: string;

  // Cierre
  professionalName: string;
  professionalLicense: string;
  signatureDate: string;
}

export const EMPTY_PSICODIAG: PsicodiagFormData = {
  fullName: "", birthDate: "", age: "", gender: "", dni: "", nationality: "",
  maritalStatus: "", education: "", occupation: "", address: "", phone: "",
  email: "", insurance: "", referredBy: "", sessionDate: "", modality: "",
  encounterType: "", consentSigned: "", householdComposition: "",
  motiveOwn: "", motiveProf: "", priorTherapy: "", priorTherapyType: "",
  psychiatric: "", medication: "", urgencySubj: "", urgencyObj: "",
  insight: "", motivation: "",
  earlyHistory: "", familyHistory: "", educationHistory: "", workHistory: "",
  relationshipHistory: "", traumaHistory: "",
  eemAppearance: "", eemAttitude: "", eemConsciousness: "", eemAttention: "",
  eemSpeech: "", eemThoughtContent: "", eemPerception: "", eemMood: "",
  eemJudgment: "", eemSuicidal: "",
  sleep: "", eating: "", sexuality: "", substances: "", socialNetwork: "",
  resources: "",
  diagnosticHypothesis: "", diagnosticCode: "", evaluationPlan: "",
  recommendations: "", nextStep: "", followUpDate: "", observations: "",
  professionalName: "", professionalLicense: "", signatureDate: "",
};