using RIPA.Functions.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using static RIPA.Functions.Submission.Services.ServiceBus.ResultServiceBusService;

namespace RIPA.Functions.Submission.Utility;

public static class DojResultXmlParser
{
    private const string FatalSeverity = "FATAL";
    private const string InformationalSeverity = "INFORMATIONAL";

    public static List<ResultMessage> Parse(string xml)
    {
        var results = new List<ResultMessage>();

        if (string.IsNullOrWhiteSpace(xml))
        {
            return results;
        }

        var document = XDocument.Parse(xml);

        foreach (var stopElement in document.Descendants().Where(x => x.Name.LocalName == "Stop"))
        {
            var fileName = GetValue(stopElement, "FileName");
            var leaRecordId = GetValue(stopElement, "LeaRecId");
            var isFileLevel = string.IsNullOrWhiteSpace(leaRecordId);
            var errors = new List<ResultError>();

            foreach (var messageElement in stopElement.Elements().Where(x => x.Name.LocalName == "Message"))
            {
                var severity = GetValue(messageElement, "MsgSeverity");

                if (string.Equals(severity, InformationalSeverity, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var code = GetValue(messageElement, "MessageCd");
                var fieldName = GetValue(messageElement, "WsName");
                var text = GetValue(messageElement, "MsgText");
                var message = string.IsNullOrWhiteSpace(fieldName) ? $"{code}: {text}" : $"{code}: {fieldName} - {text}";
                var isFatal = string.Equals(severity, FatalSeverity, StringComparison.OrdinalIgnoreCase);

                if (isFatal && isFileLevel)
                {
                    errors.Add(new ResultError
                    {
                        Code = SubmissionErrorCode.FLFE.ToString(),
                        ErrorType = SubmissionErrorType.FileLevelFatalError.ToString(),
                        Message = message
                    });
                }
                else if (isFatal)
                {
                    errors.Add(new ResultError
                    {
                        Code = SubmissionErrorCode.RLFE.ToString(),
                        ErrorType = SubmissionErrorType.RecordLevelFatalError.ToString(),
                        Message = message
                    });
                }
                else
                {
                    errors.Add(new ResultError
                    {
                        Code = code,
                        ErrorType = SubmissionErrorType.RecordLevelError.ToString(),
                        Message = message
                    });
                }
            }

            if (errors.Count == 0)
            {
                continue;
            }

            results.Add(new ResultMessage
            {
                FileName = fileName,
                LeaRecordId = leaRecordId,
                ErrorType = errors.Any(x => x.ErrorType == SubmissionErrorType.FileLevelFatalError.ToString())
                    ? SubmissionErrorType.FileLevelFatalError.ToString()
                    : errors.Any(x => x.ErrorType == SubmissionErrorType.RecordLevelFatalError.ToString())
                        ? SubmissionErrorType.RecordLevelFatalError.ToString()
                        : SubmissionErrorType.RecordLevelError.ToString(),
                Errors = errors
            });
        }

        return results;
    }

    private static string GetValue(XElement parent, string localName)
    {
        return parent.Elements().FirstOrDefault(x => x.Name.LocalName == localName)?.Value?.Trim();
    }
}
