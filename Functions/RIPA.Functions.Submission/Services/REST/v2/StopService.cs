using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Models.v2;
using RIPA.Functions.Submission.Models.v2;
using RIPA.Functions.Submission.Services.REST.v2.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RIPA.Functions.Submission.Services.REST.v2;

public class StopService : IStopService
{
    private readonly ILogger<StopService> _logger;

    public StopService(ILogger<StopService> logger)
    {
        _logger = logger;
    }

    public Stop NewSubmission(Stop stop, DateTime dateSubmitted, Guid submissionId, string fileName)
    {
        if (stop.Status == SubmissionStatus.Pending.ToString())
        {
            stop.Status = SubmissionStatus.Submitted.ToString();
        }
        else if (stop.Status == SubmissionStatus.Pending_NFIA.ToString())
        {
            stop.Status = SubmissionStatus.Submitted_NFIA.ToString();
        }

        if (stop.Status != SubmissionStatus.Submitted_NFIA.ToString() && stop.ListSubmission != null && stop.ListSubmission.Any(x => x.ListSubmissionError == null || x.ListSubmissionError.Count > 0 || x.ListSubmissionError.Any(y => !Enum.GetNames(typeof(SubmissionErrorCode)).Contains(y.Code))))
        {
            stop.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Resubmitted);
        }
        else if (stop.ListSubmission == null)
        {
            stop.ListSubmission = new List<Common.Models.Submission>();
        }

