namespace RIPA.Functions.Common.Models.v2;

/// <summary>
/// AB 2234 - San Diego Electric Bicycle Safety Pilot Program (Vehicle Code §21214.7)
/// E-Bike information for stops involving persons under 12 years of age
/// </summary>
public class EbikeInfo
{
    public bool? StopInvolvedEbike { get; set; }
    public int? EbikeClass { get; set; }
    public int? VerifiedAge { get; set; }
    public bool? DeclinedToProvieOrUncooperative { get; set; }
    public bool? CitationIssued { get; set; }
    public string ViolationCode { get; set; }
    public bool? TrainingCourseCompleted { get; set; }
}
