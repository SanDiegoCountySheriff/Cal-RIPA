﻿using Microsoft.Extensions.Logging;
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
        stop.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Submitted);

        if (stop.ListSubmission.Any(x => x.ListSubmissionError == null || !x.ListSubmissionError.Any() || x.ListSubmissionError.Any(y => !Enum.GetNames(typeof(SubmissionErrorCode)).Contains(y.Code))))
        {
            stop.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Resubmitted);
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
            submission.ListSubmissionError.Add(submissionError);
            submission.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed);
        }

        stop.Status = stopStatus;

        return stop;
    }

    public DojStop CastToDojStop(Stop stop)
    {
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
                OfficerGend = CastToDojOfficerGender(stop.OfficerGender),
                ListOfficerEth = CastToDojOfficerRace(stop.OfficerRace),
                Nonbinary_Officer = stop.OfficerNonBinary ? "5" : string.Empty,
                NonPrimaryAgency = stop.OfficerWorksWithNonReportingAgency ? "Y" : "N",
            },
            Location = new Models.v2.Location
            {
                LocationType = CastToDojLocationType(stop.Location),
                Latitude = stop.Location.GeoLocation.Latitude.ToString(),
                Longitude = stop.Location.GeoLocation.Longitude.ToString(),
                BlockNumber = stop.Location.BlockNumber,
                StreetName = stop.Location.StreetName,
                // TODO: This needs to be updated when the stop is updated to capture cross street 1 and 2
                CrossStreet1 = stop.Location.Intersection,
                CrossStreet2 = stop.Location.Intersection,
                Highway = stop.Location.HighwayExit,
                ClosestExit = stop.Location.HighwayExit,
                OtherLocation = stop.Location.LandMark,
                City = stop.Location.City?.Codes?.Code,
                K12_Flag = stop.Location.School ? "Y" : string.Empty,
                K12Code = stop.Location.School ? stop.Location.SchoolName.Codes.Code : string.Empty
            },
            Is_ServCall = stop.StopInResponseToCFS ? "Y" : "N",
            ListPerson_Stopped = stop.ListPersonStopped.Any() ? CastToDojListPersonStopped(stop.ListPersonStopped, stop.Location.School) : null
        };

        return dojStop;
    }

    private string CastToDojLocationType(ILocation location)
    {
        // TODO: implement
        throw new NotImplementedException();
    }

    private string CastToDojStopType(string stopType)
    {
        // TODO: implement
        throw new NotImplementedException();
    }

    private ListOfficerEth CastToDojOfficerRace(string officerRace)
    {
        // TODO: implement
        throw new NotImplementedException();
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
                    Gend = CastToDojPerceivedGender(personStopped.PerceivedGender),
                    Nonbinary_Person = personStopped.NonBinaryPerson ? "5" : string.Empty,
                    SexualOrientation = personStopped.PerceivedSexualOrientation == "LGB+" ? "1" : "2",
                    Is_Unhoused = personStopped.PerceivedUnhoused ? "Y" : "N",
                },
                Is_Passenger = personStopped.PassengerInVehicle == true ? "Y" : "N",
                Is_Residence = personStopped.InsideResidence == true ? "Y" : "N",
                Is_Stud = isSchool ? personStopped.IsStudent ? "Y" : "N" : string.Empty,
                PrimaryReason = CastToDojPrimaryReason(personStopped),
                ListNonForceActTak = CastToDojListNonForceActTak(personStopped.ListNonForceActionsTakenDuringStop, personStopped.PropertySearchConsentGiven, personStopped.PersonSearchConsentGiven),
                ListForceActTak = CastToDojListForceActTak(personStopped.ListForceActionsTakenDuringStop),
                ListBasSearch = new Listbassearch { BasSearch = personStopped.ListBasisForSearch.Select(x => x.Key).ToList() },
                ConsentType = CastToDojConsentType(personStopped.ListBasisForSearch),
                BasSearch_N = personStopped.BasisForSearchBrief,
                ListBasSeiz = new Listbasseiz { BasSeiz = personStopped.ListBasisForPropertySeizure.Select(x => x.Key).ToList() },
                ListPropType = new Listproptype { PropType = personStopped.ListTypeOfPropertySeized.Select(x => x.Key).ToList() },
                ListCB = new Listcb { Cb = personStopped.ListContrabandOrEvidenceDiscovered.Select(x => x.Key).ToList() },
                ListResult = CastToDojListResult(personStopped.ListResultOfStop)

            };

            listDojPersonStopped.Add(dojPersonStopped);
        }

        return new Listperson_Stopped { Person_Stopped = listDojPersonStopped };
    }

    private string CastToDojConsentType(List<BasisForSearch> listBasisForSearch)
    {
        // TODO: implement
        throw new NotImplementedException();
    }

    private ListForceActTak CastToDojListForceActTak(List<ForceActionsTakenDuringStop> listForceActionsTakenDuringStop)
    {
        // TODO: implement
        throw new NotImplementedException();
    }

    private ListNonForceActTak CastToDojListNonForceActTak(List<NonForceActionsTakenDuringStop> listNonForceActionsTakenDuringStop, bool propertySearchConsentGiven, bool personSearchConsentGiven)
    {
        // TODO: implement
        throw new NotImplementedException();
    }

    private Primaryreason CastToDojPrimaryReason(PersonStopped personStopped)
    {
        var stopReasonKey = personStopped.ReasonForStop?.Key;

        Primaryreason primaryReason = new()
        {
            StReas = stopReasonKey,
            StReas_N = personStopped.ReasonForStopExplanation,
        };

        switch (stopReasonKey)
        {
            // TODO: add new stuff
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
            default: //All other stop reason keys
                break;
        }

        return primaryReason;
    }

    //public Listacttak CastToDojListActTak(List<ActionTakenDuringStop> listActionTakenDuringStop, bool isPropertySearchConsentGiven, bool isPersonSearchConsentGiven)
    //{
    //    var listActionsTaken = new List<Acttak>();

    //    foreach (ActionTakenDuringStop atds in listActionTakenDuringStop)
    //    {
    //        var isCon = "na";

    //        if (atds.Key == "17")
    //        {
    //            isCon = isPersonSearchConsentGiven ? "Y" : "N";
    //        }
    //        else if (atds.Key == "19")
    //        {
    //            isCon = isPropertySearchConsentGiven ? "Y" : "N";
    //        }

    //        Acttak acttak = new()
    //        {
    //            Act_CD = atds.Key,
    //            Is_Con = isCon
    //        };
    //        listActionsTaken.Add(acttak);
    //    }

    //    return new Listacttak { ActTak = listActionsTaken };
    //}

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

    private string CastToDojPerceivedGender(string perceivedGender)
    {
        return perceivedGender switch
        {
            "Cisgender Man/Boy" => ((int)PercievedGender.CisgenderManBoy).ToString(),
            "Cisgender Woman/Girl" => ((int)PercievedGender.CisgenderWomanGirl).ToString(),
            "Transgender Man/Boy" => ((int)PercievedGender.TransgenderManBoy).ToString(),
            "Transgender Woman/Girl" => ((int)PercievedGender.TransgenderWomanGirl).ToString(),
            _ => "",
        };
    }

    private string CastToDojOfficerGender(string perceivedGender)
    {
        return perceivedGender switch
        {
            "Cisgender Man/Boy" => ((int)PercievedGender.CisgenderManBoy).ToString(),
            "Cisgender Woman/Girl" => ((int)PercievedGender.CisgenderWomanGirl).ToString(),
            "Transgender Man/Boy" => ((int)PercievedGender.TransgenderManBoy).ToString(),
            "Transgender Woman/Girl" => ((int)PercievedGender.TransgenderWomanGirl).ToString(),
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