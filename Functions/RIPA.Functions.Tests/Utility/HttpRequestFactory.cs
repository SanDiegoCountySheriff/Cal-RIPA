using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Protocols;
using System.Collections.Generic;

namespace RIPA.Functions.Tests.Utility;

public static class HttpRequestFactory
{
    public static HttpRequest GenerateHttpRequest(object obj)
    {
        var context = new DefaultHttpContext();
        var request = context.Request;
        var queryParams = new Dictionary<string, StringValues>() { { "number", obj.ToString() } };
        request.Query = new QueryCollection(queryParams);
        return request;
    }
}
