using System;
using System.Collections.Generic;

namespace RIPA.Functions.Common.Models.Interfaces;

public interface IStop
{
    string Agency { get; set; }
    string Date { get; set; }
    string EditStopExplanation { get; set; }
    string EditStopOfficerId { get; set; }
    string ExpYears { get; set; }
    string Id { get; set; }
    bool IsEdited { get; set; }
    bool IsPiiFound { get; set; }
    AgencyQuestion[] ListAgencyQuestion { get; set; }
    IPersonStopped[] ListPersonStopped { get; set; }
    List<Submission> ListSubmission { get; set; }
    ILocation Location { get; set; }
    IOfficerAssignment OfficerAssignment { get; set; }
    string OfficerId { get; set; }
    string OfficerName { get; set; }
    string Ori { get; set; }
    bool OverridePii { get; set; }
    PiiEntity[] PiiEntities { get; set; }
    string Status { get; set; }
    DateTime StopDateTime { get; set; }
    int StopDuration { get; set; }
    bool StopInResponseToCFS { get; set; }
    StopVersion? StopVersion { get; set; }
    Telemetry Telemetry { get; set; }
    string Time { get; set; }
    bool? Nfia { get; set; }
    bool IsLateSubmission { get; set; }
}