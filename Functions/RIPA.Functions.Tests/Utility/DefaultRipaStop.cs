using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.v1;

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
            ListPersonStopped = new PersonStopped[] {
                new PersonStopped()
                {
                    Id = "1",
                    IsStudent = false,
                    ListPerceivedRace = new PerceivedRace[]
                    {
                        new PerceivedRace()
                        {
                            Race = "White",
                            Key = 1,
                        }
                    },
                    PerceivedLimitedEnglish = false,
                    ListPerceivedOrKnownDisability = new PerceivedOrKnownDisability[]
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
                    ListActionTakenDuringStop = new ActionTakenDuringStop[]
                    {
                        new ActionTakenDuringStop()
                        {
                            Key = "1",
                            Action = "Action"
                        }
                    },
                    PersonSearchConsentGiven = false,
                    PropertySearchConsentGiven = false,
                    ListContrabandOrEvidenceDiscovered = new ContrabandOrEvidenceDiscovered[]
                    {
                        new ContrabandOrEvidenceDiscovered()
                        {
                            Key = "1",
                            Contraband = "None"
                        }
                    },
                    ListBasisForSearch = new BasisForSearch[] { },
                    BasisForSearchBrief = null,
                    BasisForSearchPiiFound = false,
                    ListBasisForPropertySeizure = new BasisForPropertySeizure[] { },
                    ListTypeOfPropertySeized = new TypeOfPropertySeized[] { },
                    ListResultOfStop = new ResultOfStop[]
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
        };
    }
}