        var submission = new Common.Models.Submission
        {
            DateSubmitted = dateSubmitted,
            Id = submissionId,
            Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Submitted),
            FileName = fileName
        };

        stop.ListSubmission.Add(submission);

        return stop;
    }

    public Stop ErrorSubmission(Stop stop, SubmissionError submissionError, string stopStatus)
    {
        var pendingSubmissions = stop.ListSubmission.Where(x => x.FileName.Contains(submissionError.FileName));

        foreach (var submission in pendingSubmissions)
        {
            if (submission.ListSubmissionError != null)
            {
                submission.ListSubmissionError.Add(submissionError);
            }
            else
            {
                submission.ListSubmissionError = new()
                {
                    submissionError
                };
            }
            submission.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed);
        }

        stop.Status = stopStatus;

        return stop;
    }

    public DojStop CastToDojStop(Stop stop)
    {
        var locationType = CastToDojLocationType(stop.Location as Common.Models.v2.Location);
        Common.Models.v2.Location stopLocation = stop.Location as Common.Models.v2.Location;

        DojStop dojStop = new()
        {
            LEARecordID = stop.Id,
            ORI = stop.Ori,
            TX_Type = CastToDojTXType(stop),
            SDate = stop.StopDateTime.ToString("MM/dd/yyyy"),
            STime = stop.Time,
            SDur = stop.StopDuration.ToString(),
            StopType = CastToDojStopType(stop.StopType),
            Is_WelfareCheck = stop.StopMadeDuringWelfareCheck ? "Y" : "N",
            Officer = new Officer
            {
                UID = stop.OfficerId,
                ExpYears = stop.ExpYears,
                AT = stop.OfficerAssignment.Key,
                ATOth = stop.OfficerAssignment.OtherType,
                Proxy = "",
                OfficerGend = CastToDojGender(stop.OfficerGender),
                ListOfficerEth = CastToDojOfficerRace(stop.OfficerRace.ToList()),
                Nonbinary_Officer = stop.OfficerNonBinary == true ? "5" : string.Empty,
                NonPrimaryAgency = stop.OfficerWorksWithNonReportingAgency ? "Y" : "N",
            },
            Location = new Models.v2.Location
            {
                LocationType = locationType,
                Latitude = locationType == "1" ? stopLocation.GeoLocation.Latitude.ToString() : string.Empty,
                Longitude = locationType == "1" ? stopLocation.GeoLocation.Longitude.ToString() : string.Empty,
                BlockNumber = locationType == "2" ? stopLocation.BlockNumber : string.Empty,
                StreetName = locationType == "2" ? stopLocation.StreetName : string.Empty,
                CrossStreet1 = locationType == "3" ? stopLocation.CrossStreet1 : string.Empty,
                CrossStreet2 = locationType == "3" ? stopLocation.CrossStreet2 : string.Empty,
                Highway = locationType == "4" ? stopLocation.Highway : string.Empty,
                ClosestExit = locationType == "4" ? stopLocation.Exit : string.Empty,
                OtherLocation = locationType == "5" ? stopLocation.LandMark : string.Empty,
                City = stopLocation.City?.Codes?.Code,
                K12_Flag = stopLocation.School ? "Y" : string.Empty,
                K12Code = stopLocation.School ? stopLocation.SchoolName.Codes.Code : string.Empty
            },
            Is_ServCall = stop.StopInResponseToCFS ? "Y" : "N",
            ListPerson_Stopped = stop.ListPersonStopped.Any() ? CastToDojListPersonStopped(stop.ListPersonStopped.ToList(), stopLocation.School) : null,
            Is_NFIA = stop.Nfia == true ? "Y" : string.Empty
        };

        return dojStop;
    }

    private string CastToDojLocationType(Common.Models.v2.Location location)
    {
        if (location.GeoLocation.Latitude.HasValue && location.GeoLocation.Longitude.HasValue)
        {
            return "1";
        }

        if (!string.IsNullOrWhiteSpace(location.BlockNumber) && !string.IsNullOrWhiteSpace(location.StreetName))
        {
            return "2";
        }

        if (!string.IsNullOrWhiteSpace(location.CrossStreet2) && !string.IsNullOrWhiteSpace(location.CrossStreet2))
        {
            return "3";
        }

        if (!string.IsNullOrWhiteSpace(location.Highway) && !string.IsNullOrWhiteSpace(location.Exit))
        {
            return "4";
        }

        return "5";
    }

    private string CastToDojStopType(string stopType)
    {
        return stopType switch
        {
            "Vehicular" => "1",
            "Bicycle" => "2",
            "Pedestrian" => "3",
            _ => "1",
        };
    }

    private ListOfficerEth CastToDojOfficerRace(List<string> officerRace)
    {
        var officerEthnicities = new List<string>();

        foreach (var race in officerRace)
        {
            switch (race)
            {
                case "Asian":
                    officerEthnicities.Add("1");
                    break;
                case "Black/African American":
                    officerEthnicities.Add("2");
                    break;
                case "Hispanic/Latine(x)":
                    officerEthnicities.Add("3");
                    break;
                case "Middle Eastern or South Asian":
                    officerEthnicities.Add("4");
                    break;
                case "Native American":
                    officerEthnicities.Add("5");
                    break;
                case "Pacific Islander":
                    officerEthnicities.Add("6");
                    break;
                case "White":
                    officerEthnicities.Add("7");
                    break;
                default:
                    break;
            }
        }

        return new ListOfficerEth() { OfficerEth = officerEthnicities };
    }

    private Listperson_Stopped CastToDojListPersonStopped(List<IPersonStopped> listPersonStopped, bool isSchool)
    {
        var listDojPersonStopped = new List<Person_Stopped>();

        foreach (PersonStopped personStopped in listPersonStopped.Cast<PersonStopped>())
        {
            Person_Stopped dojPersonStopped = new()
            {
                PID = personStopped.Id,
                Perc = new Perc
                {
                    ListEthn = new Listethn
                    {
                        Ethn = personStopped.ListPerceivedRace.Select(x => x.Key.ToString()).ToList()
                    },
                    Age = personStopped.PerceivedAge.ToString(),
                    Is_LimEng = personStopped.PerceivedLimitedEnglish ? "Y" : "N",
                    ListDisb = new Listdisb
                    {
                        Disb = personStopped.ListPerceivedOrKnownDisability.Select(x => x.Key.ToString()).ToList()
                    },
                    Gend = CastToDojGender(personStopped.PerceivedGender),
                    Nonbinary_Person = personStopped.NonBinaryPerson ? "5" : string.Empty,
                    SexualOrientation = personStopped.PerceivedSexualOrientation == "LGB+" ? "1" : "2",
                    Is_Unhoused = personStopped.PerceivedUnhoused ? "Y" : "N",
                },
                Is_Passenger = personStopped.PassengerInVehicle == true ? "Y" : "N",
                Is_Residence = personStopped.InsideResidence == true ? "Y" : "N",
                Is_Stud = isSchool ? personStopped.IsStudent ? "Y" : "N" : string.Empty,
                PrimaryReason = CastToDojPrimaryReason(personStopped),
                ListNonForceActTak = CastToDojListNonForceActTak(personStopped.ListNonForceActionsTakenDuringStop.ToList(), personStopped.PropertySearchConsentGiven, personStopped.PersonSearchConsentGiven),
                ListForceActTak = CastToDojListForceActTak(personStopped.ListForceActionsTakenDuringStop.ToList()),
                ListBasSearch = CastToDojListbassearch(personStopped.ListBasisForSearch.ToList()),
                ConsentType = CastToDojConsentType(personStopped.ListBasisForSearch.ToList()),
                BasSearch_N = personStopped.BasisForSearchBrief,
                ListBasSeiz = new Listbasseiz { BasSeiz = personStopped.ListBasisForPropertySeizure.Select(x => x.Key).ToList() },
                ListPropType = new Listproptype { PropType = personStopped.ListTypeOfPropertySeized.Select(x => x.Key).ToList() },
                ListCB = new Listcb { Cb = personStopped.ListContrabandOrEvidenceDiscovered.Select(x => x.Key).ToList() },
                ListResult = CastToDojListResult(personStopped.ListResultOfStop.ToList()),
            };

            listDojPersonStopped.Add(dojPersonStopped);
        }

        return new Listperson_Stopped { Person_Stopped = listDojPersonStopped };
    }

    private Listbassearch CastToDojListbassearch(List<BasisForSearch> listBasisForSearch)
    {
        return new Listbassearch
        {
            BasSearch = listBasisForSearch.Select(x =>
            {
                if (x.Key == "14" || x.Key == "15")
                {
                    return "1";
                }
                else
                {
                    return x.Key;
                }
            }).ToList()
        };
    }

    private string CastToDojConsentType(List<BasisForSearch> listBasisForSearch)
    {
        foreach (var basisForSearch in listBasisForSearch)
        {
            return basisForSearch.Key switch
            {
                "1" => "1",
                "14" => "2",
                "15" => "3",
                _ => string.Empty
            };
        }

        return string.Empty;
    }

    private ListForceActTak CastToDojListForceActTak(List<ForceActionsTakenDuringStop> listForceActionsTakenDuringStop)
    {
        var listForceActionsTaken = new List<string>();

        foreach (var forceActionTaken in listForceActionsTakenDuringStop)
        {
            listForceActionsTaken.Add(forceActionTaken.Key);
        }

        return new ListForceActTak() { ForceActTak = listForceActionsTaken };
    }

    private ListNonForceActTak CastToDojListNonForceActTak(List<NonForceActionsTakenDuringStop> listNonForceActionsTakenDuringStop, bool propertySearchConsentGiven, bool personSearchConsentGiven)
    {
        var listNonForceActionsTaken = new List<NonForceActTak>();

        foreach (var nonForceActionTaken in listNonForceActionsTakenDuringStop)
        {
            var isCon = "na";

            if (nonForceActionTaken.Key == "2")
            {
                isCon = personSearchConsentGiven ? "Y" : "N";
            }
            else if (nonForceActionTaken.Key == "3")
            {
                isCon = propertySearchConsentGiven ? "Y" : "N";
            }

            NonForceActTak nonForceActTak = new()
            {
                NonForceAct_CD = nonForceActionTaken.Key,
                NonForceConsent = isCon,
            };

            listNonForceActionsTaken.Add(nonForceActTak);
        }

        return new ListNonForceActTak() { NonForceActTak = listNonForceActionsTaken };
    }

    private Primaryreason CastToDojPrimaryReason(PersonStopped personStopped)
    {
        var stopReasonKey = personStopped.ReasonForStop?.Key;

        Primaryreason primaryReason = new()
        {
            StReas = stopReasonKey,
            StReas_N = personStopped.ReasonForStopExplanation,
            ListStReas_Given = new() { StReas_Given = personStopped.ReasonGivenForStop.Select(x => x.Key).ToList() },
        };

        switch (stopReasonKey)
        {
            case "1": //Traffic Violation
                primaryReason.Tr_ID = personStopped.ReasonForStop.ListDetail.Any() ? personStopped.ReasonForStop.ListDetail.FirstOrDefault().Key : null;
                primaryReason.Tr_O_CD = personStopped.ReasonForStop.ListCodes.Any() ? personStopped.ReasonForStop.ListCodes.FirstOrDefault().Code : null;
                primaryReason.ListSusp_T = new Listsusp_T { Susp_T = new List<string>() };
                break;
            case "2": //Reasonable Suspicion
                primaryReason.ListSusp_T = new Listsusp_T { Susp_T = personStopped.ReasonForStop.ListDetail.Select(x => x.Key).ToList() };
                primaryReason.Susp_O_CD = personStopped.ReasonForStop.ListCodes.Any() ? personStopped.ReasonForStop.ListCodes.FirstOrDefault().Code : null;
                break;
            case "7": //Education Code
                primaryReason.EDU_sec_CD = personStopped.ReasonForStop.ListDetail.Any() ? personStopped.ReasonForStop.ListDetail.FirstOrDefault().Key : null;
                primaryReason.EDU_subDiv_CD = personStopped.ReasonForStop.ListCodes.Any() ? personStopped.ReasonForStop.ListCodes.FirstOrDefault().Code : null;
                primaryReason.ListSusp_T = new Listsusp_T { Susp_T = new List<string>() };
                break;
            case "9": //Probable Cause
                primaryReason.ListProb_T = new Listprob_T { Prob_T = personStopped.ReasonForStop.ListDetail.Select(x => x.Key).ToList() };
                primaryReason.Prob_O_CD = personStopped.ReasonForStop.ListCodes.Any() ? personStopped.ReasonForStop.ListCodes.FirstOrDefault().Code : null; ;
                primaryReason.ListSusp_T = new Listsusp_T { Susp_T = new List<string>() };
                break;
            default: //All other stop reason keys
                break;
        }

        return primaryReason;
    }

    private Listresult CastToDojListResult(List<ResultOfStop> listResultOfStop)
    {
        var listResults = new List<Result>();

        foreach (ResultOfStop ros in listResultOfStop)
        {
            Result result = new()
            {
                ResCD = ros.Key,
                Res_O_CD = ros.ListCodes?.Select(x => x.Code).ToList()
            };
            listResults.Add(result);
        }

        return new Listresult { Result = listResults };
    }

    private string CastToDojGender(string gender)
    {
        return gender switch
        {
            "Cisgender Man/Boy" => ((int)PercievedGender.CisgenderManBoy).ToString(),
            "Cisgender Man" => ((int)PercievedGender.CisgenderManBoy).ToString(),
            "Cisgender Woman/Girl" => ((int)PercievedGender.CisgenderWomanGirl).ToString(),
            "Cisgender Woman" => ((int)PercievedGender.CisgenderWomanGirl).ToString(),
            "Transgender Man/Boy" => ((int)PercievedGender.TransgenderManBoy).ToString(),
            "Transgender Man" => ((int)PercievedGender.TransgenderManBoy).ToString(),
            "Transgender Woman/Girl" => ((int)PercievedGender.TransgenderWomanGirl).ToString(),
            "Transgender Woman" => ((int)PercievedGender.TransgenderWomanGirl).ToString(),
            _ => "",
        };
    }

    private string CastToDojTXType(Stop stop)
    {
        if (stop.ListSubmission == null || stop.ListSubmission.Count() == 0)
        {
            return "I"; // no submissions 
        }

        if (stop.ListSubmission.Any(x => x.ListSubmissionError == null || x.ListSubmissionError.Count() == 0 || x.ListSubmissionError.Any(y => !Enum.GetNames(typeof(SubmissionErrorCode)).Contains(y.Code))))
        {
            return "U"; // has successful submission(s) to the doj, submission(s) that were not Fatal Errors
        }

        return "I"; // no successful submissions to doj
    }
}
