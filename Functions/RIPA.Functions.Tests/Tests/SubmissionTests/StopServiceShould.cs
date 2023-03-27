using Microsoft.Extensions.Logging;
using Moq;
using RIPA.Functions.Common.Models.Interfaces;
using RIPA.Functions.Submission.Services.REST;
using RIPA.Functions.Tests.Utility;
using Xunit;

namespace RIPA.Functions.Tests.Tests.SubmissionTests;

public class StopServiceShould
{
    private readonly StopService<IStop> sut;

    public StopServiceShould()
    {
        sut = new StopService<IStop>(Mock.Of<ILogger<StopService<IStop>>>());
    }

    [Fact]
    public void DisplayCorrectGenderWhenCastingToDojStop()
    {
        // Arrange
        var defaultStop = DefaultRipaStop.CreateDefaultStop();
        defaultStop.ListPersonStopped[0].PerceivedGender = "Male";
        var expected = "1";

        // Act
        var actual = sut.CastToDojStop(defaultStop);

        // Assert
        Assert.Equal(expected, actual.ListPerson_Stopped.Person_Stopped[0].Perc.Gend);
    }
}
