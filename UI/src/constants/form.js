export const OFFICER_ASSIGNMENTS = [
  { name: 'Patrol, traffic enforcement, field operations', value: 1 },
  { name: 'Gang enforcement', value: 2 },
  { name: 'Compliance check', value: 3 },
  { name: 'Special events', value: 4 },
  { name: 'Roadblock or DUI sobriety checkpoint', value: 5 },
  { name: 'Narcotics/vice', value: 6 },
  { name: 'Task force', value: 7 },
  { name: 'K-12 public school', value: 8 },
  { name: 'Investigative/detective', value: 9 },
  { name: 'Other', value: 10 },
]

export const DURATIONS = [
  { name: '0 - 10', value: 1 },
  { name: '11 - 20', value: 2 },
  { name: '21 - 30', value: 3 },
  { name: '31 - 60', value: 4 },
  { name: '60+', value: 5 },
]

export const AGES = [
  { name: '0 - 10', value: 1 },
  { name: '11 - 20', value: 2 },
  { name: '21 - 30', value: 3 },
  { name: '31 - 60', value: 4 },
  { name: '60+', value: 5 },
]

export const DISABILITIES = [
  {
    name: 'Disability related to hyperactivity or impulsive behavior',
    value: 7,
  },
  { name: 'Deafness or difficulty hearing', value: 1 },
  { name: 'Speech impairment or limited use of language', value: 2 },
  { name: 'Blind or limited vision', value: 3 },
  { name: 'Mental health condition', value: 4 },
  {
    name: 'Intellectual or developmental disability, including dementia',
    value: 5,
  },
  { name: 'Other disability', value: 6 },
]

export const GENDERS = [
  { name: 'Male', value: 1 },
  { name: 'Female', value: 2 },
  { name: 'Transgender Male', value: 3 },
  { name: 'Transgender Female', value: 4 },
]

export const RACES = [
  { name: 'Asian', value: 1 },
  { name: 'Black/African American', value: 2 },
  { name: 'Hispanic/Latino(a)', value: 3 },
  { name: 'Middle Eastern or South Asian', value: 4 },
  { name: 'Native American', value: 5 },
  { name: 'Pacific Islander', value: 6 },
  { name: 'White', value: 7 },
]

export const STOP_REASONS = [
  {
    name: 'Possible conduct warranting discipline under Education Code sections 48900, 48900.2, 48900.3, 48900.4 and 48900.7',
    value: 7,
  },
  { name: 'Determine whether the student violated school policy', value: 8 },
  { name: 'Traffic Violation', value: 1 },
  { name: 'Reasonable Suspicion', value: 2 },
  {
    name: 'Known to be on Parole / Probation / PRCS / Mandatory Supervision',
    value: 3,
  },
  {
    name: 'Knowledge of outstanding arrest warrant/wanted person',
    value: 4,
  },
  {
    name: 'Investigation to determine whether the person was truant',
    value: 5,
  },
  { name: 'Consensual Encounter resulting in a search', value: 6 },
]

export const EDUCATION_VIOLATIONS = [
  { name: '48900 - Suspension or expulsion (select subsection)', value: 1 },
  { name: '48900.2 - Suspension or expulsion for sexual harassment', value: 2 },
  {
    name: '48900.3 - Suspension or expulsion for hate violence',
    value: 3,
  },
  {
    name: '48900.4 - Suspension or expulsion for harassment, threats or intimidation',
    value: 4,
  },
  {
    name: '48900.7 - Suspension or expulsion for terroristic threats',
    value: 5,
  },
]

export const TRAFFIC_VIOLATIONS = [
  { name: 'Moving Violation', value: 1 },
  { name: 'Equipment Violation', value: 2 },
  {
    name: 'Non-moving Violation, including Registration Violation',
    value: 3,
  },
]

export const REASONABLE_SUSPICIONS = [
  { name: 'Officer witnessed commission of a crime', value: 1 },
  { name: 'Matched suspect description', value: 2 },
  {
    name: 'Witness or Victim identification of Suspect at the scene',
    value: 3,
  },
  { name: 'Carrying Suspicious Object', value: 4 },
  {
    name: 'Actions indicative of casing a victim or location',
    value: 5,
  },
  { name: 'Suspected of Acting as Lookout', value: 6 },
  { name: 'Actions indicative of drug transaction', value: 7 },
  {
    name: 'Actions indicative of engaging in violent crime',
    value: 8,
  },
  { name: 'Other Reasonable Suspicion of a crime', value: 9 },
]

export const ACTIONS_TAKEN = [
  { name: 'Admission or written statement obtained from student', value: 23 },
  { name: 'Person removed from vehicle by order', value: 1 },
  { name: 'Person removed from vehicle by physical contact', value: 2 },
  { name: 'Field sobriety test conducted', value: 3 },
  { name: 'Curbside detention', value: 4 },
  { name: 'Handcuffed or flex cuffed', value: 5 },
  { name: 'Patrol car detention', value: 6 },
  { name: 'Canine removed from vehicle or used to search', value: 7 },
  { name: 'Firearm pointed at person', value: 8 },
  { name: 'Firearm discharged or used', value: 9 },
  { name: 'Electronic control device used', value: 10 },
  { name: 'Impact projectile discharged or used', value: 11 },
  { name: 'Canine bit or held person', value: 12 },
  { name: 'Baton or other impact weapon used', value: 13 },
  { name: 'Chemical spray used', value: 14 },
  { name: 'Physical or vehicle contact', value: 15 },
  { name: 'Personal photographed', value: 16 },
  { name: 'Asked for consent to search another person', value: 17 },
  { name: 'Search of person was conducted', value: 18 },
  { name: 'Asked for consent to search property', value: 19 },
  { name: 'Search of property was conducted', value: 20 },
  { name: 'Vehicle impounded', value: 22 },
]

