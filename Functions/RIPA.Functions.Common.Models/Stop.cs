﻿using System;
using System.Runtime.Serialization;

namespace RIPA.Functions.Common.Models

{

    public class Submission
    {
        public Guid Id { get; set; }
        public DateTime DateSubmitted { get; set; }
        public string Status { get; set; }
        public string FileName { get; set; }
        public SubmissionError Error { get; set; }
    }
    public class SubmissionError
    {
        public string ErrorType { get; set; }
        public string Error { get; set; }
        public DateTime DateReported { get; set; }
        public string FileName { get; set; }
    }

    public enum PercievedGender
    {
        [EnumMember(Value = "Male")]
        Male = 1,
        [EnumMember(Value = "Female")]
        Female = 2,
        [EnumMember(Value = "Transgender man/boy")]
        TransgenderManBoy = 3,
        [EnumMember(Value = "Transgender woman/girl")]
        TransgenderWomanGirl = 4
    }

    public enum SubmissionErrorType
    {
        [EnumMember(Value = "FileLevelFatalError")]
        FileLevelFatalError,
        [EnumMember(Value = "RecordLevelError")]
        RecordLevelError
    }

    public enum SubmissionStatus
    {
        [EnumMember(Value = "Unsubmitted")]
        Unsubmitted,
        [EnumMember(Value = "Submitted")]
        Submitted,
        [EnumMember(Value = "Resubmitted")]
        Resubmitted,
        [EnumMember(Value = "Failed")]
        Failed
    }

    public class Stop

    {
        public string id { get; set; }
        public string Ori { get; set; }
        public string Agency { get; set; }
        public string OfficerID { get; set; }
        public string ExpYears { get; set; }
        public OfficerAssignment OfficerAssignment { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public DateTime StopDateTime { get { return DateTime.Parse(Date + " " + Time); } set { } }
        public Location Location { get; set; }
        public int StopDuration { get; set; }
        public bool StopInResponseToCFS { get; set; }
        public PersonStopped[] ListPersonStopped { get; set; }
        public Submission[] ListSubmission { get; set; }
        public string Status { get; set; }
        public bool IsPiiFound { get; set; }
    }


    public class OfficerAssignment
    {
        public string Key { get; set; }
        public string Type { get; set; }
        public string OtherType { get; set; }
    }

    public class Location
    {
        public bool ToggleLocationOptions { get; set; }
        public string Intersection { get; set; }
        public string BlockNumber { get; set; }
        public string LandMark { get; set; }
        public string StreetName { get; set; }
        public string HighwayExit { get; set; }
        public City City { get; set; }
        public Beat Beat { get; set; }
        public bool School { get; set; }
        public SchoolName SchoolName { get; set; }
        public bool OutOfCounty { get; set; }
    }

    public class City
    {
        public Codes Codes { get; set; }
    }

    public class Codes
    {
        public string Code { get; set; }
        public string Text { get; set; }
    }

    public class Beat
    {
        public Codes Codes { get; set; }
    }

    public class SchoolName
    {
        public Codes Codes { get; set; }
    }

    public class PersonStopped
    {
        public string Id { get; set; }
        public bool IsStudent { get; set; }
        public PerceivedRace[] ListPerceivedRace { get; set; }
        public bool PerceivedLimitedEnglish { get; set; }
        public PerceivedOrKnownDisability[] ListPerceivedOrKnownDisability { get; set; }
        public int PerceivedAge { get; set; }
        public string PerceivedGender { get; set; }
        public bool GenderNonconforming { get; set; }
        public bool PerceivedLgbt { get; set; }
        public ReasonForStop ReasonForStop { get; set; }
        public string ReasonForStopExplanation { get; set; }
        public ActionTakenDuringStop[] ListActionTakenDuringStop { get; set; }
        public bool PersonSearchConsentGiven { get; set; }
        public bool PropertySearchConsentGiven { get; set; }
        public ContrabandOrEvidenceDiscovered[] ListContrabandOrEvidenceDiscovered { get; set; }
        public BasisForSearch[] ListBasisForSearch { get; set; }
        public string BasisForSearchBrief { get; set; }
        public BasisForPropertySeizure[] ListBasisForPropertySeizure { get; set; }
        public TypeOfPropertySeized[] ListTypeOfPropertySeized { get; set; }
        public ResultOfStop[] ListResultOfStop { get; set; }
    }

    public class TypeOfPropertySeized
    {
        public string Key { get; set; }
        public string Type { get; set; }
    }

    public class BasisForPropertySeizure
    {
        public string Key { get; set; }
        public string Basis { get; set; }
    }

    public class BasisForSearch
    {
        public string Key { get; set; }
        public string Basis { get; set; }
    }

    public class ReasonForStop
    {
        public string Key { get; set; }
        public string Reason { get; set; }
        public Detail[] ListDetail { get; set; }
        public Codes[] ListCodes { get; set; }
    }

    public class Detail
    {
        public string Reason { get; set; }
        public string Key { get; set; }
    }

    public class PerceivedRace
    {
        public string Race { get; set; }
        public int Key { get; set; }
    }

    public class PerceivedOrKnownDisability
    {
        public string Disability { get; set; }
        public string Key { get; set; }
    }

    public class ActionTakenDuringStop
    {
        public string Action { get; set; }
        public string Key { get; set; }
    }

    public class ContrabandOrEvidenceDiscovered
    {
        public string Contraband { get; set; }
        public string Key { get; set; }
    }

    public class ResultOfStop
    {
        public string Result { get; set; }
        public Codes[] ListCodes { get; set; }
        public int Key { get; set; }
    }

}
