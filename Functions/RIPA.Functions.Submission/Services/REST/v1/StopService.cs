using Microsoft.Extensions.Logging;
using RIPA.Functions.Common.Models;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Models.v1;
using RIPA.Functions.Submission.Models.v1;
using RIPA.Functions.Submission.Services.REST.v1.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RIPA.Functions.Submission.Services.REST.v1;

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
            Officer = new Officer
            {
                UID = stop.OfficerId,
                ExpYears = stop.ExpYears,
                AT = stop.OfficerAssignment.Key,
                ATOth = stop.OfficerAssignment.OtherType,
                Proxy = ""
            },
            Location = new Models.v1.Location
            {
                Loc = CastToDojLocation(stop.Location as Common.Models.v1.Location),
                City = stop.Location.City?.Codes?.Code,
                K12_Flag = stop.Location.School ? "Y" : string.Empty,
                K12Code = stop.Location.School ? stop.Location.SchoolName.Codes.Code : string.Empty
            },
            Is_ServCall = stop.StopInResponseToCFS ? "Y" : "N",
            ListPerson_Stopped = stop.ListPersonStopped.Any() ? CastToDojListPersonStopped(stop.ListPersonStopped, stop.Location.School) : null
        };

        return dojStop;
    }

    public string CastToDojLocation(Common.Models.v1.Location location)
    {
        string dojLocation = location.Intersection;

        if (location.BlockNumber != "")
        {
            dojLocation += " " + location.BlockNumber;
        }

        if (location.LandMark != "")
        {
            dojLocation += " " + location.LandMark;
        }

        if (location.StreetName != "")
        {
            dojLocation += " " + location.StreetName;
        }

        if (location.HighwayExit != "")
        {
            dojLocation += " " + location.HighwayExit;
        }

        return dojLocation;
    }

    public Listperson_Stopped CastToDojListPersonStopped(List<IPersonStopped> listPersonStopped, bool isSchool)
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
                    Gend = CastToDojPercievedGender(personStopped.PerceivedGender),
                    LGBT = personStopped.PerceivedLgbt ? "Y" : "N",
                    GendNC = personStopped.GenderNonconforming ? "5" : string.Empty
                },
                Is_Stud = isSchool ? personStopped.IsStudent ? "Y" : "N" : string.Empty,
                PrimaryReason = CastToDojPrimaryReason(personStopped),
                ListActTak = CastToDojListActTak(personStopped.ListActionTakenDuringStop, personStopped.PropertySearchConsentGiven, personStopped.PersonSearchConsentGiven),
                ListBasSearch = new Listbassearch { BasSearch = personStopped.ListBasisForSearch.Select(x => x.Key).ToList() },
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

    public Primaryreason CastToDojPrimaryReason(PersonStopped personStopped)
    {
        var stopReasonKey = personStopped.ReasonForStop?.Key;

        Primaryreason primaryReason = new()
        {
            StReas = stopReasonKey,
            StReas_N = personStopped.ReasonForStopExplanation,
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
            default: //All other stop reason keys
                break;
        }

        return primaryReason;
    }

    public Listacttak CastToDojListActTak(List<ActionTakenDuringStop> listActionTakenDuringStop, bool isPropertySearchConsentGiven, bool isPersonSearchConsentGiven)
    {
        var listActionsTaken = new List<Acttak>();

        foreach (ActionTakenDuringStop atds in listActionTakenDuringStop)
        {
            var isCon = "na";

            if (atds.Key == "17")
            {
                isCon = isPersonSearchConsentGiven ? "Y" : "N";
            }
            else if (atds.Key == "19")
            {
                isCon = isPropertySearchConsentGiven ? "Y" : "N";
            }

            Acttak acttak = new()
            {
                Act_CD = atds.Key,
                Is_Con = isCon
            };
            listActionsTaken.Add(acttak);
        }

        return new Listacttak { ActTak = listActionsTaken };
    }

    public Listresult CastToDojListResult(List<ResultOfStop> listResultOfStop)
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

    public string CastToDojPercievedGender(string percievedGender)
    {
        return percievedGender switch
        {
            "Male" => ((int)PercievedGender.Male).ToString(),
            "Female" => ((int)PercievedGender.Female).ToString(),
            "Transgender Male" => ((int)PercievedGender.TransgenderManBoy).ToString(),
            "Transgender Female" => ((int)PercievedGender.TransgenderWomanGirl).ToString(),
            _ => "",
        };
    }

    public string CastToDojTXType(Stop stop)
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
