using System;
namespace RIPA.Functions.Common.Models
{
    public class StopQuery
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? IsPII { get; set; }
        public string ErrorCode { get; set; }
        public string Status { get; set; }
        public bool? IsSubmitted { get; set; }
        public string OfficerId { get; set; }
        public int Limit { get; set; }
        public int Offset { get; set; }
        public string OrderBy { get; set; }
        public string Order { get; set; }
        public bool? IsEdited { get; set; }
    }
}
