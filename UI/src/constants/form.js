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

export const AGES = [
  { name: '0 - 10', value: 1 },
  { name: '11 - 20', value: 2 },
  { name: '21 - 30', value: 3 },
  { name: '31 - 60', value: 4 },
  { name: '60+', value: 5 },
]

export const DISABILITIES = [
  { name: 'None', value: 0 },
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
  { name: 'Gender Noncomforming', value: 5 },
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
