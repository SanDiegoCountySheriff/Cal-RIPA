﻿using System;
using System.Collections.Generic;

namespace RIPA.Functions.Common.Models;

public class Telemetry
{
    public object Template { get; set; }
    public bool FormCached { get; set; }
    public bool Offline { get; set; }
    public List<Liststeptrace> ListStepTrace { get; set; }
    public string LookupCacheDate { get; set; }
    public bool PullFromReasonCode { get; set; }
}

public class Liststeptrace
{
    public int Index { get; set; }
    public DateTime StartTimeStamp { get; set; }
    public DateTime EndTimeStamp { get; set; }
}
