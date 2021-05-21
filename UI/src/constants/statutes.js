export const STATUTES = [
  {
    statuteID: '999.226.1',
    level1: [
      {
        id: 'a',
        text: 'The data elements regarding stops that shall be collected by peace officers subject to this chapter are defined as follows:',
        level2: [
          {
            id: '1',
            text: "'ORI number' is the data element that refers to the reporting agency’s Originating Agency Identifier, a unique identification code number assigned by the Federal Bureau of Investigation.",
          },
          {
            id: '2',
            text: 'Date, Time, and Duration of Stop',
            level3: [
              {
                id: 'A',
                text: "'Date of Stop' refers to the year, month, and day when the stop occurred. It shall be recorded as the date on which the stop began. If the stop extends over two days (e.g., if a stop began at 2330 hours on January 1st and concluded at 0030 hours on January 2nd), the 'Date of Stop' should be recorded as the first date (in this example, January 1st).",
              },
              {
                id: 'B',
                text: "'Time of Stop' refers to the approximate time that the stop began and shall be recorded using a 24-hour clock (i.e., military time).",
              },
              {
                id: 'C',
                text: "'Duration of Stop' is the approximate length of the stop measured from the time the reporting officer, or any other officer, first detains or, if no initial detention, first searches the stopped person until the time when the person is free to leave or taken into physical custody. In reporting this data element, the officer shall enter the approximate length of the stop in minutes.",
              },
              {
                id: 'example',
                level4: [
                  {
                    id: '1',
                    text: "Example: Officer A stops a vehicle for suspected driving under the influence (DUI) at 1300 hours. Officer B then arrives at the scene 15 minutes later and conducts a field sobriety test on the driver, who fails the tests. Officer B then arrests and takes the driver into custody at 1345. 'Duration of Stop' would be reported as 45 minutes.",
                  },
                  {
                    id: '2',
                    text: "Example: Officer A begins interviewing witnesses to a robbery at 1100 hours. After approximately 30 minutes of interviews with different witnesses, Officer A observes what looks like a switchblade knife protruding from the waistband of one of the witnesses. Officer A then searches that person. 'Duration of Stop' is measured from the time the person is searched (1130 hours) and not the time during which the officer began interviewing the witnesses to the robbery (1100 hours).",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    statuteID: '999.226',
    level1: [
      {
        id: '3',
        text: "'Location of Stop' refers to the physical location where the stop took place and shall be reported as follows:",
        level2: [
          {
            id: 'A',
            text: 'The officer shall report one of the following options, which are provided in order of preference:',
            level3: [
              {
                id: '1',
                text: 'Block number and street name',
              },
              {
                id: '2',
                text: 'Closest intersection; or',
              },
              {
                id: '3',
                text: 'Highway and closest highway exit.',
              },
              {
                id: '4',
                text: 'If none of these options are applicable, the officer may report a road marker, landmark, or other description, except that the officer shall not provide a street address if the location is a residence.',
              },
            ],
          },
          {
            id: 'B',
            text: 'The officer shall report the city. To ensure uniformity, the Department shall provide a list of cities within the State of California.',
          },
        ],
      },
    ],
  },
  {
    statuteID: '999.226.3',
    level1: [
      {
        id: '4',
        text: "'Perceived Race or Ethnicity of Person Stopped' refers to the officer’s perception of the race or ethnicity of the person stopped. When reporting this data element, the officer shall make his or her determination of the person’s race or ethnicity based on personal observation only. The officer shall not ask the person stopped his or her race or ethnicity, or ask questions or make comments or statements designed to elicit this information.",
        level2: [
          {
            id: 'A',
            text: 'When reporting this data element, the officer shall select all of the following data values that apply:',
            level3: [
              {
                id: '1',
                text: 'Asian',
              },
              {
                id: '2',
                text: 'Black/African American',
              },
              {
                id: '3',
                text: 'Hispanic/Latino(a)',
              },
              {
                id: '4',
                text: 'Middle Eastern or South Asian',
              },
              {
                id: '5',
                text: 'Native American',
              },
              {
                id: '6',
                text: 'Pacific Islander',
              },
              {
                id: '7',
                text: 'White',
              },
              {
                id: 'example',
                level4: [
                  {
                    id: 'a',
                    text: "Example: If a person appears to be both Black and Latino(a), the officer shall select both 'Black/African American' and 'Hispanic/Latino(a).'",
                  },
                ],
              },
            ],
          },
          {
            id: 'B',
            text: "'Asian' refers to a person having origins in any of the original peoples of the Far East or Southeast Asia, including for example, Cambodia, China, Japan, Korea, Malaysia, the Philippine Islands, Thailand, and Vietnam, but who does not fall within the definition of 'Middle Eastern or South Asian' or  'Pacific Islander.'",
          },
          {
            id: 'C',
            text: "'Black/African American' refers to a person having origins in any of the Black racial groups of Africa.",
          },
          {
            id: 'D',
            text: "Hispanic/Latino(a)' refers to a person of Mexican, Puerto Rican, Cuban, Central or South American, or other Spanish culture or origin, regardless of race.",
          },
          {
            id: 'E',
            text: "'Middle Eastern or South Asian' refers to a person of Arabic, Israeli, Iranian, Indian, Pakistani, Bangladeshi, Sri Lankan, Nepali, Bhutanese, Maldivian, or Afghan origin.",
          },
          {
            id: 'F',
            text: "'Native American' refers to a person having origins in any of the original peoples of North, Central, and South America.",
          },
          {
            id: 'G',
            text: "'Pacific Islander' refers to a person having origins in any of the original peoples of Hawaii, Guam, Samoa, or other Pacific Islands, but who does not fall within the definition of 'Middle Eastern or South Asian' or 'Asian.'",
          },
          {
            id: 'H',
            text: "'White' refers to a person of Caucasian descent having origins in any of the original peoples of Europe and Eastern Europe.",
          },
        ],
      },
    ],
  },
  {
    statuteID: '999.226.4',
    level1: [
      {
        id: '5',
        text: "'Perceived Gender of Person Stopped' refers to the officer’s perception of the person’s gender. When reporting this data element, the officer shall make his or her determination of the person’s gender based on personal observation only. The officer shall not ask the person stopped his or her gender or use the gender specified on the person’s driver’s license or other identification, recognizing that the officer’s observation may not reflect the gender specified on the person’s identification.",
        level2: [
          {
            id: 'A',
            text: "When reporting this data element, the officer shall select at least one of the following data values. In doing so and when applicable, the officer may select 'Gender nonconforming' in addition to one of the four enumerated gender data values of Male, Female, Transgender man/boy, or Transgender woman/girl. If the officer cannot perceive the person stopped to be within the categories of Male, Female, Transgender man/boy, or Transgender woman/girl, the officer must select 'Gender nonconforming' as the only data value.",
            level3: [
              {
                id: '1',
                text: 'Male',
              },
              {
                id: '2',
                text: 'Female',
              },
              {
                id: '3',
                text: 'Transgender man/boy',
              },
              {
                id: '4',
                text: 'Transgender woman/girl',
              },
              {
                id: '5',
                text: 'Gender nonconforming',
              },
            ],
          },
          {
            id: 'B',
            text: 'For purposes of completing this data element, the officer shall refer to the following definitions:',
            level3: [
              {
                id: '1',
                text: "'Transgender man/boy' means a person who was assigned female at birth but who currently identifies as a man, or boy if the person is a minor.",
              },
              {
                id: '2',
                text: "'Transgender woman/girl' means a person who was assigned male at birth but who currently identifies as a woman, or girl if the person is a minor.",
              },
              {
                id: '3',
                text: "'Gender nonconforming' means a person whose gender-related appearance, behavior, or both, differ from traditional conceptions about how males or females typically look or behave. A person of any gender or gender identity may be gender nonconforming. For this reason, an officer may select 'Gender nonconforming' in addition to any of the other gender data values, if applicable.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    statuteID: '999.226.5',
    level1: [
      {
        id: '6',
        text: "'Person Stopped Perceived to be LGBT' refers to the officer’s perception that the person stopped is LGBT. 'LGBT' refers to lesbian, gay, bisexual or transgender. When reporting this data element, the officer shall select 'Yes' or 'No' and shall make his or her determination based on personal observation only, without asking whether the person is LGBT. If an officer selects 'Transgender man/boy' or 'Transgender woman/girl' in response to the data element for 'Perceived Gender of Person Stopped,' he or she must also select 'Yes' in response to this data element.",
      },
    ],
  },
  {
    statuteID: '999.226.6',
    level1: [
      {
        id: '7',
        text: "'Perceived Age of Person Stopped' refers to the officer’s perception of the approximate age of the person stopped. When reporting this data element, the officer shall make his or her determination based on personal observation only. The officer shall not ask the person stopped his or her age or use the age specified on the person’s identification, recognizing that the officer’s observation may not reflect the age specified on the person’s identification. In providing this information, the officer shall input an Arabic numeral (e.g., 1, 2, 3, 4) rounded up to the closest whole number.",
      },
    ],
  },
  {
    statuteID: '999.226.7',
    level1: [
      {
        id: '8',
        text: "'Person Stopped Has Limited or No English Fluency' refers to the officer’s perception that the person stopped has limited or no fluency in English. The officer shall only select this data element if it applies to the person stopped.",
      },
    ],
  },
  {
    statuteID: '999.226.8',
    level1: [
      {
        id: '9',
        text: "'Perceived or Known Disability of Person Stopped' refers to the officer’s perception that the person stopped displayed signs of one or more of the following conditions; the officer’s knowledge that the person stopped has one or more of the following conditions because the person stopped so advised the officer; or the officer’s prior knowledge that the person stopped had one or more of the following conditions. Nothing in this provision alters any existing requirements to comply with reasonable accommodation and anti-discrimination laws with respect to the treatment of people with  disabilities. When reporting this data element, the officer shall select all of the following data values that apply:",
        level2: [
          {
            id: 'A',
            text: 'Deafness or difficulty hearing',
          },
          {
            id: 'B',
            text: 'Speech impairment or limited use of language',
          },
          {
            id: 'C',
            text: 'Blind or limited vision',
          },
          {
            id: 'D',
            text: 'Mental health condition',
          },
          {
            id: 'E',
            text: 'Intellectual or developmental disability, including dementia',
          },
          {
            id: 'F',
            text: 'Other disability',
          },
          {
            id: 'G',
            text: "None. If 'None' is selected, no other data values can be selected.",
          },
        ],
      },
    ],
  },
  {
    statuteID: '99.226.9',
    level1: [
      {
        id: '10',
        text: "'Reason for Stop' refers to the primary reason why the officer stopped the person.",
        level2: [
          {
            id: 'A',
            text: 'When reporting this data element, the officer shall identify only the primary reason for stopping a person, by selecting one of the following data values. Justifications that did not inform the officer’s primary reason for the stop shall not be selected.',
            level3: [
              {
                id: '1',
                text: 'Traffic violation. When selecting this data value, the officer shall also identify the applicable Vehicle Code section and subdivision using the Department’s standard California Justice Information Services (CJIS) Offense Table. When the person stopped is the driver, the officer shall also designate the primary type of violation:',
                level4: [
                  {
                    id: 'a',
                    text: 'Moving violation',
                  },
                  {
                    id: 'b',
                    text: 'Equipment violation',
                  },
                  {
                    id: 'c',
                    text: 'Non-moving violation, including registration violation',
                  },
                ],
              },
              {
                id: '2',
                text: "Reasonable suspicion that the person was engaged in criminal activity. This data value should not be selected if 'Traffic violation' is the reason for the stop. When selecting this data value, the officer shall select all applicable circumstances that gave rise to the officer’s reasonable suspicion from the list provided below. In addition, using the Department’s standard CJIS Offense Table, the officer shall identify the primary code section and subdivision of the suspected violation of law that formed the basis for the stop, if known to the officer.",
                level4: [
                  {
                    id: 'a',
                    text: 'Officer witnessed commission of a crime',
                  },
                  {
                    id: 'b',
                    text: 'Matched suspect description',
                  },
                  {
                    id: 'c',
                    text: 'Witness or victim identification of suspect at the scene',
                  },
                  {
                    id: 'd',
                    text: 'Carrying suspicious object',
                  },
                  {
                    id: 'e',
                    text: 'Actions indicative of casing a victim or location',
                  },
                  {
                    id: 'f',
                    text: 'Suspected of acting as a lookout',
                  },
                  {
                    id: 'g',
                    text: 'Actions indicative of a drug transaction',
                  },
                  {
                    id: 'h',
                    text: 'Actions indicative of engaging in a violent crime',
                  },
                  {
                    id: 'i',
                    text: 'Other reasonable suspicion of a crime',
                  },
                ],
              },
              {
                id: '3',
                text: 'Known to be on parole/probation/PRCS/mandatory supervision. The officer shall select this data value if the officer stopped the person because the officer knows that the person stopped is a supervised offender on parole, on probation, on post-release community supervision (PRCS), or on mandatory supervision. The officer shall not select this data value if the officer learns that the person has this status only after the person is stopped.',
              },
              {
                id: '4',
                text: 'Knowledge of outstanding arrest warrant/wanted person. The officer shall select this data value if the officer stopped the person because the officer knows that the person stopped is the subject of an outstanding arrest warrant or is a wanted person. The officer shall not select this data value if the officer learns, after the person is stopped, that the person is the subject of an outstanding arrest warrant or is a wanted person.',
              },
              {
                id: '5',
                text: 'Investigation to determine whether the person is truant.',
              },
              {
                id: '6',
                text: 'Consensual encounter resulting in a search. A consensual encounter is an interaction in which the officer does not exert any authority over, or use any force on, a person, and the person is free to leave. The officer shall only select this data value if a consensual encounter results in a search, regardless of whether the resulting search is consensual.',
                level4: [
                  {
                    id: 'a',
                    text: "Example: During the course of a witness interview in which the person is free to leave, the officer asks to search the person’s bag, and the person consents. In this case the reason for stop is a 'consensual encounter resulting in a search.'",
                  },
                ],
              },
            ],
          },
          {
            id: 'B',
            text: "When reporting the 'Reason for Stop,' the officer shall also provide a brief explanation (250-character maximum) regarding the reason for the stop. This explanation shall include additional detail beyond the general data values selected for the 'Reason for Stop.' Officers shall not include any personal identifying information of the persons stopped or Unique Identifying Information of any officer in this explanation.",
            level2: [
              {
                id: '1',
                text: "Example: If the officer selected 'Reasonable suspicion that the person was engaged in criminal activity/Actions indicative of a drug transaction, the officer must use this field to briefly note the specific nature of the actions indicative of a drug transaction and why they were suspicious.",
              },
              {
                id: '2',
                text: "Example: If the officer selected 'Vehicle Code 26708 (Material Obstructing or Reducing the Driver’s View)' from the Department’s standard CJIS Offense Table, the officer shall use this field to briefly note the specific nature of the obstruction/reduction of the driver’s view (i.e., what specifically did the officer observe and how was such item obstructing or reducing the driver’s view).",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    statuteID: '999.226.10',
    level1: [
      {
        id: '11',
        text: "'Stop Made in Response to a Call for Service.' The officer shall only select this data element if the stop was made in response to a call for service, radio call, or dispatch. An interaction that occurs when an officer responds to a call for service is only reportable if the interaction meets the definition of 'stop,' as specified in section 999.224, subdivision (a)(14). A call for service is not a reason for a stop.",
      },
    ],
  },
  {
    statuteID: '999.226.11',
    level1: [
      {
        id: '12',
        text: "'Actions Taken by Officer During Stop' refers to an officer’s actions toward the person stopped.",
        level2: [
          {
            id: 'A',
            text: 'The reporting officer shall select all of the following data values that apply, even if any or all of the actions were undertaken by another officer:',
            level3: [
              {
                id: '1',
                text: 'Person removed from vehicle by order',
              },
              {
                id: '2',
                text: 'Person removed from vehicle by physical contact',
              },
              {
                id: '3',
                text: 'Field sobriety test conducted',
              },
              {
                id: '4',
                text: 'Curbside detention. This refers to any time an officer directs the person to sit on the sidewalk, curb, or ground.',
              },
              {
                id: '5',
                text: 'Handcuffed or flex cuffed',
              },
              {
                id: '6',
                text: 'Patrol car detention',
              },
              {
                id: '7',
                text: 'Canine removed from vehicle or used to search',
              },
              {
                id: '8',
                text: 'Firearm pointed at person',
              },
              {
                id: '9',
                text: 'Firearm discharged or used',
              },
              {
                id: '10',
                text: 'Electronic control device used',
              },
              {
                id: '11',
                text: 'Impact projectile discharged or used (e.g., blunt impact projectile, rubber bullets or bean bags)',
              },
              {
                id: '12',
                text: 'Canine bit or held person',
              },
              {
                id: '13',
                text: 'Baton or other impact weapon used',
              },
              {
                id: '14',
                text: 'Chemical spray used (e.g., pepper spray, mace, or other chemical irritants)',
              },
              {
                id: '15',
                text: 'Other physical or vehicle contact. This refers to any of the following contacts by the officer, when the purpose of such contact is to restrict movement or control a person’s resistance: any physical strike by the officer; instrumental contact with a person by an officer; or the use of significant physical contact by the officer. Examples of such contacts include, but are not limited to, carotid restraints, hard hand controls, the forcible taking of a subject to the ground, or use of vehicle in apprehension.',
              },
              {
                id: '16',
                text: 'Person photographed',
              },
              {
                id: '17',
                text: 'Asked for consent to search person',
                level4: [
                  {
                    id: 'a',
                    text: 'Consent given',
                  },
                  {
                    id: 'b',
                    text: 'Consent not given',
                  },
                ],
              },
              {
                id: '18',
                text: 'Search of person was conducted. This data value should be selected if a search of the person was conducted, regardless of whether the officer asked for or received consent to search the person.',
              },
              {
                id: '19',
                text: 'Asked for consent to search property',
                level4: [
                  {
                    id: 'a',
                    text: 'Consent given',
                  },
                  {
                    id: 'b',
                    text: 'Consent not given',
                  },
                ],
              },
              {
                id: '20',
                text: 'Search of property was conducted. This data value should be selected if a search of the person’s property was conducted, regardless of whether the officer asked for or received consent to search the property.',
              },
              {
                id: '21',
                text: 'Property was seized',
              },
              {
                id: '22',
                text: 'Vehicle impounded',
              },
              {
                id: '23',
                text: "None. This data value should only be selected if none of the enumerated data values apply. If 'None' is selected, no other data values can be selected.",
              },
            ],
          },
          {
            id: 'B',
            text: "'Basis for Search.' If, during the stop, the officer conducted a search of the person, the person’s property, or both, the officer shall report the basis for the search.",
            level3: [
              {
                id: '1',
                text: 'The officer shall identify the basis for the search by selecting all of the following data values that apply:',
                level4: [
                  {
                    id: 'a',
                    text: 'Consent given',
                  },
                  {
                    id: 'b',
                    text: 'Officer safety/safety of others',
                  },
                  {
                    id: 'c',
                    text: 'Search warrant',
                  },
                  {
                    id: 'd',
                    text: 'Condition of parole/probation/PRCS/mandatory supervision',
                  },
                  {
                    id: 'e',
                    text: 'Suspected weapons',
                  },
                  {
                    id: 'f',
                    text: 'Visible contraband',
                  },
                  {
                    id: 'g',
                    text: 'Odor of contraband',
                  },
                  {
                    id: 'h',
                    text: 'Canine detection',
                  },
                  {
                    id: 'i',
                    text: 'Evidence of crime',
                  },
                  {
                    id: 'j',
                    text: 'Incident to arrest',
                  },
                  {
                    id: 'k',
                    text: 'Exigent circumstances/emergency',
                  },
                  {
                    id: 'l',
                    text: 'Vehicle inventory (for search of property only)',
                  },
                ],
              },
              {
                id: '2',
                text: "When reporting the 'Basis for Search,' the officer shall also provide a brief explanation (250-character maximum) regarding the basis for the search. This explanation shall include additional detail beyond the general data values selected for 'Basis for Search.' Officers shall not include any personal identifying information of the persons stopped or Unique Identifying Information of any officer in this explanation. If the basis for the search is “Condition of parole/probation/PRCS/mandatory supervision,” this explanation is not required.",
                level4: [
                  {
                    id: 'a',
                    text: "Example: If the officer selected 'Suspected weapons' as the 'Basis for Search,' the officer must use this field to explain the specific nature of the suspected weapons (i.e., what were the specific objects, shapes, and/or movements observed that made the officer suspicious and what type of weapons were suspected).",
                  },
                ],
              },
            ],
          },
          {
            id: 'C',
            text: "'Contraband or Evidence Discovered, if Any.' The officer shall indicate whether contraband or evidence was discovered during the stop, including contraband or evidence discovered in plain view or as the result of a search, and the type of contraband or evidence discovered, by selecting all of the following data values that apply:",
            level3: [
              {
                id: '1',
                text: "None. If 'None' is selected, no other data values can be selected.",
              },
              {
                id: '2',
                text: 'Firearm(s)',
              },
              {
                id: '3',
                text: 'Ammunition',
              },
              {
                id: '4',
                text: 'Weapon(s) other than a firearm',
              },
              {
                id: '5',
                text: 'Drugs/narcotics',
              },
              {
                id: '6',
                text: 'Alcohol',
              },
              {
                id: '7',
                text: 'Money',
              },
              {
                id: '8',
                text: 'Drug paraphernalia',
              },
              {
                id: '9',
                text: 'Suspected stolen property',
              },
              {
                id: '10',
                text: 'Cell phone(s) or electronic device(s)',
              },
              {
                id: '11',
                text: 'Other contraband or evidence',
              },
            ],
          },
          {
            id: 'D',
            text: 'Additional Data Regarding Type of Property Seized.',
            level3: [
              {
                id: '1',
                text: "'Basis for Property Seizure.' If the officer seized property during the stop, regardless of whether the property belonged to the person stopped, the officer shall report the basis for the property seizure by selecting all of the following data values that apply:",
                level4: [
                  {
                    id: '1',
                    text: 'Safekeeping as allowed by law/statute',
                  },
                  {
                    id: '2',
                    text: 'Contraband',
                  },
                  {
                    id: '3',
                    text: 'Evidence',
                  },
                  {
                    id: '4',
                    text: 'Impound of vehicle',
                  },
                  {
                    id: '5',
                    text: 'Abandoned Property',
                  },
                ],
              },
              {
                id: '2',
                text: "'Type of Property Seized.' If the officer seized property during the stop, regardless of whether the property belonged to the person stopped,the officer shall report the type of property seized, by selecting all of the following data values that apply:",
                level4: [
                  {
                    id: 'a',
                    text: 'Firearm(s)',
                  },
                  {
                    id: 'b',
                    text: 'Ammunition',
                  },
                  {
                    id: 'c',
                    text: 'Weapon(s) other than a firearm',
                  },
                  {
                    id: 'd',
                    text: 'Drugs/narcotics',
                  },
                  {
                    id: 'e',
                    text: 'Alcohol',
                  },
                  {
                    id: 'f',
                    text: 'Money',
                  },
                  {
                    id: 'g',
                    text: 'Drug paraphernalia',
                  },
                  {
                    id: 'h',
                    text: 'Suspected stolen property',
                  },
                  {
                    id: 'i',
                    text: 'Cell phone(s) or electronic device(s)',
                  },
                  {
                    id: 'j',
                    text: 'Vehicle',
                  },
                  {
                    id: 'k',
                    text: 'Other contraband or evidence',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    statuteID: '999.226.12',
    level1: [
      {
        id: '13',
        text: "'Result of Stop' refers to the outcome of the stop. When reporting this data element, the officer shall select all of the following data values that apply. In addition, for warnings, citations, cite and release, and custodial arrests (with the exception of an arrest pursuant to an outstanding warrant) the officer shall also, using the Department’s standard CJIS Offense Table, identify the code, including the section number and appropriate subdivision, that is the basis for the warning, citation, cite and release, or custodial arrest, where applicable. If more than one code section forms the basis for the warning, citation, cite and release or custodial arrest, the officer shall identify all applicable code sections and subdivisions. If the Result of Stop is based on an ordinance, the officer shall select 'local ordinance viol' from the Department’s CJIS Offense Table without the need for the specific section number.",
        level2: [
          {
            id: 'A',
            text: "No action. If 'No Action' is selected, no other data values can be selected.",
          },
          {
            id: 'B',
            text: 'Warning (verbal or written)',
          },
          {
            id: 'C',
            text: 'Citation for infraction',
          },
          {
            id: 'D',
            text: 'In-field cite and release',
          },
          {
            id: 'E',
            text: 'Custodial arrest pursuant to outstanding warrant',
          },
          {
            id: 'F',
            text: 'Custodial arrest without warrant',
          },
          {
            id: 'G',
            text: 'Field interview card completed',
          },
          {
            id: 'H',
            text: 'Noncriminal transport or caretaking transport. This includes transport by an officer, transport by ambulance, or transport by another agency.',
          },
          {
            id: 'I',
            text: 'Contacted parent/legal guardian or other person responsible for the minor',
          },
          {
            id: 'J',
            text: 'Psychiatric hold (pursuant to Welfare & Institutions Code sections 5150 and/or 5585.20)',
          },
          {
            id: 'K',
            text: 'Contacted U.S. Department of Homeland Security (e.g., Immigration and Customs Enforcement, Customs and Border Protection)',
          },
        ],
      },
    ],
  },
  {
    statuteID: '999.226.13',
    level1: [
      {
        id: '14',
        text: "'Officer’s Identification (I.D.) Number' refers to a permanent identification number assigned by the reporting agency to the reporting officer, which shall be used for all reporting to the Department required under this chapter. For purposes of these regulations, an Officer’s I.D. Number shall be considered Unique Identifying Information.",
      },
    ],
  },
  {
    statuteID: '999.226.14',
    level1: [
      {
        id: '15',
        text: "'Officer’s Years of Experience' refers to the officer’s total number of years he or she has been a peace officer as defined in Chapter 4.5 (commencing with Section 830) of Title 3 of Part 2 of the Penal Code. When reporting this data element, the officer shall count the total number of years he or she has been a peace officer, and not the number of years at his or her current agency. If the officer has served as a peace officer intermittently or part-time, he or she shall only count the time actually worked as a peace officer. In providing this information, the officer shall input an Arabic numeral (e.g., 1, 2, 3, 4) rounded up to the closest whole number.",
      },
    ],
  },
  {
    statuteID: '999.226.15',
    level1: [
      {
        id: '16',
        text: "'Type of Assignment of Officer' refers to the type of assignment to which an officer is assigned at the time of the stop. When reporting this data element, the officer shall select one of the following data values:",
        level2: [
          {
            id: 'A',
            text: 'Patrol, traffic enforcement, field operations',
          },
          {
            id: 'B',
            text: 'Gang enforcement',
          },
          {
            id: 'C',
            text: 'Compliance check (e.g., parole/probation/PRCS/mandatory supervision)',
          },
          {
            id: 'D',
            text: 'Special events (e.g., sports, concerts, protests)',
          },
          {
            id: 'E',
            text: 'Roadblock or DUI sobriety checkpoint',
          },
          {
            id: 'F',
            text: 'Narcotics/vice',
          },
          {
            id: 'G',
            text: 'Task force',
          },
          {
            id: 'H',
            text: 'K-12 Public School, including school resource officer or school police officer',
          },
          {
            id: 'I',
            text: 'Investigative/detective',
          },
          {
            id: 'J',
            text: 'Other. If other is selected, the officer shall specify the type of assignment.',
          },
        ],
      },
    ],
  },
]
