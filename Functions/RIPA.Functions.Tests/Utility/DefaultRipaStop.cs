using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Models.v1;
using System.Collections.Generic;

namespace RIPA.Functions.Tests.Utility;

public static class DefaultRipaStop
{
    public static Common.Models.v1.Stop CreateDefaultStop()
    {
        return new Common.Models.v1.Stop()
        {
            Id = "1",
            Ori = "001",
            Agency = "Agency",
            OfficerId = "1",
            OfficerName = "Officer Name",
            ExpYears = "1",
            OfficerAssignment = new OfficerAssignment()
            {
                Key = "1",
                Type = "10",
                OtherType = "Other Type",
            },
            Date = "2021, 01, 01",
            Time = "12:00PM",
            Location = new Location()
            {
                ToggleLocationOptions = false,
                BlockNumber = "1000",
                StreetName = "AnyStreet St.",
                City = new City()
                {
                    Codes = new Codes()
                    {
                        Code = "1",
                        Text = "City",
                    }
                },
                School = false,
                OutOfCounty = false,
                PiiFound = false,
                GeoLocation = new GeoLocation()
                {
                    Latitude = 1,
                    Longitude = 1
                }
            },
            StopDuration = 10,
            StopInResponseToCFS = false,
            ListPersonStopped = new List<IPersonStopped> {
                new PersonStopped()
                {
                    Id = "1",
                    IsStudent = false,
                    ListPerceivedRace = new List<PerceivedRace>
                    {
                        new PerceivedRace()
                        {
                            Race = "White",
                            Key = 1,
                        }
                    },
                    PerceivedLimitedEnglish = false,
                    ListPerceivedOrKnownDisability = new List<PerceivedOrKnownDisability>
                    {
                        new PerceivedOrKnownDisability()
                        {
                            Key = "8",
                            Disability = "None",
                        }
                    },
                    PerceivedAge = 20,
                    PerceivedGender = "Male",
                    GenderNonconforming = false,
                    PerceivedLgbt = false,
                    ReasonForStop = new ReasonForStop()
                    {
                        Key = "1",
                        Reason = "Stop Reason",
                        ListDetail = new Detail[]
                        {
                            new Detail()
                            {
                                Key = "1",
                                Reason = "Detail Reason"
                            }
                        },
                        ListCodes = new Codes[]
                        {
                            new Codes()
                            {
                                Code = "1",
                                Text = "Code 1"
                            }
                        }
                    },
                    ReasonForStopExplanation = "Explanation",
                    ReasonForStopPiiFound = false,
                    ListActionTakenDuringStop = new List < ActionTakenDuringStop > { new ActionTakenDuringStop() { Key = "1", Action = "Action" } },
                    PersonSearchConsentGiven = false,
                    PropertySearchConsentGiven = false,
                    ListContrabandOrEvidenceDiscovered = new List < ContrabandOrEvidenceDiscovered > { new ContrabandOrEvidenceDiscovered() { Key = "1", Contraband = "None" } },
                    ListBasisForSearch = new List<BasisForSearch>(),
                    BasisForSearchBrief = null,
                    BasisForSearchPiiFound = false,
                    ListBasisForPropertySeizure = new List < BasisForPropertySeizure >(),
                    ListTypeOfPropertySeized = new List < TypeOfPropertySeized >(),
                    ListResultOfStop = new List<ResultOfStop>
                    {
                        new ResultOfStop()
                        {
                            Key = "1",
                            Result = "Result",
                            ListCodes = new Codes[]
                            {
                                new Codes()
                                {
                                    Code = "1",
                                    Text = "Code"
                                }
                            }
                        }
                    }
                }
            },
            Status = "Active",
            IsPiiFound = false,
            OverridePii = false,
            EditStopExplanation = "EditStopExplanation",
            IsEdited = false,
            StopVersion = StopVersion.V1,
        };
    }
}
