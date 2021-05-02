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

export const ACTIONS_TAKEN_GENERAL = [
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
  { name: 'Vehicle impounded', value: 22 },
]

export const ACTIONS_TAKEN_SEARCH = [
  { name: 'Asked for consent to search another person', value: 17 },
  { name: 'Search of person was conducted', value: 18 },
  { name: 'Asked for consent to search property', value: 19 },
  { name: 'Search of property was conducted', value: 20 },
]

export const BASIS_FOR_PROPERTY_SEIZURE = [
  { name: 'Safekeeping as allowed by law/statute', value: 1 },
  { name: 'Contraband', value: 2 },
  { name: 'Evidence', value: 3 },
  { name: 'Impound of vehicle', value: 4 },
  { name: 'Impound of vehicle', value: 5 },
]

export const PROPERTY_SEIZED_TYPES = [
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
