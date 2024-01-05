using System;
using System.Threading.Tasks;

namespace RIPA.Functions.Domain.Services.Contracts;

public interface IDomainCosmosDbService
{
    Task SetDomainUploadDate(DateTime uploadDate);
    Task<DateTime> GetDomainUploadDate();
}
