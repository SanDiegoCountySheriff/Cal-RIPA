using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using RIPA.Functions.Common.Models;

namespace RIPA.Functions.Common.Services.Stop.Utility;

public class StopQueryUtility
{

    public StopQuery GetStopQuery(HttpRequest req)
    {
        StopQuery stopQuery = new StopQuery
        {
            StartDate = !string.IsNullOrWhiteSpace(req.Query["StartDate"]) ? DateTime.Parse(req.Query["StartDate"]) : default,
            EndDate = !string.IsNullOrWhiteSpace(req.Query["EndDate"]) ? DateTime.Parse(req.Query["EndDate"]) : default,
            ErrorCode = !string.IsNullOrWhiteSpace(req.Query["ErrorCode"]) ? req.Query["ErrorCode"] : default,
            Statuses = !string.IsNullOrWhiteSpace(req.Query["Statuses"]) ? req.Query["Statuses"].ToString().Split(',').ToList() : default,
            OfficerId = !string.IsNullOrWhiteSpace(req.Query["OfficerId"]) ? req.Query["OfficerId"] : default,
            Offset = !string.IsNullOrWhiteSpace(req.Query["Offset"]) ? Convert.ToInt32(req.Query["Offset"]) : default,
            Limit = !string.IsNullOrWhiteSpace(req.Query["Limit"]) ? Convert.ToInt32(req.Query["Limit"]) : default,
            OrderBy = !string.IsNullOrWhiteSpace(req.Query["OrderBy"]) ? req.Query["OrderBy"] : default,
            Order = !string.IsNullOrWhiteSpace(req.Query["Order"]) ? req.Query["Order"] : default,
        };

        if (!string.IsNullOrWhiteSpace(req.Query["isPii"]))
        {
            stopQuery.IsPII = bool.Parse(req.Query["isPii"]);
        }

        if (!string.IsNullOrWhiteSpace(req.Query["IsSubmitted"]))
        {
            stopQuery.IsSubmitted = bool.Parse(req.Query["IsSubmitted"]);
        }

        if (!string.IsNullOrWhiteSpace(req.Query["IsEdited"]))
        {
            stopQuery.IsEdited = bool.Parse(req.Query["IsEdited"]);
        }

        return stopQuery;
    }

    public string GetStopsQueryString(StopQuery stopQuery, bool isVisible, int version, bool forCpraReport = false, int v1count = 0)
    {
        List<string> whereStatements = new List<string>();
        string join = string.Empty;

        //Date Range
        if (stopQuery.StartDate != default(DateTime))
        {
            whereStatements.Add(Environment.NewLine + $"c.Date >= '{(DateTime)stopQuery.StartDate:yyyy-MM-dd}'");
        }

        if (stopQuery.EndDate != default(DateTime))
        {
            whereStatements.Add(Environment.NewLine + $"c.Date <= '{(DateTime)stopQuery.EndDate:yyyy-MM-dd}'");
        }

        //IsPII
        if (stopQuery.IsPII != null)
        {
            whereStatements.Add(Environment.NewLine + $"c.IsPiiFound = {stopQuery.IsPII.ToString().ToLowerInvariant()}");
        }

        //IsEdited
        if (stopQuery.IsEdited != null)
        {
            whereStatements.Add(Environment.NewLine + $"c.IsEdited = {stopQuery.IsEdited.ToString().ToLowerInvariant()}");
        }

        //Status
        if (stopQuery.Statuses.Safe().Any() && !forCpraReport)
        {
            string stopQueryStatement = "(";

            foreach (var status in stopQuery.Statuses)
            {
                stopQueryStatement += Environment.NewLine + $"c.Status = '{status}' OR";
            }

            stopQueryStatement = stopQueryStatement.Remove(stopQueryStatement.Length - 2);
            whereStatements.Add(stopQueryStatement + ")");
        }
        else if (forCpraReport)
        {
            whereStatements.Add(Environment.NewLine + "(c.Status = 'Submitted' OR c.Status = 'Resubmitted')");
        }

        //ErrorCode
        if (!string.IsNullOrWhiteSpace(stopQuery.ErrorCode))
        {
            join += Environment.NewLine + "JOIN ListSubmission IN c.ListSubmission";
            join += Environment.NewLine + "JOIN ListSubmissionError IN ListSubmission.ListSubmissionError";
            whereStatements.Add(Environment.NewLine + $"ListSubmissionError.Code IN ({string.Join(",", stopQuery.ErrorCode.Split(",").Select(x => string.Format("'{0}'", x)).ToList())})");
        }

        //IsSubmitted
        if (stopQuery.IsSubmitted != null)
        {
            if (!bool.Parse(stopQuery.IsSubmitted.ToString()))
            {
                whereStatements.Add(Environment.NewLine + $"c.Status = null");
            }
            else
            {
                whereStatements.Add(Environment.NewLine + $"c.Status != null");
            }
        }

        //OfficerId
        if (!string.IsNullOrWhiteSpace(stopQuery.OfficerId))
        {
            whereStatements.Add(Environment.NewLine + $"c.OfficerId = '{stopQuery.OfficerId}'");
        }

        //Version
        whereStatements.Add(Environment.NewLine + $"c.StopVersion = {version}");

        string where = string.Empty;

        if (whereStatements.Count > 0)
        {
            where = " WHERE ";

            foreach (var whereStatement in whereStatements)
            {
                where += Environment.NewLine + whereStatement;
                where += Environment.NewLine + "AND";
            }

            where = where.Remove(where.Length - 3);
        }

        var order = Environment.NewLine + "ORDER BY c.StopDateTime DESC";
        var limit = string.Empty;

        if (isVisible)
        {
            // Limit and Offset
            if (stopQuery.Limit != 0)
            {
                limit = Environment.NewLine + $"OFFSET {stopQuery.Offset} LIMIT {stopQuery.Limit - v1count}";
            }

            // Order and OrderBy               
            if (!string.IsNullOrWhiteSpace(stopQuery.OrderBy))
            {
                order = Environment.NewLine + $"ORDER BY c.{stopQuery.OrderBy} ";
                if (!string.IsNullOrWhiteSpace(stopQuery.Order))
                {
                    if (stopQuery.Order.ToUpperInvariant() == "DESC" || stopQuery.Order.ToUpperInvariant() == "ASC")
                    {
                        order += stopQuery.Order;
                    }
                }
            }

        }

        return $"SELECT DISTINCT VALUE c FROM c {join} {where} {order} {limit}";
    }

