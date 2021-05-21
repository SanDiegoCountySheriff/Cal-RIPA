export const getOfficerYearsExperience = () => {
  const yearsExperience = localStorage.getItem('ripa_officer_years_experience')
  return +yearsExperience || null
}

export const getOfficerAssignment = () => {
  const assignment = localStorage.getItem('ripa_officer_assignment')
  return +assignment || null
}

export const getOfficerOtherType = () => {
  const otherType = localStorage.getItem('ripa_officer_other_type')
  return otherType || null
}
