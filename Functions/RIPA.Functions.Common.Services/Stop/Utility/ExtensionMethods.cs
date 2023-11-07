using System.Collections.Generic;

namespace RIPA.Functions.Common.Services.Stop.Utility;

public static class ExtensionMethods
{
    public static IEnumerable<T> Safe<T>(this IEnumerable<T> source)
    {
        if (source == null)
        {
            yield break;
        }

        foreach (var item in source)
        {
            yield return item;
        }
    }
}
