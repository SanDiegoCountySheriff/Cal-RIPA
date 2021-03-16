using Microsoft.WindowsAzure.Storage.Table;

namespace RIPA.Functions.TableStorage.Functions.Cities.Models
{
    public class City : TableEntity
    {
        public string Name { get; set; }
    }
}
