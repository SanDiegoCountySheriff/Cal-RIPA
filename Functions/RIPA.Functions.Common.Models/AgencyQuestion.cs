namespace RIPA.Functions.Common.Models;

public class AgencyQuestion
{
    public string Answer { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Prompt { get; set; }
    public string Hint { get; set; }
    public int MaxLength { get; set; }
    public bool Required { get; set; }
}
