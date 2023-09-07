using RIPA.Functions.Common.Models.Interfaces;
using System.Collections.Generic;

namespace RIPA.Functions.Common.Models.v2;

public class PersonStopped : IPersonStopped
{
    public string Id { get; set; }
    public bool IsStudent { get; set; }
    public PerceivedRace[] ListPerceivedRace { get; set; }
    public bool PerceivedLimitedEnglish { get; set; }
    public bool PerceivedUnhoused { get; set; }
    public PerceivedOrKnownDisability[] ListPerceivedOrKnownDisability { get; set; }
    public int PerceivedAge { get; set; }
    public string PerceivedGender { get; set; }
    public bool NonBinaryPerson { get; set; }
    public string PerceivedSexualOrientation { get; set; }
    public ReasonForStop ReasonForStop { get; set; }
    public List<ReasonGivenForStop> ReasonGivenForStop { get; set; }
    public string ReasonForStopExplanation { get; set; }
    public string ReasonGivenForStopExplanation { get; set; }
    public bool? PassengerInVehicle { get; set; }
    public bool? InsideResidence { get; set; }
    public bool ReasonForStopPiiFound { get; set; }
    public NonForceActionsTakenDuringStop[] ListNonForceActionsTakenDuringStop { get; set; }
    public ForceActionsTakenDuringStop[] ListForceActionsTakenDuringStop { get; set; }
    public bool PersonSearchConsentGiven { get; set; }
    public bool PropertySearchConsentGiven { get; set; }
    public ContrabandOrEvidenceDiscovered[] ListContrabandOrEvidenceDiscovered { get; set; }
    public BasisForSearch[] ListBasisForSearch { get; set; }
    public string BasisForSearchBrief { get; set; }
    public bool BasisForSearchPiiFound { get; set; }
    public BasisForPropertySeizure[] ListBasisForPropertySeizure { get; set; }
    public TypeOfPropertySeized[] ListTypeOfPropertySeized { get; set; }
    public ResultOfStop[] ListResultOfStop { get; set; }
}