export const BASIS_FOR_SEARCH = [
  { name: 'Suspected violation of school policy', value: 13 },
  { name: 'Consent given', value: 1 },
  { name: 'Officer safety/safety of others', value: 2 },
  { name: 'Search warrant', value: 3 },
  {
    name: 'Condition of parole / probation/ PRCS / mandatory supervision',
    value: 4,
  },
  { name: 'Suspected weapons', value: 5 },
  { name: 'Visible contraband', value: 6 },
  { name: 'Odor of contraband', value: 7 },
  { name: 'Canine detection', value: 8 },
  { name: 'Evidence of crime', value: 9 },
  { name: 'Incident to arrest', value: 10 },
  { name: 'Exigent circumstances/emergency', value: 11 },
  { name: 'Vehicle inventory', value: 12 },
]

export const BASIS_FOR_PROPERTY_SEIZURE = [
  { name: 'Safekeeping as allowed by law/statute', value: 1 },
  { name: 'Contraband', value: 2 },
  { name: 'Evidence', value: 3 },
  { name: 'Impound of vehicle', value: 4 },
  { name: 'Abandoned property', value: 5 },
]

export const CONTRABAND_TYPES = [
  { name: 'Firearm(s)', value: 2 },
  { name: 'Ammunition', value: 3 },
  { name: 'Weapon(s) other than a firearm', value: 4 },
  { name: 'Drugs/narcotics', value: 5 },
  { name: 'Alcohol', value: 6 },
  { name: 'Money', value: 7 },
  { name: 'Drug paraphernalia', value: 8 },
  { name: 'Suspected stolen property', value: 9 },
  { name: 'Cell phone(s) or electronic device(s)', value: 10 },
  { name: 'Vehicle', value: 11 },
  { name: 'Other contraband or evidence', value: 12 },
]

export const SEIZED_PROPERTY_TYPES = [
  { name: 'Firearm(s)', value: 1 },
  { name: 'Ammunition', value: 2 },
  { name: 'Weapon(s) other than a firearm', value: 3 },
  { name: 'Drugs/narcotics', value: 4 },
  { name: 'Alcohol', value: 5 },
  { name: 'Money', value: 6 },
  { name: 'Drug paraphernalia', value: 7 },
  { name: 'Suspected stolen property', value: 8 },
  { name: 'Cell phone(s) or electronic device(s)', value: 9 },
  { name: 'Vehicle', value: 10 },
  { name: 'Other contraband or evidence', value: 11 },
]

export const STOP_RESULTS = [
  { name: 'Referral to school administrator', value: 12 },
  { name: 'Referral to school counselor or other support staff', value: 13 },
  { name: 'Warning (verbal or written)', value: 2 },
  { name: 'Citation for infraction', value: 3 },
  { name: 'In-field cite and release', value: 4 },
  { name: 'Custodial Arrest pursuant to outstanding warrant', value: 5 },
  { name: 'Custodial Arrest without warrant', value: 6 },
  { name: 'Field interview card completed', value: 7 },
  { name: 'Psychiatric hold', value: 10 },
  { name: 'Noncriminal transport or caretaking transport', value: 8 },
  {
    name: 'Contacted parent/legal guardian or other person responsible for the minor',
    value: 9,
  },
  { name: 'Contacted U.S. Department of Homeland Security', value: 10 },
]

export const EDUCATION_CODE_SECTIONS = [
  {
    fullName: '48900(a)(1) - Caused/ attempted/ threatened to cause injury',
    code: 1,
  },
  {
    fullName: '48900(a)(2) - Used force or violence upon person',
    code: 2,
  },
  {
    fullName:
      '48900(b) - Possessed/sold/furnished a firearm, knife, explosive, etc',
    code: 3,
  },
  {
    fullName:
      '48900(c) - Possessed/used/sold/furnished/under influence of intoxicant',
    code: 4,
  },
  {
    fullName: '48900(d) - Offered/arranged/negotiated to sell an intoxicant',
    code: 5,
  },
  {
    fullName: '48900(e) - Committed or attempted to commit robbery/extortion',
    code: 6,
  },
  {
    fullName: '48900(f) - Caused or attempted to cause damage to property',
    code: 7,
  },
  {
    fullName: '48900(g) - Stole or attempted to steal property',
    code: 8,
  },
  {
    fullName: '48900(h) - Possessed or used tobacco, or nicotine products',
    code: 9,
  },
  {
    fullName: '48900(i) - Committed an obscene act or engaged in profanity',
    value: 10,
  },
  {
    fullName:
      '48900(j) - Possess/offer/arrange/negotiate to sell drug paraphernalia',
    code: 11,
  },
  {
    fullName:
      '48900(k)(1) - Disrupted activities or willfully defied authority',
    code: 12,
  },
  {
    fullName: '48900(l) - Knowingly received stolen property',
    code: 13,
  },
  {
    fullName: '48900(m) - Possessed an imitation firearm',
    code: 14,
  },
  {
    fullName: '48900(n) - Commit/attempt sexual assault or sexual battery',
    code: 15,
  },
  {
    fullName: '48900(o) - Harassed, threatened, or intimidated a witness',
    code: 16,
  },
  {
    fullName: '48900(p) - Offered/arranged/negotiated to sell, or sold Soma',
    code: 17,
  },
  {
    fullName: '48900(q) - Engaged in, or attempted hazing',
    code: 18,
  },
  {
    fullName: '48900(r) - Engaged in bullying',
    code: 19,
  },
]
