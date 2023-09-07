using Newtonsoft.Json;

namespace RIPA.Functions.Submission.Models.v1;

public class DojStop
{
    public string LEARecordID { get; set; }
    public string BatchID { get; set; }
    public string ORI { get; set; }
    public string TX_Type { get; set; }
    public string Is_NFIA { get; set; }
    public string SDate { get; set; }
    public string STime { get; set; }
    public string SDur { get; set; }
    [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
    public Officer Officer { get; set; }
    public Location Location { get; set; }
    public string Is_ServCall { get; set; }
    public Listperson_Stopped ListPerson_Stopped { get; set; }
}
