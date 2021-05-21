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

export const setOfficer = officer => {
  localStorage.setItem('ripa_officer_years_experience', officer.yearsExperience)
  localStorage.setItem('ripa_officer_assignment', officer.assignment)
  localStorage.setItem('ripa_officer_other_type', officer.otherType)
}

export const isValidOfficer = () => {
  const yearsExperience = getOfficerYearsExperience()
  const assignment = getOfficerAssignment()
  const otherType = getOfficerOtherType()
  const isValidYearsExperience = yearsExperience
  const isValidAssignment = assignment
  let isValidOtherType = false
  if (assignment && assignment === 10) {
    isValidOtherType = otherType && otherType.length > 0
  }
  if (assignment && assignment !== 10) {
    isValidOtherType = true
  }

  return isValidYearsExperience && isValidAssignment && isValidOtherType
}
