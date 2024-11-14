using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Protocols;
using System.Collections.Generic;

namespace RIPA.Functions.Tests.Utility;

public static class HttpRequestFactory
{
    public static DefaultHttpRequest GenerateHttpRequest(object obj)
    {
        var request = new DefaultHttpRequest(new DefaultHttpContext());
        var queryParams = new Dictionary<string, StringValues>() { { "number", obj.ToString() } };
        request.Query = new QueryCollection(queryParams);
        return request;
    }
}
