// See https://aka.ms/new-console-template for more information
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.Text;
using System.Text.RegularExpressions;


var user = UserPrincipal.Current.UserPrincipalName;
var domain = user.Split("@")[1];
string filePath = null;
bool fileExists = File.Exists(filePath);
string domainInput = null;

Console.WriteLine($"Hello {UserPrincipal.Current.GivenName} {UserPrincipal.Current.Surname}");
Console.ForegroundColor = ConsoleColor.Yellow;
Console.WriteLine($"\nThe purpose of this console application is to walk an Administator through the steps of exporting users from the existing on-prem RIPA application and generating a csv file that would allow the Administrator to upload the existing users into their CSSA Cloud RIPA Environment for the purpose of OfficerId consistency between applications.");
Console.ResetColor();

Console.WriteLine($"\nPress any key to Continue... \n");

Console.ReadKey();

string sqlQuery = "SELECT \r\nup.[ID] as OfficerId\r\n,[Years] as YearsExperience\r\n,[AssignmentKey] as Assignment\r\n,[AssignmentOther] as OtherType\r\n,[NTUserName]\r\nFROM [RIPA].[dbo].[UserProfiles] up\r\njoin UserProfile_Conf upc on up.ID = upc.UserProfileID";

Console.WriteLine("\nSTEP 1: Use the following query against you on-prem RIPA database and save the results as a CSV.\n");
Console.ForegroundColor = ConsoleColor.Blue;
Console.WriteLine(sqlQuery);
Console.ResetColor();

Console.WriteLine($"\nPress any key to Continue... \n");

Console.ReadKey();
Console.WriteLine("\nSTEP 2: Set your domain.\n");

Console.ForegroundColor = ConsoleColor.Yellow;
Console.WriteLine($"This will be used by System.DirectoryServices to look-up User Attributes for each [NTUserName] from the CSV against your on-prem Active Directory.");
Console.WriteLine($"\nAttributes extracted to CSV:\n Surname (Last Name)\n GivenName (First Name)\n msDS-ExternalDirectoryObjectId (Azure Active Directory ObjectId)");
Console.ResetColor();

while (string.IsNullOrWhiteSpace(domainInput))
{
    Console.Write($"\nAre your users in the ");
    Console.ForegroundColor = ConsoleColor.Green;
    Console.Write($"{domain.ToUpper()} ");
    Console.ResetColor();
    Console.Write($"domain?");
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.Write("\nType 'y' to Confirm or type in your domain (Example: MyDomain.com)");
    Console.ResetColor();
    Console.Write("\nPress ");
    Console.ForegroundColor = ConsoleColor.Green;
    Console.Write("[Enter] ");
    Console.ResetColor();
    Console.Write("to submit: ");

    domainInput = Console.ReadLine();
}

if (domainInput.ToLower() != "y")
{
    domain = domainInput;
}

Console.Write($"\nDomain set to ");
Console.ForegroundColor = ConsoleColor.Green;
Console.Write($"{domain.ToUpper()}\n");
Console.ResetColor();

Console.WriteLine($"\nPress any key to Continue... \n");

Console.ReadKey();
Console.WriteLine("\nSTEP 3: Set your Agency\n");

Console.ForegroundColor = ConsoleColor.Yellow;
Console.WriteLine("'Agency' is an optional column for the User File CSV Upload, this can be added to each user now, at the time of Upload, or skipped entirely.");

Console.ResetColor();
Console.Write("\nTo set 'Agency' now, please type in a value then press ");
Console.ForegroundColor = ConsoleColor.DarkGreen;
Console.Write("[Enter]");
Console.ResetColor();

Console.Write(", otherwise, press ");
Console.ForegroundColor = ConsoleColor.DarkGreen;
Console.Write("[Enter]");
Console.ResetColor();
Console.Write(" to skip: ");
string agency = Console.ReadLine();

if (String.IsNullOrWhiteSpace(agency))
{
    Console.ForegroundColor = ConsoleColor.Green;
    Console.Write($"\nAgency was not set\n");
    Console.ResetColor();
}
else
{
    Console.Write($"\nAgency set to ");
    Console.ForegroundColor = ConsoleColor.Green;
    Console.Write($"{agency}\n");
    Console.ResetColor();
}

Console.WriteLine($"\nPress any key to Continue... \n");

