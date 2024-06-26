﻿using RIPA.Functions.Common.Models.Interfaces;
using System.Collections.Generic;

namespace RIPA.Functions.Common.Models.v1;

public class PersonStopped : IPersonStopped
{
    public string Id { get; set; }
    public bool IsStudent { get; set; }
    public PerceivedRace[] ListPerceivedRace { get; set; }
    public bool PerceivedLimitedEnglish { get; set; }
    public PerceivedOrKnownDisability[] ListPerceivedOrKnownDisability { get; set; }
    public int PerceivedAge { get; set; }
    public string PerceivedGender { get; set; }
    public bool GenderNonconforming { get; set; }
    public bool PerceivedLgbt { get; set; }
    public ReasonForStop ReasonForStop { get; set; }
    public string ReasonForStopExplanation { get; set; }
    public bool ReasonForStopPiiFound { get; set; }
    public ActionTakenDuringStop[] ListActionTakenDuringStop { get; set; }
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
