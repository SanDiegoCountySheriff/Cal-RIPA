using Newtonsoft.Json;
using RIPA.Functions.Common.Models.Utility;
using System;
using System.Collections.Generic;

namespace RIPA.Functions.Common.Models;

public class Submission
{
    public Guid Id { get; set; }
    public DateTime DateSubmitted { get; set; }
    public string Status { get; set; }
    public string FileName { get; set; }
    [JsonConverter(typeof(ConcreteConverter<SubmissionError[]>))]
    public List<SubmissionError> ListSubmissionError { get; set; }
}