Console.ReadKey();

Console.WriteLine("\nSTEP 4: Set File Path for CSV generated in Step 1");

Console.ForegroundColor = ConsoleColor.Yellow;
Console.WriteLine("\nEnter the full Network of local File Path for CSV generated in Step 1 (Example: C:\\Users\\username\\Documents\\ripaExtract.csv)");

Console.ResetColor();

while (!fileExists)
{
    if (string.IsNullOrEmpty(filePath))
    {
        Console.Write("\nEnter File Path to CSV: ");
    }
    else
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"'{filePath}' does not exist\n");
        Console.ResetColor();
        Console.Write("Enter File Path to CSV:");
    }

    filePath = Console.ReadLine();
    fileExists = File.Exists(filePath);
}

var saveDir = Directory.GetParent(filePath).FullName;

Console.WriteLine($"\nOutPut Reports will be saved to '{saveDir}'\n");

var totalusers = 0;

var completeUsers = 0;
var usersNoUpn = 0;
var noUPNReportBuilder = new StringBuilder();
noUPNReportBuilder.AppendLine("");
noUPNReportBuilder.AppendLine("Users Not Found in Active Directory");
noUPNReportBuilder.AppendLine("OfficerID,NTUserName");
var usersNoOID = 0;
var noOIDReportBuilder = new StringBuilder();
noOIDReportBuilder.AppendLine("");
noOIDReportBuilder.AppendLine("Users in Active Directory but have no Azure Active Directory ObjectID");
noOIDReportBuilder.AppendLine("OfficerID,LastName,FirstName,NTUserName");

var lines = File.ReadAllLines(filePath);
List<string> headers = new List<string>();
bool setHeaders = false;
var totalLines = lines.Length;
var reportBuilder = new StringBuilder();
var builder = new StringBuilder();
builder.AppendLine($"Id,OfficerId,FirstName,LastName,YearsExperience,Assignment,OtherType,Agency,NTUserName");

Console.WriteLine($"{totalLines - 1} Users found \n\nPress any key to begin\n");
Console.ReadKey();

var currentline = 0;

