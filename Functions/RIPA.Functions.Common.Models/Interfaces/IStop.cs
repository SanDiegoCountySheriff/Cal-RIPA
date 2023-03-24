using System;

namespace RIPA.Functions.Common.Models.Interfaces;

public interface IStop
{
    string OfficerId { get; set; }
    string Id { get; set; }
    string Date { get; set; }
    string Time { get; set; }
    string EditStopOfficerId { get; set; }
    ILocation Location { get; set; }
    string Status { get; set; }
    string Ori { get; set; }
    bool IsEdited { get; set; }
    ISubmission[] ListSubmission { get; set; }
    DateTime StopDateTime { get; }
    int StopDuration { get; }
    string ExpYears { get; }
    IOfficerAssignment OfficerAssignment { get; }
    bool StopInResponseToCFS { get; }
    IPersonStopped[] ListPersonStopped { get; }
    bool IsPiiFound { get; set; }
    bool OverridePii { get; set; }
}
