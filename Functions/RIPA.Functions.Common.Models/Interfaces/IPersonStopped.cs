namespace RIPA.Functions.Common.Models.Interfaces;

public interface IPersonStopped
{
    string BasisForSearchBrief { get; set; }
    bool BasisForSearchPiiFound { get; set; }
    bool GenderNonconforming { get; set; }
    string Id { get; set; }
    bool IsStudent { get; set; }
    ActionTakenDuringStop[] ListActionTakenDuringStop { get; set; }
    BasisForPropertySeizure[] ListBasisForPropertySeizure { get; set; }
    BasisForSearch[] ListBasisForSearch { get; set; }
    ContrabandOrEvidenceDiscovered[] ListContrabandOrEvidenceDiscovered { get; set; }
    PerceivedOrKnownDisability[] ListPerceivedOrKnownDisability { get; set; }
    PerceivedRace[] ListPerceivedRace { get; set; }
    ResultOfStop[] ListResultOfStop { get; set; }
    TypeOfPropertySeized[] ListTypeOfPropertySeized { get; set; }
    int PerceivedAge { get; set; }
    string PerceivedGender { get; set; }
    bool PerceivedLgbt { get; set; }
    bool PerceivedLimitedEnglish { get; set; }
    bool PersonSearchConsentGiven { get; set; }
    bool PropertySearchConsentGiven { get; set; }
    ReasonForStop ReasonForStop { get; set; }
    string ReasonForStopExplanation { get; set; }
    bool ReasonForStopPiiFound { get; set; }
}