using Newtonsoft.Json;

namespace RIPA.Functions.Submission.Models;

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

public class Officer
{
    public string UID { get; set; }
    public string Proxy { get; set; }
    public string ExpYears { get; set; }
    public string AT { get; set; }
    public string ATOth { get; set; }
}

public class Location
{
    public string Loc { get; set; }
    public string City { get; set; }
    public string K12_Flag { get; set; }
    public string K12Code { get; set; }
}

public class Listperson_Stopped
{
    public Person_Stopped[] Person_Stopped { get; set; }
}

public class Person_Stopped
{
    public string PID { get; set; }
    public Perc Perc { get; set; }
    public string Is_Stud { get; set; }
    public Primaryreason PrimaryReason { get; set; }
    public Listacttak ListActTak { get; set; }
    public Listbassearch ListBasSearch { get; set; }
    public string BasSearch_N { get; set; }
    public Listbasseiz ListBasSeiz { get; set; }
    public Listproptype ListPropType { get; set; }
    public Listcb ListCB { get; set; }
    public Listresult ListResult { get; set; }
}

public class Perc
{
    public Listethn ListEthn { get; set; }
    public string Age { get; set; }
    public string Is_LimEng { get; set; }
    public Listdisb ListDisb { get; set; }
    public string Gend { get; set; }
    public string GendNC { get; set; }
    public string LGBT { get; set; }
}

public class Listethn
{
    public string[] Ethn { get; set; }
}

public class Listdisb
{
    public string[] Disb { get; set; }
}

public class Primaryreason
{
    public string StReas { get; set; }
    public string StReas_N { get; set; }
    public string Tr_ID { get; set; }
    public string Tr_O_CD { get; set; }
    public string EDU_sec_CD { get; set; }
    public string EDU_subDiv_CD { get; set; }
    public Listsusp_T ListSusp_T { get; set; }
    public string Susp_O_CD { get; set; }
}

public class Listsusp_T
{
    public object[] Susp_T { get; set; }
}

public class Listacttak
{
    public Acttak[] ActTak { get; set; }
}

public class Acttak
{
    public string Act_CD { get; set; }
    public string Is_Con { get; set; }
}

public class Listbassearch
{
    public string[] BasSearch { get; set; }
}

public class Listbasseiz
{
    public string[] BasSeiz { get; set; }
}

public class Listproptype
{
    public string[] PropType { get; set; }
}

public class Listcb
{
    public string[] Cb { get; set; }
}

public class Listresult
{
    public Result[] Result { get; set; }
}

public class Result
{
    public string ResCD { get; set; }
    public string[] Res_O_CD { get; set; }
}