foreach (var line in lines)
{
    if (!setHeaders)
    {
        headers = line.Split(',').ToList();
        setHeaders = true;
    }
    else
    { 
        totalusers++;
        var reg = new Regex("(?<=^|,)(\"(?:[^\"]|\"\")*\"|[^,]*)");
        var matches = reg.Matches(line);
        var userData = new List<string>();

        foreach (var item in matches)
        {
            userData.Add(item.ToString()/*.Replace("\"", "")*/);
        }

        var ntUserName = userData[headers.IndexOf("NTUserName")].ToUpper();

        if (ntUserName.Contains(@"\"))
        {
            ntUserName = ntUserName.Split(@"\")[1];
        }

        var aadData = GetAADdata(ntUserName);

        if (aadData != null)
        {
            if (String.IsNullOrEmpty(aadData.Id))
            {
                Console.ForegroundColor = ConsoleColor.Red;
                noOIDReportBuilder.AppendLine($"{userData[headers.IndexOf("OfficerId")]},{aadData.FirstName},{aadData.LastName},{ntUserName}");
                usersNoOID++;
            }
            else
            {
                builder.AppendLine($"{aadData.Id},{userData[headers.IndexOf("OfficerId")]},{aadData.FirstName},{aadData.LastName},{userData[headers.IndexOf("YearsExperience")]},{userData[headers.IndexOf("Assignment")]},{userData[headers.IndexOf("OtherType")]},{agency},{ntUserName}");
                Console.ForegroundColor = ConsoleColor.Yellow;
                completeUsers++;
            }
        }
        else
        {
            Console.ForegroundColor = ConsoleColor.Red;
            noUPNReportBuilder.AppendLine($"{userData[headers.IndexOf("OfficerId")]},{ntUserName}");
            usersNoUpn++;
        }
        currentline++;
    }

    Console.ResetColor();
    ProgressBar(currentline, totalLines - 1);
}

await File.WriteAllTextAsync($@"{saveDir}\RIPAUsersAAD.csv", builder.ToString(), Encoding.UTF8);

Console.ForegroundColor = ConsoleColor.Blue;
Console.WriteLine($"\n\nTotal Lines in CSV w/header: {totalLines}");
reportBuilder.AppendLine($"Total Lines in CSV w/header: {totalLines}");
Console.ForegroundColor = ConsoleColor.Green;
Console.WriteLine($"Total Users Processed: {totalusers}");
reportBuilder.AppendLine($"Total Users Processed: {totalusers}");
Console.WriteLine($"Total Users - Complete: {completeUsers}");
reportBuilder.AppendLine($"Total Users - Complete: {completeUsers}");
Console.ForegroundColor = ConsoleColor.Red;
Console.WriteLine($"Total Users - Not Found in AD: {usersNoUpn}");
reportBuilder.AppendLine($"Total Users - Not Found in AD: {usersNoUpn}");
Console.WriteLine($"Total Users - No AAD ObjectId: {usersNoOID}");
reportBuilder.AppendLine($"Total Users - No AAD ObjectId: {usersNoOID}");
Console.ResetColor();

reportBuilder.Append(noUPNReportBuilder);
reportBuilder.Append(noOIDReportBuilder);

await File.WriteAllTextAsync($@"{saveDir}\Report.csv", reportBuilder.ToString(), Encoding.UTF8);

Console.Write("\nCSV saved to ");
Console.ForegroundColor = ConsoleColor.Green;
Console.Write($@"'{saveDir}\RIPAUsersAAD.csv' ");
Console.ResetColor();

Console.Write("\n\nReport saved to ");
Console.ForegroundColor = ConsoleColor.Green;
Console.Write($@"'{saveDir}\Report.csv' ");
Console.ResetColor();

AADData GetAADdata(string ntUserName)
{
    AADData aaduser = null;
    var userPrincipal = GetUser(ntUserName);

    if (userPrincipal != null)
    {
        aaduser = new AADData();
        aaduser.LastName = userPrincipal.Surname;
        aaduser.FirstName = userPrincipal.GivenName;

        if (userPrincipal.GetUnderlyingObjectType() == typeof(DirectoryEntry))
        {
            using var entry = (DirectoryEntry)userPrincipal.GetUnderlyingObject();
            aaduser.Id = entry.Properties["msDS-ExternalDirectoryObjectId"].Value == null ? null : entry.Properties["msDS-ExternalDirectoryObjectId"].Value.ToString().Replace("User_", "");
        }
    }

    return aaduser;
}

UserPrincipal GetUser(string NTUserName)
{
    UserPrincipal result = null;
    try
    {
        // enter AD settings  
        PrincipalContext AD = new PrincipalContext(ContextType.Domain, domain);

        UserPrincipal u = new UserPrincipal(AD);
        u.SamAccountName = NTUserName;

        // search for user  
        PrincipalSearcher search = new PrincipalSearcher(u);
        result = (UserPrincipal)search.FindOne();
        search.Dispose();
    }
    catch (Exception e)
    {

    }

    return result;
}

static void ProgressBar(int progress, int total)
{
    float onechunk = 30.0f / total;
    float percent = (progress * 100) / total;

    string percentString = $"{percent.ToString("#.#")}%";
    //draw empty progress bar
    Console.CursorLeft = 0;
    Console.Write("["); //start
    Console.CursorLeft = (32 / 2) - (percentString.Length / 2);
    Console.Write(percentString); //start
    Console.CursorLeft = 32;
    Console.Write("]"); //end
    Console.CursorLeft = 1;


    //draw filled part
    int position = 1;
    for (int i = 0; i < onechunk * progress; i++)
    {
        Console.BackgroundColor = ConsoleColor.Green;
        Console.CursorLeft = position++;
        Console.Write(" ");
        PrintProgressPercent(percentString);
    }

    //draw unfilled part
    for (int i = position; i <= 31; i++)
    {
        Console.BackgroundColor = ConsoleColor.Black;
        Console.CursorLeft = position++;
        Console.Write(" ");
        PrintProgressPercent(percentString);
    }

    //draw totals
    Console.CursorLeft = 35;
    Console.BackgroundColor = ConsoleColor.Black;
    Console.Write(progress.ToString() + " of " + total.ToString() + " users processed    ");
}


static void PrintProgressPercent(string percentString)
{
    Console.CursorLeft = (32 / 2) - (percentString.Length / 2);
    Console.Write(percentString);
}

public class AADData
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
