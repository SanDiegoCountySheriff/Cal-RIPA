using System.Collections.Generic;

namespace RIPA.Functions.Common.Models.Interfaces;

public interface IPersonStopped
{
    string BasisForSearchBrief { get; set; }
    bool BasisForSearchPiiFound { get; set; }
    string Id { get; set; }
    bool IsStudent { get; set; }
    List<BasisForPropertySeizure> ListBasisForPropertySeizure { get; set; }
    List<BasisForSearch> ListBasisForSearch { get; set; }
    List<ContrabandOrEvidenceDiscovered> ListContrabandOrEvidenceDiscovered { get; set; }
    List<PerceivedOrKnownDisability> ListPerceivedOrKnownDisability { get; set; }
    List<PerceivedRace> ListPerceivedRace { get; set; }
    List<ResultOfStop> ListResultOfStop { get; set; }
    List<TypeOfPropertySeized> ListTypeOfPropertySeized { get; set; }
    int PerceivedAge { get; set; }
    string PerceivedGender { get; set; }
    bool PerceivedLimitedEnglish { get; set; }
    bool PersonSearchConsentGiven { get; set; }
    bool PropertySearchConsentGiven { get; set; }
    ReasonForStop ReasonForStop { get; set; }
    string ReasonForStopExplanation { get; set; }
    bool ReasonForStopPiiFound { get; set; }
}