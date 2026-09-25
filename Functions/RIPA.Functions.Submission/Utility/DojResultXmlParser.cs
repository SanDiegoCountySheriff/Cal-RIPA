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
    public const string SuccessfulRecStat = "5";
    public const string NfiaRecStat = "7";

    private const string StopElement = "Stop";
    private const string FileNameElement = "FileName";
    private const string LeaRecordIdElement = "LeaRecId";
    private const string DojRecordIdElement = "DojRecId";
    private const string RecStatElement = "RecStat";
    private const string MessageElement = "Message";
    private const string MessageCodeElement = "MessageCd";
    private const string FieldNameElement = "WsName";
    private const string SeverityElement = "MsgSeverity";
    private const string MessageTextElement = "MsgText";

    public static List<ResultMessage> Parse(string xml)
    {
        var results = new List<ResultMessage>();

        if (string.IsNullOrWhiteSpace(xml))
        {
            return results;
        }

        var document = XDocument.Parse(xml);

        foreach (var stopElement in document.Descendants().Where(x => x.Name.LocalName == StopElement))
        {
            var fileName = GetValue(stopElement, FileNameElement);
            var leaRecordId = GetValue(stopElement, LeaRecordIdElement);
            var isFileLevel = string.IsNullOrWhiteSpace(leaRecordId);
            var errors = new List<ResultError>();

            foreach (var messageElement in stopElement.Elements().Where(x => x.Name.LocalName == MessageElement))
            {
                var severity = GetValue(messageElement, SeverityElement);

                if (string.Equals(severity, InformationalSeverity, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var code = GetValue(messageElement, MessageCodeElement);
                var fieldName = GetValue(messageElement, FieldNameElement);
                var text = GetValue(messageElement, MessageTextElement);
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
                var recStat = GetValue(stopElement, RecStatElement);

                if (!isFileLevel && (recStat == SuccessfulRecStat || recStat == NfiaRecStat))
                {
                    results.Add(new ResultMessage
                    {
                        FileName = fileName,
                        LeaRecordId = leaRecordId,
                        DojRecordId = GetValue(stopElement, DojRecordIdElement),
                        RecStat = recStat,
                        IsSuccess = true
                    });
                }

                continue;
            }

            results.Add(new ResultMessage
            {
                FileName = fileName,
                LeaRecordId = leaRecordId,
                DojRecordId = GetValue(stopElement, DojRecordIdElement),
                RecStat = GetValue(stopElement, RecStatElement),
                ErrorType = GetMostSevereErrorType(errors),
                Errors = errors
            });
        }

        return results;
    }

    private static string GetMostSevereErrorType(List<ResultError> errors)
    {
        if (errors.Any(x => x.ErrorType == SubmissionErrorType.FileLevelFatalError.ToString()))
        {
            return SubmissionErrorType.FileLevelFatalError.ToString();
        }

        if (errors.Any(x => x.ErrorType == SubmissionErrorType.RecordLevelFatalError.ToString()))
        {
            return SubmissionErrorType.RecordLevelFatalError.ToString();
        }

        return SubmissionErrorType.RecordLevelError.ToString();
    }

    private static string GetValue(XElement parent, string localName)
    {
        return parent.Elements().FirstOrDefault(x => x.Name.LocalName == localName)?.Value?.Trim();
    }
}
