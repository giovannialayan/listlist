using Microsoft.EntityFrameworkCore;

namespace ListList.Api.Data;

public static class DataExtensions
{
    public static async Task MigrateDbAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ListListContext>();
        await dbContext.Database.MigrateAsync();
    }
}
