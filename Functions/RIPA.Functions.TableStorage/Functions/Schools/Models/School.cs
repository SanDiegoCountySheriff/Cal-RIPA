using Microsoft.WindowsAzure.Storage.Table;

namespace RIPA.Functions.TableStorage.Functions.Schools.Models
{
    public class School : TableEntity
    {
        public string Name { get; set; }
    }
}
