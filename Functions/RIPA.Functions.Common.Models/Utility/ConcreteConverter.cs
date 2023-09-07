using Newtonsoft.Json;
using System;

namespace RIPA.Functions.Common.Models.Utility;

public class ConcreteConverter<T> : JsonConverter
{
    public override bool CanConvert(Type objectType)
    {
        return (objectType == typeof(T));
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        var returnItem = serializer.Deserialize<T>(reader);
        return returnItem;
    }

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        serializer.Serialize(writer, value);
    }
}