    public string GetStopsSummaryQueryString(StopQuery stopQuery)
    {
        List<string> whereStatements = new List<string>();
        string join = string.Empty;

        //Date Range
        if (stopQuery.StartDate != default(DateTime))
        {
            whereStatements.Add(Environment.NewLine + $"c.Date >= '{(DateTime)stopQuery.StartDate:yyyy-MM-dd}'");
        }
        if (stopQuery.EndDate != default(DateTime))
        {
            whereStatements.Add(Environment.NewLine + $"c.Date <= '{(DateTime)stopQuery.EndDate:yyyy-MM-dd}'");
        }

        //IsPII
        if (stopQuery.IsPII != null)
        {
            whereStatements.Add(Environment.NewLine + $"c.IsPiiFound = {stopQuery.IsPII.ToString().ToLowerInvariant()}");
        }

        //IsEdited
        if (stopQuery.IsEdited != null)
        {
            whereStatements.Add(Environment.NewLine + $"c.IsEdited = {stopQuery.IsEdited.ToString().ToLowerInvariant()}");
        }

        //Status
        if (stopQuery.Statuses.Safe().Any())
        {
            string stopQueryStatement = "(";

            foreach (var status in stopQuery.Statuses)
            {
                stopQueryStatement += Environment.NewLine + $"c.Status = '{status}' OR";
            }

            stopQueryStatement = stopQueryStatement.Remove(stopQueryStatement.Length - 2);
            whereStatements.Add(stopQueryStatement + ")");
        }

        //ErrorCode
        if (!string.IsNullOrWhiteSpace(stopQuery.ErrorCode))
        {
            join += Environment.NewLine + "FROM c JOIN ListSubmission IN c.ListSubmission";
            join += Environment.NewLine + "JOIN ListSubmissionError IN ListSubmission.ListSubmissionError";
            whereStatements.Add(Environment.NewLine + $"ListSubmissionError.Code IN ({string.Join(",", stopQuery.ErrorCode.Split(",").Select(x => string.Format("'{0}'", x)).ToList())})");
        }

        //IsSubmitted
        if (stopQuery.IsSubmitted != null)
        {
            if (!bool.Parse(stopQuery.IsSubmitted.ToString()))
            {
                whereStatements.Add(Environment.NewLine + $"c.Status = null");
            }
            else
            {
                whereStatements.Add(Environment.NewLine + $"c.Status != null");
            }
        }

        //OfficerId
        if (!string.IsNullOrWhiteSpace(stopQuery.OfficerId))
        {
            whereStatements.Add(Environment.NewLine + $"c.OfficerId = '{stopQuery.OfficerId}'");
        }

        string where = string.Empty;

        if (whereStatements.Count > 0)
        {
            where = " WHERE ";

            foreach (var whereStatement in whereStatements)
            {
                where += Environment.NewLine + whereStatement;
                where += Environment.NewLine + "AND";
            }

            where = where.Remove(where.Length - 3);
        }

        return $"SELECT COUNT(1) AS Count, t.Status FROM c JOIN (SELECT DISTINCT c.id as id, c.Status as Status {join} {where}) t GROUP BY t.Status";
    }
}
