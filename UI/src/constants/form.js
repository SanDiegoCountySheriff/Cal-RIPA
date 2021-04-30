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
  { name: 'Others', value: 10 },
]

export const DISABILITIES = [
  { name: 'None', value: '1' },
  { name: 'Deafness or difficulty hearing', value: '2' },
  { name: 'Speech impairment or limited use of language', value: '3' },
  { name: 'Blind or limited vision', value: '4' },
  { name: 'Mental health condition', value: '5' },
  {
    name: 'Intellectual or developmental disability, including dementia',
    value: '6',
  },
  { name: 'Other disability', value: '7' },
]

export const GENDERS = [
  { name: 'Male', value: '1' },
  { name: 'Female', value: '2' },
  { name: 'Transgender Male', value: '3' },
  { name: 'Transgender Female', value: '4' },
  { name: 'Gender Noncomforming', value: '5' },
]

export const LGBTS = [
  { name: 'Yes', value: 'A' },
  { name: 'No', value: 'B' },
]

export const RACES = [
  { name: 'Asian', value: '1' },
  { name: 'Black/African American', value: '2' },
  { name: 'Hispanic/Latino(a)', value: '3' },
  { name: 'Middle Eastern or South Asian', value: '4' },
  { name: 'Native American', value: '5' },
  { name: 'Pacific Islander', value: '6' },
  { name: 'White', value: '7' },
]

export const STOP_REASONS = [
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

export const TRAFFIC_VIOLATIONS = [
  { name: 'Moving Violation', value: '1A' },
  { name: 'Equipment Violation', value: '1B' },
  {
    name: 'Non-moving Violation, including Registration Violation',
    value: '1C',
  },
]

export const REASONABLE_SUSPICIONS = [
  { name: 'Officer witnessed commission of a crime', value: '2A' },
  { name: 'Matched suspect description', value: '2B' },
  {
    name: 'Witness or Victim identification of Suspect at the scene',
    value: '2C',
  },
  { name: 'Carrying Suspicious Object', value: '2D' },
  {
    name: 'Actions indicative of casing a victim or location',
    value: '2E',
  },
  { name: 'Suspected of Acting as Lookout', value: '2F' },
  { name: 'Actions indicative of drug transaction', value: '2G' },
  {
    name: 'Actions indicative of engaging in violent crime',
    value: '2H',
  },
  { name: 'Other Reasonable Suspicion of a crime', value: '2I' },
]
