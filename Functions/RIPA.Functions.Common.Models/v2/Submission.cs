using System;
using Newtonsoft.Json;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Common.Models.Utility;

namespace RIPA.Functions.Common.Models.v2;

public class Submission : ISubmission
{
    public Guid Id { get; set; }
    public DateTime DateSubmitted { get; set; }
    public string Status { get; set; }
    public string FileName { get; set; }
    [JsonConverter(typeof(ConcreteConverter<SubmissionError[]>))]
    public ISubmissionError[] ListSubmissionError { get; set; }
}
