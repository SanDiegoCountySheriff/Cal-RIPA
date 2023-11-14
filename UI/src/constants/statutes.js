export const STATUTES = [
  {
    statuteID: '999.224',
    children: [
      {
        id: 'a',
        text: 'For purposes of Government Code section 12525.5 and this chapter only, the following definitions shall apply:,',
        children: [
          {
            id: '16',
            text: "Student' means any person who is enrolled in a K-12 Public School, or any person who is subject to California’s compulsory education law as provided in Education Code section 48200. A 'student' includes persons between 6 and 18 years of age who are not otherwise exempt from the compulsory education laws as provided in Education Code section 48200. 'Student' also refers to persons up to 22 years of age who are being provided special education and services, as provided under Education Code section 56026. The reporting requirements of this chapter regarding 'students' apply only to interactions between officers and students that take place in a K-12 Public School.",
            children: [
              {
                id: 'A',
                text: 'Example: A person between the ages of 6 and 18 who is not enrolled in a K-12 Public School because he or she has been expelled or is temporarily suspended from school is a student for purposes of these regulations.',
              },
              {
                id: 'B',
                text: 'Example: A person between the ages of 6 and 18 who is enrolled as a student at one K-12 Public School but who is stopped by an officer at another school is a student for purposes of these regulations.',
              },
              {
                id: 'C',
                text: 'Example: A 19-year old person who is enrolled in a K-12 Public School is a student for purposes of these regulations.',
              },
              {
                id: 'D',
                text: 'Example: A 21-year old special education student enrolled in a K-12 Public School is a student for purposes of these regulations.',
              },
              {
                id: 'E',
                text: 'Example: An interaction between an officer and a student that takes place at a mall must be reported pursuant to the general reporting requirements set forth in § 999.227, subdivision (a) of these regulations, and not the reporting requirements set forth at § 999.227, subdivision (e)(3) – (4) for interactions that take place between a student and an officer in a K-12 Public School.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    statuteID: '999.226',
    children: [
      {
        id: 'a',
        text: 'The data elements regarding stops that shall be collected by peace officers subject to this chapter are defined as follows:',
        children: [
          {
            id: '1',
            text: "'ORI number' is the data element that refers to the reporting agency’s Originating Agency Identifier, a unique identification code number assigned by the Federal Bureau of Investigation.",
          },
          {
            id: '2',
            text: 'Date, Time, and Duration of Stop',
            children: [
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
                children: [
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
          {
            id: '3',
            text: "'Location of Stop' refers to the physical location where the stop took place and shall be reported as follows:",
            children: [
              {
                id: 'A',
                text: 'The officer shall report one of the following options, which are provided in order of preference:',
                children: [
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
          {
            id: '4',
            text: "'Perceived Race or Ethnicity of Person Stopped' refers to the officer’s perception of the race or ethnicity of the person stopped. When reporting this data element, the officer shall make his or her determination of the person’s race or ethnicity based on personal observation only. The officer shall not ask the person stopped his or her race or ethnicity, or ask questions or make comments or statements designed to elicit this information.",
            children: [
              {
                id: 'A',
                text: 'When reporting this data element, the officer shall select all of the following data values that apply:',
                children: [
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
                    children: [
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
          {
            id: '5',
            text: "'Perceived Gender of Person Stopped' refers to the officer’s perception of the person’s gender. When reporting this data element, the officer shall make his or her determination of the person’s gender based on personal observation only. The officer shall not ask the person stopped his or her gender or use the gender specified on the person’s driver’s license or other identification, recognizing that the officer’s observation may not reflect the gender specified on the person’s identification.",
            children: [
              {
                id: 'A',
                text: "When reporting this data element, the officer shall select at least one of the following data values. In doing so and when applicable, the officer may select 'Gender nonconforming' in addition to one of the four enumerated gender data values of Male, Female, Transgender man/boy, or Transgender woman/girl. If the officer cannot perceive the person stopped to be within the categories of Male, Female, Transgender man/boy, or Transgender woman/girl, the officer must select 'Gender nonconforming' as the only data value.",
                children: [
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
                children: [
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
          {
            id: '6',
            text: "'Person Stopped Perceived to be LGBT' refers to the officer’s perception that the person stopped is LGBT. 'LGBT' refers to lesbian, gay, bisexual or transgender. When reporting this data element, the officer shall select 'Yes' or 'No' and shall make his or her determination based on personal observation only, without asking whether the person is LGBT. If an officer selects 'Transgender man/boy' or 'Transgender woman/girl' in response to the data element for 'Perceived Gender of Person Stopped,' he or she must also select 'Yes' in response to this data element.",
          },
          {
            id: '7',
            text: "'Perceived Age of Person Stopped' refers to the officer’s perception of the approximate age of the person stopped. When reporting this data element, the officer shall make his or her determination based on personal observation only. The officer shall not ask the person stopped his or her age or use the age specified on the person’s identification, recognizing that the officer’s observation may not reflect the age specified on the person’s identification. In providing this information, the officer shall input an Arabic numeral (e.g., 1, 2, 3, 4) rounded up to the closest whole number.",
          },
          {
            id: '8',
            text: "'Person Stopped Has Limited or No English Fluency' refers to the officer’s perception that the person stopped has limited or no fluency in English. The officer shall only select this data element if it applies to the person stopped.",
          },
          {
            id: '9',
            text: "'Perceived or Known Disability of Person Stopped' refers to the officer’s perception that the person stopped displayed signs of one or more of the following conditions; the officer’s knowledge that the person stopped has one or more of the following conditions because the person stopped so advised the officer; or the officer’s prior knowledge that the person stopped had one or more of the following conditions. Nothing in this provision alters any existing requirements to comply with reasonable accommodation and anti-discrimination laws with respect to the treatment of people with  disabilities. When reporting this data element, the officer shall select all of the following data values that apply:",
            children: [
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
          {
            id: '10',
            text: "'Reason for Stop' refers to the primary reason why the officer stopped the person.",
            children: [
              {
                id: 'A',
                text: 'When reporting this data element, the officer shall identify only the primary reason for stopping a person, by selecting one of the following data values. Justifications that did not inform the officer’s primary reason for the stop shall not be selected.',
                children: [
                  {
                    id: '1',
                    text: 'Traffic violation. When selecting this data value, the officer shall also identify the applicable Vehicle Code section and subdivision using the Department’s standard California Justice Information Services (CJIS) Offense Table. When the person stopped is the driver, the officer shall also designate the primary type of violation:',
                    children: [
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
                    children: [
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
                    children: [
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
                children: [
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
          {
            id: '11',
            text: "'Stop Made in Response to a Call for Service.' The officer shall only select this data element if the stop was made in response to a call for service, radio call, or dispatch. An interaction that occurs when an officer responds to a call for service is only reportable if the interaction meets the definition of 'stop,' as specified in section 999.224, subdivision (a)(14). A call for service is not a reason for a stop.",
          },
          {
            id: '12',
            text: "'Actions Taken by Officer During Stop' refers to an officer’s actions toward the person stopped.",
            children: [
              {
                id: 'A',
                text: 'The reporting officer shall select all of the following data values that apply, even if any or all of the actions were undertaken by another officer:',
                children: [
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
                    children: [
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
                    children: [
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
                children: [
                  {
                    id: '1',
                    text: 'The officer shall identify the basis for the search by selecting all of the following data values that apply:',
                    children: [
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
                    children: [
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
                children: [
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
                children: [
                  {
                    id: '1',
                    text: "'Basis for Property Seizure.' If the officer seized property during the stop, regardless of whether the property belonged to the person stopped, the officer shall report the basis for the property seizure by selecting all of the following data values that apply:",
                    children: [
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
                    children: [
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
          {
            id: '13',
            text: "'Result of Stop' refers to the outcome of the stop. When reporting this data element, the officer shall select all of the following data values that apply. In addition, for warnings, citations, cite and release, and custodial arrests (with the exception of an arrest pursuant to an outstanding warrant) the officer shall also, using the Department’s standard CJIS Offense Table, identify the code, including the section number and appropriate subdivision, that is the basis for the warning, citation, cite and release, or custodial arrest, where applicable. If more than one code section forms the basis for the warning, citation, cite and release or custodial arrest, the officer shall identify all applicable code sections and subdivisions. If the Result of Stop is based on an ordinance, the officer shall select 'local ordinance viol' from the Department’s CJIS Offense Table without the need for the specific section number.",
            children: [
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
          {
            id: '14',
            text: "'Officer’s Identification (I.D.) Number' refers to a permanent identification number assigned by the reporting agency to the reporting officer, which shall be used for all reporting to the Department required under this chapter. For purposes of these regulations, an Officer’s I.D. Number shall be considered Unique Identifying Information.",
          },
          {
            id: '15',
            text: "'Officer’s Years of Experience' refers to the officer’s total number of years he or she has been a peace officer as defined in Chapter 4.5 (commencing with Section 830) of Title 3 of Part 2 of the Penal Code. When reporting this data element, the officer shall count the total number of years he or she has been a peace officer, and not the number of years at his or her current agency. If the officer has served as a peace officer intermittently or part-time, he or she shall only count the time actually worked as a peace officer. In providing this information, the officer shall input an Arabic numeral (e.g., 1, 2, 3, 4) rounded up to the closest whole number.",
          },
          {
            id: '16',
            text: "'Type of Assignment of Officer' refers to the type of assignment to which an officer is assigned at the time of the stop. When reporting this data element, the officer shall select one of the following data values:",
            children: [
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
    ],
  },
]
export const STATUTES_V2 = [
  {
    statuteID: '999.224',
    children: [
      {
        id: 'a',
        text: 'For purposes of Government Code section 12525.5 and this chapter only, the following definitions shall apply:,',
        children: [
          {
            id: '22',
            text: "Student' means any person who is enrolled in a K-12 Public School, or any person who is subject to California’s compulsory education law as provided in Education Code section 48200. A 'student' includes persons between 6 and 18 years of age who are not otherwise exempt from the compulsory education laws as provided in Education Code section 48200. 'Student' also refers to persons up to 22 years of age who are being provided special education and services, as provided under Education Code section 56026. The reporting requirements of this chapter regarding 'students' apply only to interactions between officers and students that take place in a K-12 Public School.",
            children: [
              {
                id: 'A',
                text: 'Example: A person between the ages of 6 and 18 who is not enrolled in a K-12 Public School because they have been expelled or is temporarily suspended from school is a student for purposes of these regulations.',
              },
              {
                id: 'B',
                text: 'Example: A person between the ages of 6 and 18 who is enrolled as a student at one K-12 Public School but who is stopped by an officer at another school is a student for purposes of these regulations.',
              },
              {
                id: 'C',
                text: 'Example: A 19-year old person who is enrolled in a K-12 Public School is a student for purposes of these regulations.',
              },
              {
                id: 'D',
                text: 'Example: A 21-year old special education student enrolled in a K-12 Public School is a student for purposes of these regulations.',
              },
              {
                id: 'E',
                text: 'Example: An interaction between an officer and a student that takes place at a mall must be reported pursuant to the general reporting requirements set forth in § 999.227, subdivision (a) of these regulations, and not the reporting requirements set forth at § 999.227, subdivision (e)(3) – (4) for interactions that take place between a student and an officer in a K-12 Public School.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    statuteID: '999.226',
    children: [
      {
        id: 'a',
        text: 'The data elements regarding stops that shall be collected by peace officers subject to this chapter are defined as follows:',
        children: [
          {
            id: '1',
            text: "'ORI number' is the data element that refers to the reporting agency’s Originating Agency Identifier, a unique identification code number assigned by the Federal Bureau of Investigation.",
          },
          {
            id: '2',
            text: "'Type of Stop' requires an officer to differentiate the nature of the officer’s stop based on the stopped person’s activities, and primarily on their mode of transit during the stop. A 'Vehicular Stop' is any interaction that involves stopping an individual in a Vehicle, as defined in these regulations. A 'Bicycle Stop' is any interaction that involves stopping an individual on a bicycle. Any other stop constitutes a 'Pedestrian Stop,' including stopping passengers on a bus or train.",
            children: [
              {
                id: '1',
                text: "Example: Officer A stops a person on a skateboard for a Vehicle Code violation. Because the stop involved neither a person in a Vehicle, as defined in the regulations, nor on a bicycle, Officer A must select 'Pedestrian Stop' under Type of Stop.",
              },
              {
                id: '2',
                text: "Example: Officer B stops a person on a scooter powered by an electric motor for a Vehicle Code violation. When recording this stop, Officer B must select 'Vehicle Stop' under Type of Stop because the stopped person rode a 'motorized scooter' as defined in Vehicle Code Section 407.5, which qualifies as a 'Vehicle.' ",
              },
            ],
          },
          {
            id: '3',
            text: 'Date, Time, and Duration of Stop',
            children: [
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
                text: "'Duration of Stop' is the approximate length of the stop measured from the time the reporting officer, or any other officer, first detains or, if no initial detention, first searches the stopped person until the time when the person is free to leave or when the person is taken into physical custody and removed from the scene of the stop. In reporting this data element, the officer shall enter the approximate length of the stop in minutes.",
              },
              {
                id: 'example',
                children: [
                  {
                    id: '1',
                    text: "Example: Officer A stops a vehicle for suspected driving under the influence (DUI) at 1300 hours. Officer B then arrives at the scene 15 minutes later and conducts a field sobriety test on the driver, who fails the tests. Officer B then arrests and takes the driver into custody and removes the driver from the scene of the stop at 1345. 'Duration of Stop' would be reported as 45 minutes.",
                  },
                  {
                    id: '2',
                    text: "Example: Officer A begins interviewing witnesses to a robbery at 1100 hours. After approximately 30 minutes of interviews with different witnesses, Officer A observes what looks like a switchblade knife protruding from the waistband of one of the witnesses. Officer A then searches that person. 'Duration of Stop' is measured from the time the person is searched (1130 hours) and not the time during which the officer began interviewing the witnesses to the robbery (1100 hours).",
                  },
                  {
                    id: '3',
                    text: "Example: At 0900 hours, Officer A stops a person walking on a residential street who matches the description of a burglary suspect. Officer A places the person in handcuffs at 0925 hours and has the person sit on the curb. Officer A takes multiple other actions towards the handcuffed person and then, at 0945 hours, Officer A places the person in a patrol vehicle for fifteen minutes and then starts driving the person to the jail at 1030 hours. The 'Duration of Stop' is 1 hour and 30 minutes, measured from the time Officer A stops the person at 0900 until the time the person is driven away by the officer from the scene of the stop at 1030 hours.",
                  },
                  {
                    id: '4',
                    text: "Example: At 1100 hours, Officer A stops a person because the person’s vehicle matched the vehicle of a suspect involved in a recent armed robbery. Officer A pats down the person’s outer clothing for weapons and then questions the person. Officer A realizes that the person is not the armed robbery suspect. Officer A tells the stopped person that the person is free to leave at 1115 hours and the person drives off. The 'Duration of Stop' is 15 minutes, measured from the time Officer A stops the person at 1100 until the time the person drives away at 1115 hours.",
                  },
                ],
              },
            ],
          },
          {
            id: '4',
            text: "'Location of Stop' refers to the physical location where the stop took place and shall be reported as follows:",
            children: [
              {
                id: 'A',
                text: 'The officer shall report one of the following options, which are provided in order of preference:',
                children: [
                  {
                    id: '1',
                    text: 'Geographic coordinates',
                  },
                  {
                    id: '2',
                    text: 'Block number and street name',
                  },
                  {
                    id: '3',
                    text: 'Closest intersection; or',
                  },
                  {
                    id: '4',
                    text: 'Highway and closest highway exit.',
                  },
                  {
                    id: '5',
                    text: 'If none of these options are applicable, the officer may report a road marker, landmark, or other description, except that the officer shall not provide a street address if the location is a residence.',
                  },
                ],
              },
              {
                id: 'B',
                text: 'The officer shall report the city or unincorporated area. To ensure uniformity, the Department shall provide a list of cities and unincorporated areas within the State of California.',
              },
            ],
          },
          {
            id: '5',
            text: "'Perceived Race or Ethnicity of Person Stopped' refers to the officer’s perception of the race or ethnicity of the person stopped. When reporting this data element, the officer shall make their determination of the person’s race or ethnicity based on personal observation only. The officer shall not ask the person stopped their race or ethnicity, or ask questions or make comments or statements designed to elicit this information.",
            children: [
              {
                id: 'A',
                text: 'When reporting this data element, the officer shall select all of the following data values that apply:',
                children: [
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
                    text: 'Hispanic/Latine(x)',
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
                    children: [
                      {
                        id: 'a',
                        text: "Example: If a person appears to be both Black and Latine, the officer shall select both 'Black/African American' and 'Hispanic/Latine'",
                      },
                    ],
                  },
                ],
              },
              {
                id: 'B',
                text: "'Asian' refers to a person having origins in any of the original peoples of the Far East or Southeast Asia, including for example, Cambodia, China, Japan, Korea, Malaysia, the Philippine Islands, Thailand, and Vietnam, but who does not fall within the definition of 'Middle Eastern or South Asian' or 'Pacific Islander.'",
              },
              {
                id: 'C',
                text: "'Black/African American' refers to a person having origins in any of the Black racial groups of Africa.",
              },
              {
                id: 'D',
                text: "'Hispanic/Latine(x)' refers to a person of Mexican, Puerto Rican, Cuban, Central or South American, or other Spanish culture or origin, regardless of race.",
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
          {
            id: '6',
            text: "'Perceived Gender of Person Stopped' refers to the officer’s perception of the person’s gender. When reporting this data element, the officer shall make their determination of the person’s gender based on personal observation only. The officer shall not ask the person stopped their gender or use the gender specified on the person’s driver’s license or other identification, recognizing that the officer’s observation may not reflect the gender specified on the person’s identification.",
            children: [
              {
                id: 'A',
                text: 'When reporting this data element, the officer shall select at least one of the following data values.',
                children: [
                  {
                    id: '1',
                    text: 'Cisgender man/boy',
                  },
                  {
                    id: '2',
                    text: 'Cisgender woman/girl',
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
                    text: 'Nonbinary person',
                  },
                ],
              },
              {
                id: 'B',
                text: 'For purposes of completing this data element, the officer shall refer to the following definitions:',
                children: [
                  {
                    id: '1',
                    text: "'Cisgender' means a person whose gender identity and gender expression align with the person’s assigned sex at birth.",
                  },
                  {
                    id: '2',
                    text: "'Transgender man/boy' means a person who was assigned female at birth but who currently identifies as a man, or boy if the person is a minor.",
                  },
                  {
                    id: '3',
                    text: "'Transgender woman/girl' means a person who was assigned male at birth but who currently identifies as a woman, or girl if the person is a minor.",
                  },
                  {
                    id: '4',
                    text: "'Nonbinary' means a person with a gender identity that falls somewhere outside of the traditional conceptions of strictly either female or male. People with nonbinary gender identities may or may not identify as transgender, may or may not have been born with intersex traits, may or may not use gender-neutral pronouns, and may or may not use more specific terms to describe their genders, such as agender, genderqueer, gender fluid, Two Spirit, bigender, pangender, gender nonconforming, or gender variant.",
                  },
                ],
              },
            ],
          },
          {
            id: '7',
            text: "'Perceived Sexual Orientation of the Person Stopped' refers to the officer’s perception of the stopped person’s sexual orientation. The officer shall not ask the stopped person to provide their sexual orientation. When reporting this data element, the officer shall select one of the following data values.",
            children: [
              {
                id: '1',
                text: "LGB+. 'LGB+' is an acronym that refers to lesbian, gay, bisexual and all other sexual orientations other than heterosexual.",
              },
              {
                id: '2',
                text: "Straight/Heterosexual. 'Straight/Heterosexual' refers to a person who is only attracted to a person of a gender other than their own.",
              },
            ],
          },
          {
            id: '8',
            text: "'Perceived Age of Person Stopped' refers to the officer’s perception of the approximate age of the person stopped. When reporting this data element, the officer shall make his or her determination based on personal observation only. The officer shall not ask the person stopped his or her age or use the age specified on the person’s identification, recognizing that the officer’s observation may not reflect the age specified on the person’s identification. In providing this information, the officer shall input an Arabic numeral (e.g., 1, 2, 3, 4) rounded up to the closest whole number.",
          },
          {
            id: '9',
            text: "'Person Stopped Has Limited or No English Fluency' refers to the officer’s perception that the person stopped has limited or no fluency in English. The officer shall only select this data element if it applies to the person stopped.",
          },
          {
            id: '10',
            text: "'Perceived or Known Disability of Person Stopped' refers to the officer’s perception that the person stopped displayed signs of one or more of the following conditions; the officer’s knowledge that the person stopped has one or more of the following conditions because the person stopped so advised the officer; or the officer’s prior knowledge that the person stopped had one or more of the following conditions. Nothing in this provision alters any existing requirements to comply with reasonable accommodation and anti-discrimination laws with respect to the treatment of people with disabilities. When reporting this data element, the officer shall select all of the following data values that apply:",
            children: [
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
          {
            id: '11',
            text: "'Person Stopped Perceived to be Unhoused' refers to the officer’s perception that the person stopped is unhoused. When reporting this data element, the officer shall make their determination based on personal observation only, recognizing that the officer’s observation may not reflect the actual housing status of the stopped person.",
          },
          {
            id: '12',
            text: "'Stop Made During the Course of Responding to a Call for Service.' The officer shall only select this data element if the stop was made during the course of responding to a call for service, radio call, or dispatch. An interaction that occurs when an officer responds to a call for service is only reportable if the interaction meets the definition of 'stop,' as specified in section 999.224, subdivision (a)(19). A call for service is not a reason for a stop. This data element is not mutually exclusive with the data element 'Stop Made During the Course of a Welfare or Wellness Check or an Officer’s Community Caretaking Function.' If a stop was made during the course of conducting a welfare or wellness check or the officer’s community caretaking function as well as during the course of responding to a call for service, an officer must select both data elements.",
          },
          {
            id: '13',
            text: "'Stop Made During the Course of Performing a Welfare or Wellness Check or an Officer’s Community Caretaking Function.' The officer shall only select this data element if the stop was made during the course of performing a welfare or wellness check or the officer’s community caretaking function. A welfare or wellness check or an officer’s community caretaking function cannot be selected as a reason for a stop. This data element is not mutually exclusive with the data element 'Stop Made During the Course of Responding to a Call for Service.' If a stop was made during the course of responding to a call for service as well as during the course of conducting a welfare or wellness check or the officer’s community caretaking function, an officer must select both data elements.",
            children: [
              {
                id: 'A',
                text: "If an officer selects this data element, the officer shall include the facts that formed the basis for conducting the welfare or wellness check or the community caretaking function as part of their brief explanation in the 'Reason for Stop' narrative field.",
              },
              {
                id: '1',
                text: "Example: Officer A responded to a call for service that a person was behaving erratically on a public street. Officer A interacts with the person and determines that he has a knife and then threatens to stab the officer. Officer A arrests the person. Officer A completes a stop data entry for this interaction and selects the data element 'Stop Made During the Course of Performing a Welfare or Wellness Check or an Officer’s Community Caretaking Function.' Under 'Reason for Stop,' Officer A selects 'Probable Cause to Arrest or Search.' In the narrative field under 'Reason for Stop,' Officer A states that while performing a welfare check on a person acting erratically on the street in response to a call for service, the subject displayed a knife and threatened to stab the officer. The individual was then arrested.",
              },
              {
                id: '2',
                text: 'Example: Officer B is in their patrol vehicle and observes a person lying down on the side of the street. Officer B interacts with the person and determines the person is having a seizure. Officer B requests an ambulance to transport the person to the hospital. Officer B does not need to report this interaction.',
              },
              {
                id: '3',
                text: "Example: Officer C responds to a call for service where a car has driven off the highway into a ditch. Officer C arrives on scene and evacuates two children. After contacting the driver, the officer smells a strong odor of alcohol and conducts field sobriety tests, which the driver fails. Officer C then arrests the driver. Under 'Reason for Stop,' Officer C selects 'Reasonable suspicion that the person was engaged in criminal activity.' In the narrative field under 'Reason for Stop,' Officer C states that while engaging in a call for service at the scene of an automobile accident the officer determined that the driver was driving under the influence of alcohol. The driver was then arrested following failed field sobriety tests.",
              },
            ],
          },
          {
            id: '14',
            text: "'Reason for Stop' refers to the primary reason why the officer stopped the person.",
            children: [
              {
                id: 'A',
                text: 'When reporting this data element, the officer shall identify only the primary reason for stopping a person, by selecting one of the following data values. Justifications that did not inform the officer’s primary reason for the stop shall not be selected.',
                children: [
                  {
                    id: '1',
                    text: 'Traffic violation. When selecting this data value, the officer shall also identify the applicable code section and subdivision using the Department’s standard California Justice Information Services (CJIS) Offense Table. The officer shall also designate the primary type of violation.',
                    children: [
                      {
                        id: 'a',
                        text: 'Moving violation (e.g., a violation of traffic laws regulating driver behavior while operating a vehicle, such as speeding or reckless driving)',
                      },
                      {
                        id: 'b',
                        text: 'Equipment violation (e.g., a violation of the duties outlined in traffic laws related to the proper maintenance of a vehicle, such as a broken taillight or missing license plate)',
                      },
                      {
                        id: 'c',
                        text: 'Non-moving violation (e.g., a violation of traffic laws unrelated to vehicle maintenance or operation and aimed at regulating other traffic laws, such as expired registration tabs, or regulating behavior of pedestrians on or around roadways)',
                      },
                    ],
                  },
                  {
                    id: '2',
                    text: "Reasonable suspicion that the person was engaged in criminal activity. This data value should not be selected if 'Traffic violation' is the reason for the stop or if the officer had probable cause to arrest or search at the time the officer initiated the stop. When selecting this data value, the officer shall select all applicable circumstances that gave rise to the officer’s reasonable suspicion from the list provided below. In addition, using the Department’s standard CJIS Offense Table, the officer shall identify the primary code section and subdivision of the suspected violation of law that formed the basis for the stop.",
                    children: [
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
                        text: 'Matched description of suspect’s vehicle or vehicle observed at the scene of a crime',
                      },
                      {
                        id: 'd',
                        text: 'Witness or victim identified stopped person as a suspect of a crime.',
                      },
                      {
                        id: 'e',
                        text: 'Carrying suspicious object',
                      },
                      {
                        id: 'f',
                        text: 'Actions indicative of casing a victim or location',
                      },
                      {
                        id: 'g',
                        text: 'Suspected of acting as a lookout',
                      },
                      {
                        id: 'h',
                        text: 'Actions indicative of a drug transaction',
                      },
                      {
                        id: 'i',
                        text: 'Actions indicative of engaging in a violent crime',
                      },
                      {
                        id: 'j',
                        text: 'Other reasonable suspicion or probable cause that a crime has occurred',
                      },
                    ],
                  },
                  {
                    id: '3',
                    text: "Probable cause to arrest or search. This data value should only be selected if the officer already established probable cause at the time the officer initiated the stop. This data value should not be selected if 'Traffic violation' is the reason for the stop or if the officer only had reasonable suspicion that the stopped person was engaged in criminal activity at the time the officer initiated the stop. When selecting this data value, the officer shall select all applicable circumstances that gave rise to the officer’s probable cause from the list provided in section 999.226, subdivision (a)(14)(A)2. In addition, using the Department’s standard CJIS Offense Table, the officer shall identify the primary code section and subdivision of the suspected violation of law that formed the basis for the stop.",
                  },
                  {
                    id: '4',
                    text: 'Probable cause to take into custody under Welfare and Institutions Code section 5150.',
                  },
                  {
                    id: '5',
                    text: 'Known to be on parole/probation/PRCS/mandatory supervision. The officer shall select this data value if the officer stopped the person because the officer knows that the person stopped is a supervised offender on parole, on probation, on post-release community supervision (PRCS), or on mandatory supervision. The officer shall not select this data value if the officer learns that the person has this status only after the person is stopped.',
                  },
                  {
                    id: '6',
                    text: 'Knowledge of outstanding arrest warrant/wanted person. The officer shall select this data value if the officer stopped the person because the officer knows that the person stopped is the subject of an outstanding arrest warrant or is a wanted person. The officer shall not select this data value if the officer learns, after the person is stopped, that the person is the subject of an outstanding arrest warrant or is a wanted person.',
                  },
                  {
                    id: '7',
                    text: 'Investigation to determine whether the person is truant.',
                  },
                  {
                    id: '8',
                    text: 'Consensual encounter resulting in a search. A consensual encounter is an interaction in which the officer does not exert any authority over, or use any force on, a person, and the person is free to leave. The officer shall only select this data value if a consensual encounter results in a search, regardless of whether the resulting search is consensual.',
                    children: [
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
                text: "When reporting the 'Reason for Stop,' the officer shall also provide a brief explanation (250-character maximum) regarding the reason for the stop. This explanation shall include additional detail beyond the general data values selected for the 'Reason for Stop.' If the officer selects 'Stop Made During the Course of Performing a Welfare or Wellness Check or an Officer’s Community Caretaking Function,' this explanation shall include detail regarding the nature of that welfare check or the community caretaking function. If the primary reason for the stop differs from the reason(s) for the stop communicated to the stopped person, this explanation shall include detail regarding the reason why the officer communicated to the stopped person a different reason for the stop than was the actual, primary reason for the stop. If the officer did not communicate to the stopped person a reason for the stop, the officer must explain the facts and circumstances that gave rise to a reasonable belief that withholding the reason for the stop was necessary to protect life or property from imminent threat, as part of their brief explanation in the 'Reason for Stop' narrative field.",
              },
              {
                id: 'C',
                text: 'Officers shall not include any personal identifying information of the persons stopped or Unique Identifying Information of any officer in this explanation.',
                children: [
                  {
                    id: '1',
                    text: "Example: If the officer selected 'Reasonable suspicion that the person was engaged in criminal activity/Actions indicative of a drug transaction,'the officer must use this field to briefly note the specific nature of the actions indicative of a drug transaction and why they were suspicious.",
                  },
                  {
                    id: '2',
                    text: "Example: If the officer selected 'Vehicle Code 26708 (Material Obstructing or Reducing the Driver's View)' from the Department's standard CJIS Offense Table, the officer shall use this field to briefly note the specific nature of the obstruction/reduction of the driver's view (i.e., what specifically did the officer observe and how was such item obstructing or reducing the driver's view).",
                  },
                ],
              },
              {
                id: 'D',
                text: "When reporting the 'Reason for Stop,' the officer shall select any of the data values if relevant:",
                children: [
                  {
                    id: '1',
                    text: 'The stopped person is a passenger in a vehicle.',
                  },
                  {
                    id: '2',
                    text: 'The stopped person is inside a residence, where an officer was executing a search or arrest warrant naming or identifying another person, conducting a search pursuant to a condition of another person’s parole, probation, PRCS, or mandatory supervision, or conducting a compliance check on another person under home detention or house arrest.',
                  },
                ],
              },
            ],
          },
          {
            id: '21',
            text: "'Reason Given to the Stopped Person' refers to the reason for the stop the officer communicated to the stopped person at the time of the stop, as required under Vehicle Code section 2806.5. The reason communicated to the stopped person may be different from, or the same as, the actual primary reason why the officer made the stop, as selected among the data values under the Reason for Stop data element. If the data value(s) selected under this data element differ from the data value selected under 'Reason for Stop,' the officer must explain why the officer communicated a different reason for the stop than was the actual, primary reason for the stop, as part of their brief explanation in the 'Reason for Stop' narrative field. If the officer did not communicate to the stopped person a reason for the stop, the officer must explain the facts and circumstances that gave rise to a reasonable belief that withholding the reason for the stop was necessary to protect life or property from imminent threat, as part of their brief explanation in the 'Reason for Stop' narrative field.",
            children: [
              {
                id: 'A',
                text: "When reporting this data element, the officer shall identify the reason communicated to the stopped person, by selecting all of the following data values that apply. The officer should select the data value that best describes the reason communicated to the stopped person. Example: Officer A stopped a person who matched the description of a suspected child abductor. Officer A did not provide the person with the reason for the stop at the time of the stop because Officer A was aware of an Amber Alert that gave rise to the reasonable belief that withholding the reason for the stop was necessary to protect life of surrounding bystandersthe missing child from imminent threat. Under the Reason Given to Person Stopped data element, Officer A selected the data value, entitled 'Reason not provided to the stopped person because the officer reasonably believed that withholding the reason for the stop was necessary to protect life or property from imminent threat.' Under the Reason for Stop data element, Officer A selected the data value, entitled 'Reasonable suspicion that the person was engaged in criminal activity.' Officer A would then provide an explanation for the difference in the 'Reason for Stop' narrative field.",
                children: [
                  {
                    id: '1',
                    text: 'Traffic violation- Moving violation',
                  },
                  {
                    id: '2',
                    text: 'Traffic violation- Equipment violation',
                  },
                  {
                    id: '3',
                    text: 'Traffic violation- Non-moving violation',
                  },
                  {
                    id: '4',
                    text: 'Officer witnessed commission of a crime',
                  },
                  {
                    id: '5',
                    text: 'Matched suspect description',
                  },
                  {
                    id: '6',
                    text: 'Matched description of suspect’s vehicle or vehicle observed at the scene of a crime',
                  },
                  {
                    id: '7',
                    text: 'Witness or victim identified stopped person as a suspect of a crime.',
                  },
                  {
                    id: '8',
                    text: 'Carrying suspicious object',
                  },
                  {
                    id: '9',
                    text: 'Actions indicative of casing a victim or location',
                  },
                  {
                    id: '10',
                    text: 'Suspected of acting as a lookout',
                  },
                  {
                    id: '11',
                    text: 'Actions indicative of a drug transaction',
                  },
                  {
                    id: '12',
                    text: 'Actions indicative of engaging in a violent crime',
                  },
                  {
                    id: '13',
                    text: 'Other reasonable suspicion or probable cause that a crime has occurred',
                  },
                  {
                    id: '14',
                    text: 'Probable cause to arrest or search.',
                  },
                  {
                    id: '15',
                    text: 'Probable cause to take into custody under Welfare and Institutions Code section 5150.',
                  },
                  {
                    id: '16',
                    text: 'Known to be on parole/probation/PRCS/mandatory supervision.',
                  },
                  {
                    id: '17',
                    text: 'Knowledge of outstanding arrest warrant/wanted person.',
                  },
                  {
                    id: '18',
                    text: 'Investigation to determine whether the person is truant.',
                  },
                  {
                    id: '19',
                    text: 'Consensual encounter resulting in a search.',
                  },
                  {
                    id: '20',
                    text: 'Reason not communicated to the stopped person because the officer reasonably believed that withholding the reason for the stop was necessary to protect life or property from imminent threat.',
                  },
                ],
              },
            ],
          },
          {
            id: '15',
            text: "'Non-Force-Related Actions Taken by Officer During Stop' refers to an officer’s actions toward the person stopped that do not relate to the use of force. All non-force related actions taken throughout the entire duration of the stop must be reported. All force-related actions must be reported in the data element, 'Force-related Actions Taken by Officer During Stop'. If the officer does not take any non-force-related actions, the officer must select 'None.'",
            children: [
              {
                id: 'A',
                text: "Example: At 0900 hours, Officer A stops a person walking on a residential street who matches the description of a burglary suspect. Officer A places the person in handcuffs and has the person sit on the curb. Officer A takes both force-related and non-force-related actions towards the stopped person, even after Officer A handcuffs the person. Officer A then places the stopped person in a patrol vehicle at 0945 hours and transports the person to the jail for booking. Officer A must report all non-force related actions taken from the time the person is stopped until the time the person is removed from the scene of the stop. Non-force-related actions must be reported in the 'Non-Force-Related Actions Taken by Officer During Stop' data element. Force-related actions must be reported in the 'Force-Related Actions Taken by Officer During Stop' data element.",
              },
              {
                id: 'B',
                text: 'The reporting officer shall select all of the following data values that apply, even if any or all of the actions were undertaken by another officer:',
                children: [
                  {
                    id: '1',
                    text: 'Person removed from vehicle by order',
                  },
                  {
                    id: '2',
                    text: 'Field sobriety test conducted',
                  },
                  {
                    id: '3',
                    text: 'Curbside detention. This refers to any time an officer directs the person to sit on the sidewalk, curb, or ground.',
                  },
                  {
                    id: '4',
                    text: 'Patrol car detention',
                  },
                  {
                    id: '5',
                    text: 'Peace officer’s canine used to search for, locate, and/or detect contraband',
                  },
                  {
                    id: '6',
                    text: 'Person photographed',
                  },
                  {
                    id: '7',
                    text: 'Asked whether the person is on parole, probation, PRCS, or some other form of mandatory supervision',
                  },
                  {
                    id: '8',
                    text: 'Asked for consent to search person',
                    children: [
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
                    id: '9',
                    text: "Terry v. Ohio frisk/pat search of the person’s outer clothing was conducted. For any other search of person, the officer must select 'Search of person was conducted.' This data value should not be selected when an officer only conducts a search of the stopped person that is more intrusive than patting down the outer clothing and/or for a reason other than determining whether the person is armed and dangerous for purposes of officer safety. In that scenario, the officer must select 'Search of person was conducted.'",
                    children: [
                      {
                        id: 'a',
                        text: "Example: Officer A stopped an individual that matched the description of someone suspected of armed robbery and conducted a search of a stopped person’s outer clothing for weapons. Officer A did not conduct any other search of the person. Officer A should select 'Terry v. Ohio frisk/pat search of the person’s outer clothing was conducted' when reporting the actions Officer A took during this stop.",
                      },
                      {
                        id: 'b',
                        text: "Example: Officer B stopped a person and patted the outer clothing of the stopped person for weapons based on specific facts that the person was armed and dangerous. Officer B did not find any weapon and continued the interaction with the stopped person. During their discussion, the stopped person indicated that they had just purchased illegal drugs that were in their pocket. Based upon reasonable suspicion, Officer B then reached inside the stopped person’s pocket and retrieved contraband. When reporting the actions Officer B took during this stop, Officer B should select both 'Terry v. Ohio frisk/pat search of the person’s outer clothing was conducted' to capture Officer B’s initial pat search of the stopped person’s outer clothing and 'Search of person was conducted' to capture Officer B’s search of stopped person’s pocket.",
                      },
                    ],
                  },
                  {
                    id: '10',
                    text: "Search of person was conducted. This data value should be selected if a search of the person was conducted, regardless of whether the officer asked for or received consent to search the person. This data value should not be selected when an officer only conducts a Terry v. Ohio frisk/pat search of the person’s outer clothing to determine whether the person is armed and dangerous for purposes of officer safety. In that scenario, the officer must select 'Terry v. Ohio frisk/pat search of the person’s outer clothing was conducted.'",
                    children: [
                      {
                        id: 'a',
                        text: "Example: Officer A conducted a search of a person for contraband, by searching their pockets and the inside of their shoes. Officer A should select 'Search of person was conducted' when reporting the actions taken related to the search.",
                      },
                    ],
                  },
                  {
                    id: '11',
                    text: 'Asked for consent to search property',
                    children: [
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
                    id: '12',
                    text: "Search of property was conducted. This data value should be selected if a search of the person's property was conducted, regardless of whether the officer asked for or received consent to search the property.",
                  },
                  {
                    id: '13',
                    text: 'Property was seized',
                  },
                  {
                    id: '14',
                    text: 'Vehicle impounded',
                  },
                  {
                    id: '15',
                    text: 'Ran name of stopped person’s passenger (e.g., using patrol car computer or through a request to dispatch). This data value should be selected only in the stop data entry for a stopped driver in order to capture the act of running the name of a passenger in a vehicle.',
                  },
                  {
                    id: '16',
                    text: 'Asked for identification of stopped person’s passenger. This data value should be selected only in the stop data entry for a stopped driver in order to capture the act of requesting the identification of a passenger in a vehicle.',
                  },
                  {
                    id: '17',
                    text: "None. This data value should only be selected if none of the enumerated data values apply. If 'None' is selected, no other data values can be selected.",
                  },
                ],
              },
              {
                id: 'C',
                text: "'Basis for Search.' If, during the stop, the officer conducted a search of the person, the person’s property, or both, the officer shall report the basis for the search.",
                children: [
                  {
                    id: '1',
                    text: 'The officer shall identify the basis for the search by selecting all of the following data values that apply:',
                    children: [
                      {
                        id: 'a',
                        text: 'Consent given. The officer shall report the form of consent given by the stopped person from the following data values:',
                        children: [
                          {
                            id: 'i',
                            text: 'Verbal',
                          },
                          {
                            id: 'ii',
                            text: 'Written',
                          },
                          {
                            id: 'iii',
                            text: 'Implied by conduct.',
                          },
                        ],
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
                    text: "When reporting the 'Basis for Search,' the officer shall also provide a brief explanation (250-character maximum) regarding the basis for the search. This explanation shall include additional detail beyond the general data values selected for 'Basis for Search.' If a consent search is conducted, officers shall include a description of the specific conduct of the stopped person (i.e. the specific verbal statements, physical movements, or other behavior) that was reasonably interpreted by the officer as consent. Officers shall not include any personal identifying information of the persons stopped or Unique Identifying Information of any officer in this explanation. If the basis for the search is 'Condition of parole/probation/PRCS/mandatory supervision,' officers shall describe how they learned of the search condition. For example, if the officer learned of the parole/probation/PRCS/mandatory supervision status after checking with dispatch, the officer would indicate that.",
                    children: [
                      {
                        id: 'a',
                        text: "Example: If the officer selected 'Suspected weapons' as the 'Basis for Search,' the officer must use this field to explain the specific nature of the suspected weapons (i.e., what were the specific objects, shapes, and/or movements observed that made the officer suspicious and what type of weapons were suspected).",
                      },
                      {
                        id: 'b',
                        text: "Example: If the officer selected 'Consent given' and then 'Implied by conduct,' the officer must use this field to explain the specific conduct of the stopped person (i.e., the specific verbal statements, physical movements, or other behavior) that was reasonably interpreted by the officer as consent to search.",
                      },
                    ],
                  },
                ],
              },
              {
                id: 'D',
                text: "'Contraband or Evidence Discovered, if Any.' The officer shall indicate whether contraband or evidence was discovered during the stop, including contraband or evidence discovered in plain view or as the result of a search, and the type of contraband or evidence discovered, by selecting all of the following data values that apply:",
                children: [
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
                id: 'E',
                text: 'Additional Data Regarding Type of Property Seized.',
                children: [
                  {
                    id: '1',
                    text: "'Basis for Property Seizure.' If the officer seized property during the stop, regardless of whether the property belonged to the person stopped, the officer shall report the basis for the property seizure by selecting all of the following data values that apply:",
                    children: [
                      {
                        id: 'a',
                        text: 'Safekeeping as allowed by law/statute',
                      },
                      {
                        id: 'b',
                        text: 'Contraband',
                      },
                      {
                        id: 'c',
                        text: 'Evidence',
                      },
                      {
                        id: 'd',
                        text: 'Impound of vehicle',
                      },
                      {
                        id: 'e',
                        text: 'Abandoned Property',
                      },
                    ],
                  },
                  {
                    id: '2',
                    text: "'Type of Property Seized.' If the officer seized property during the stop, regardless of whether the property belonged to the person stopped, the officer shall report the type of property seized, by selecting all of the following data values that apply:",
                    children: [
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
          {
            id: '16',
            text: "'Force-Related Actions Taken by Officer During Stop' refers to an officer’s actions toward the person stopped that relate to the use of force. All force-related actions taken throughout the entire duration of the stop must be reported. All non-force-related actions must be reported in the data element, 'Non-Force-Related Actions Taken by Officer During Stop.' If the officer does not take any force-related actions, the officer must select 'None.'",
            children: [
              {
                id: 'A',
                text: 'The reporting officer shall select all of the following data values that apply, even if any or all of the actions were undertaken by another officer:',
                children: [
                  {
                    id: '1',
                    text: 'Handcuffed or flex cuffed',
                  },
                  {
                    id: '2',
                    text: "Physical compliance tactics and techniques. This refers to the use of any part of the officer’s body to make contact with the stopped person, when the purpose of such contact is to restrict movement or control a person's resistance and includes: any physical strike by the officer; or the use of significant physical contact by the officer. Examples of such contacts include, but are not limited to, hard hand controls, the forcible taking of a subject to the ground, and hitting or kicking the individual.",
                  },
                  {
                    id: '3',
                    text: 'Peace officer’s canine removed from patrol vehicle to gain compliance and/or for purposes of stopped person apprehending',
                  },
                  {
                    id: '4',
                    text: 'Peace officer’s canine bit or held person',
                  },
                  {
                    id: '5',
                    text: 'Firearm pointed at person',
                  },
                  {
                    id: '6',
                    text: 'Firearm discharged',
                  },
                  {
                    id: '7',
                    text: 'Firearm unholstered',
                  },
                  {
                    id: '8',
                    text: 'Electronic control device pointed at person or sparked',
                  },
                  {
                    id: '9',
                    text: 'Electronic control device used in dart-mode',
                  },
                  {
                    id: '10',
                    text: 'Electronic control device used in drive-stun mode',
                  },
                  {
                    id: '11',
                    text: 'Impact projectile weapon pointed at person',
                  },
                  {
                    id: '12',
                    text: 'Impact projectile discharged or used (e.g., blunt impact projectile, rubber bullets or bean bags)',
                  },
                  {
                    id: '13',
                    text: 'Baton or other impact weapon drawn',
                  },
                  {
                    id: '14',
                    text: 'Baton or other impact weapon used, or other object (including a firearm) to strike or prod',
                  },
                  {
                    id: '15',
                    text: 'Chemical spray used (e.g., pepper spray, mace, or other chemical irritants)',
                  },
                  {
                    id: '16',
                    text: 'Person removed from vehicle by physical contact',
                  },
                  {
                    id: '17',
                    text: 'Use of vehicle in apprehension of stopped person. This refers to the use of a vehicle to restrict movement or control a person’s resistance.',
                  },
                  {
                    id: '18',
                    text: "None. This data value should only be selected if none of the enumerated data values apply. If 'None' is selected, no other data values can be selected.",
                  },
                ],
              },
            ],
          },
          {
            id: '17',
            text: "'Result of Stop' refers to the outcome of the stop. When reporting this data element, the officer shall select all of the following data values that apply. In addition, for warnings, citations, cite and release, and custodial arrests (with the exception of an arrest pursuant to an outstanding warrant) the officer shall also, using the Department’s standard CJIS Offense Table, identify the code, including the section number and appropriate subdivision, that is the basis for the warning, citation, cite and release, or custodial arrest, where applicable. If more than one code section forms the basis for the warning, citation, cite and release or custodial arrest, the officer shall identify all applicable code sections and subdivisions. If the Result of Stop is based on an ordinance, the officer shall select 'local ordinance viol' from the Department’s CJIS Offense Table without the need for the specific section number.",
            children: [
              {
                id: 'A',
                text: "No action. If 'No Action' is selected, no other data values can be selected.",
              },
              {
                id: 'B',
                text: 'Verbal Warning',
              },
              {
                id: 'C',
                text: 'Written Warning',
              },
              {
                id: 'D',
                text: 'Citation for infraction',
              },
              {
                id: 'E',
                text: 'In-field cite and release',
              },
              {
                id: 'F',
                text: 'Custodial arrest pursuant to outstanding warrant ',
              },
              {
                id: 'G',
                text: 'Custodial arrest without warrant',
              },
              {
                id: 'H',
                text: 'Field interview card completed',
              },
              {
                id: 'I',
                text: 'Noncriminal transport or caretaking transport. This includes transport by an officer, transport by ambulance, or transport by another agency.',
              },
              {
                id: 'J',
                text: 'Contacted parent/legal guardian or other person legally responsible for the person.',
              },
              {
                id: 'K',
                text: 'Psychiatric hold (pursuant to Welfare & Institutions Code sections 5150 and/or 5585.20)',
              },
              {
                id: 'L',
                text: 'Contacted U.S. Department of Homeland Security (e.g., Immigration and Customs Enforcement, Customs and Border Protection)',
              },
            ],
          },
          {
            id: '18',
            text: "'Officer’s Identification (I.D.) Number' refers to a permanent identification number assigned by the reporting agency to the reporting officer, which shall be used for all reporting to the Department required under this chapter. The reporting agency shall not assign the officer a new Officer’s I.D. Number under any circumstances. If an officer leaves the reporting agency, the reporting agency shall not reassign that Officer I.D. Number to any other officer employed by the agency. For purposes of these regulations, an Officer’s I.D. Number shall be considered Unique Identifying Information.",
          },
          {
            id: '19',
            text: "'Officer’s Years of Experience' refers to the officer’s total number of years they have been a peace officer as defined in Chapter 4.5 (commencing with Section 830) of Title 3 of Part 2 of the Penal Code. When reporting this data element, the officer shall count the total number of years they have been a peace officer, and not the number of years at their current agency. If the officer has served as a peace officer intermittently or part-time, they shall only count the time actually worked as a peace officer. In providing this information, the officer shall input an Arabic numeral (e.g., 1, 2, 3, 4) rounded up to the closest whole number.",
          },
          {
            id: '20',
            text: "'Type of Assignment of Officer' refers to the type of assignment to which an officer is assigned at the time of the stop. When reporting this data element, the officer shall select one of the following data values:",
            children: [
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
                text: 'Off duty and/or working private event',
              },
              {
                id: 'K',
                text: 'Contracted by another law enforcement agency. If this data value is selected, the officer shall specify the type of assignment.',
              },
              {
                id: 'L',
                text: 'Other. If other is selected, the officer shall specify the type of assignment.',
              },
            ],
          },
        ],
      },
    ],
  },
]
