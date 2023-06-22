﻿using Newtonsoft.Json;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Models.Utility;
using System;

namespace RIPA.Functions.Common.Models.v2;

public class Stop : IStop
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }
    public string Ori { get; set; }
    public string Agency { get; set; }
    public string OfficerId { get; set; }
    public string OfficerName { get; set; }
    public string ExpYears { get; set; }
    [JsonConverter(typeof(ConcreteConverter<OfficerAssignment>))]
    public IOfficerAssignment OfficerAssignment { get; set; }
    public string Date { get; set; }
    public string Time { get; set; }
    public DateTime StopDateTime
    {
        get
        {
            if (Date != null && Time != null)
            {
                return DateTime.Parse(Date + " " + Time);
            }
            else
            {
                return DateTime.MinValue;
            }
        }
        set { }
    }
    [JsonConverter(typeof(ConcreteConverter<Location>))]
    public ILocation Location { get; set; }
    public int StopDuration { get; set; }
    public bool StopInResponseToCFS { get; set; }
    [JsonConverter(typeof(ConcreteConverter<PersonStopped[]>))]
    public IPersonStopped[] ListPersonStopped { get; set; }
    [JsonConverter(typeof(ConcreteConverter<Submission[]>))]
    public ISubmission[] ListSubmission { get; set; }
    public string Status { get; set; }
    public bool IsPiiFound { get; set; }
    public PiiEntity[] PiiEntities { get; set; }
    public bool OverridePii { get; set; }
    public string EditStopExplanation { get; set; }
    public string EditStopOfficerId { get; set; }
    public bool IsEdited { get; set; }
    [JsonProperty(PropertyName = "telemetry")]
    public Telemetry Telemetry { get; set; }
    public AgencyQuestion[] ListAgencyQuestion { get; set; }
    public StopVersion? StopVersion { get; set; }
    public string StopType { get; set; }
}
