using RIPA.Functions.Common.Models;
using RIPA.Functions.Submission.Models;
using RIPA.Functions.Submission.Services.REST.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace RIPA.Functions.Submission.Services.REST
{
    public class StopService : IStopService
    {
        private static string _getStopUrl;
        private static string _putStopUrl;
        private static HttpClient _httpClient;
        public StopService(HttpClient httpClient, string getStopUrl, string putStopUrl)
        {
            _httpClient = httpClient;
            _getStopUrl = getStopUrl;
            _putStopUrl = putStopUrl;
        }

        public async Task<Stop> GetStopAsync(string id)
        {
            var response = await _httpClient.GetAsync(_getStopUrl.Replace("{Id}", id));

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Failed Get Stop for submission by stop id: {id}");
            }
            var jsonString = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            Stop stop = JsonSerializer.Deserialize<Stop>(jsonString, options);
            return stop;
        }

        public async Task<Stop> PutStopAsync(Stop stop)
        {
            var httpContent = new StringContent(JsonSerializer.Serialize(stop), UnicodeEncoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync(_putStopUrl.Replace("{Id}", stop.id), httpContent);

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new Exception($"Failed Put Stop Submission for stop id: {stop.id}");
            }
            return stop;

        }

        public Stop NewSubmission(Stop stop, DateTime dateSubmitted, Guid submissionId, string fileName)
        {
            Common.Models.Submission submission = new Common.Models.Submission
            {
                DateSubmitted = dateSubmitted,
                Id = submissionId,
                Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Submitted),
                FileName = fileName
            };

            if (stop.ListSubmission == null)
            {
                stop.ListSubmission = new Common.Models.Submission[0];
            }

            var submissions = stop.ListSubmission.ToList();
            submissions.Add(submission);

            stop.ListSubmission = submissions.ToArray();
            stop.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Submitted);
            return stop;
        }

        public Stop ErrorSubmission(Stop stop, string errorType, string error, string fileName)
        {
            var pendingSubmissions = stop.ListSubmission.Where(x => x.FileName == fileName);
            foreach (var submission in pendingSubmissions)
            {
                submission.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed);
                submission.Error = new SubmissionError
                {
                    DateReported = DateTime.UtcNow,
                    Error = error,
                    ErrorType = errorType,
                    FileName = fileName
                };
            }
            stop.Status = Enum.GetName(typeof(SubmissionStatus), SubmissionStatus.Failed);
            return stop;
        }

        public DojStop CastToDojStop(Stop stop)
        {
            DojStop dojStop = new DojStop
            {
                LEARecordID = stop.id,
                ORI = stop.Ori,
                TX_Type = "I",
                SDate = stop.Date,
                STime = stop.Time,
                SDur = stop.StopDuration.ToString(),
                Officer = new Officer
                {
                    UID = stop.OfficerID,
                    ExpYears = stop.ExpYears,
                    AT = stop.OfficerAssignment.Key,
                    ATOth = stop.OfficerAssignment.OtherType,
                    Proxy = ""
                },
                Location = new RIPA.Functions.Submission.Models.Location
                {
                    Loc = CastToDojLocation(stop.Location),
                    City = stop.Location.City.Codes.Code,
                    K12_Flag = stop.Location.School ? "Y" : null,
                    K12Code = stop.Location.School ? stop.Location.SchoolName.Codes.Code : null
                },
                Is_ServCall = stop.StopInResponseToCFS ? "Y" : "N",
                ListPerson_Stopped = CastToDojListPersonStopped(stop.ListPersonStopped)
            };
            return dojStop;
        }

        public static string CastToDojLocation(RIPA.Functions.Common.Models.Location location)
        {
            string dojLocation = location.Intersection;
            if (location.BlockNumber != "")
                dojLocation += " " + location.BlockNumber;
            if (location.LandMark != "")
                dojLocation += " " + location.LandMark;
            if (location.StreetName != "")
                dojLocation += " " + location.StreetName;
            if (location.HighwayExit != "")
                dojLocation += " " + location.HighwayExit;
            return dojLocation;
        }

        public static Listperson_Stopped CastToDojListPersonStopped(RIPA.Functions.Common.Models.PersonStopped[] listPersonStopped)
        {
            Listperson_Stopped dojListPersonStopped = new Listperson_Stopped();
            foreach (PersonStopped personStopped in listPersonStopped)
            {
                Person_Stopped dojPersonStopped = new Person_Stopped
                {
                    PID = personStopped.Id,
                    Perc = new Perc
                    {
                        ListEthn = new Listethn
                        {
                            Ethn = personStopped.ListPerceivedRace.Select(x => x.Key.ToString()).ToArray()
                        },
                        Age = personStopped.PerceivedAge.ToString(),
                        Is_LimEng = personStopped.PerceivedLimitedEnglish ? "Y" : "N",
                        ListDisb = new Listdisb
                        {
                            Disb = personStopped.ListPerceivedOrKnownDisability.Select(x => x.Key.ToString()).ToArray()
                        },
                        Gend = personStopped.PerceivedGender,
                        LGBT = personStopped.PerceivedLgbt,
                        GenNC = personStopped.GenderNonconforming ? "Y" : "N"
                    },
                    PrimaryReason = CastToDojPrimaryReason(personStopped),
                    ListActTak = CastToDojListActTak(personStopped.ListActionTakenDuringStop),
                    ListCB = new Listcb { Cb = personStopped.ListContrabandOrEvidenceDiscovered.Select(x => x.Key).ToArray() },
                    ListResult = CastToDojListResult(personStopped.ListResultOfStop)

                };
            }
            return new Listperson_Stopped { };
        }

        public static Primaryreason CastToDojPrimaryReason(PersonStopped personStopped)
        {
            var stopReasonKey = personStopped.ReasonForStop.Key;
            Primaryreason primaryReason = new Primaryreason
            {
                StReas = stopReasonKey,
                StReas_N = personStopped.ReasonForStopExplanation,
            };

            switch (stopReasonKey)
            {
                case "1": //Traffic Violation
                    primaryReason.Tr_ID = personStopped.ReasonForStop.ListDetail.FirstOrDefault().Key;
                    primaryReason.Tr_O_CD = personStopped.ReasonForStop.ListCodes.FirstOrDefault().Code;
                    break;
                case "2": //Reasonable Suspicion
                    primaryReason.ListSusp_T = new Listsusp_T { Susp_T = personStopped.ReasonForStop.ListDetail.FirstOrDefault().Key.Split(",") };
                    primaryReason.Susp_O_CD = personStopped.ReasonForStop.ListCodes.FirstOrDefault().Code;
                    break;
                case "7": //Education Code
                    primaryReason.EDU_Sec_CD = personStopped.ReasonForStop.ListDetail.FirstOrDefault().Key;
                    primaryReason.EDU_SecDiv_CD = personStopped.ReasonForStop.ListCodes.FirstOrDefault().Code;
                    break;
                default: //All other stop reason keys
                    break;
            }
            return primaryReason;
        }

        public static Listacttak CastToDojListActTak(Common.Models.ActionTakenDuringStop[] listActionTakenDuringStop)
        {
            Listacttak listacttak = new Listacttak();
            var listActionsTaken = new List<Acttak>();
            foreach (ActionTakenDuringStop atds in listActionTakenDuringStop)
            {
                Acttak acttak = new Acttak
                {
                    Act_CD = atds.Key,
                    Is_Con = atds.Key.Length == 2 ? atds.Action : "na"
                };
                listActionsTaken.Add(acttak);
            }
            listacttak.ActTak = listActionsTaken.ToArray();
            return listacttak;
        }

        public static Listresult CastToDojListResult(Common.Models.ResultOfStop[] listResultOfStop)
        {
            Listresult listresult = new Listresult();
            var listResults = new List<Result>();
            foreach (ResultOfStop ros in listResultOfStop)
            {
                Result result = new Result
                {
                    ResCD = ros.Result,
                    Res_O_CD = ros.ListCodes.Select(x => x.Code).ToArray()
                };
                listResults.Add(result);
            }
            return listresult;
        }

    }
}
