using System;

namespace RIPA.Functions.Common.Models.Interfaces
{
    public interface IUserProfile
    {
        string Agency { get; set; }
        string Assignment { get; set; }
        string FavoriteLocations { get; set; }
        string FavoriteReasons { get; set; }
        string FavoriteResults { get; set; }
        string FirstName { get; set; }
        string Id { get; set; }
        string LastName { get; set; }
        string Name { get; }
        string OfficerId { get; set; }
        string OtherType { get; set; }
        DateTime StartDate { get; set; }
        int YearsExperience { get; set; }
    }
}