namespace RIPA.Functions.Submission.Models.v2;

public class Person_Stopped
{
    public string PID { get; set; }
    public Perc Perc { get; set; }
    public string Is_Passenger { get; set; }
    public string Is_Residence { get; set; }
    public string Is_Stud { get; set; }
    public Primaryreason PrimaryReason { get; set; }
    public ListNonForceActTak ListNonForceActTak { get; set; }
    public ListForceActTak ListForceActTak { get; set; }
    public Listbassearch ListBasSearch { get; set; }
    public string ConsentType { get; set; }
    public string BasSearch_N { get; set; }
    public Listbasseiz ListBasSeiz { get; set; }
    public Listproptype ListPropType { get; set; }
    public Listcb ListCB { get; set; }
    public Listresult ListResult { get; set; }
    public ListStReas_Given ListStReas_Given { get; set; }
}
