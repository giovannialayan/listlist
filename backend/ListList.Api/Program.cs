using ListList.Api.Data;
using ListList.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("ListlistDb");
builder.Services.AddSqlite<ListListContext>(connString);

var app = builder.Build();

app.MapListEndpoints();

await app.MigrateDbAsync();

app.Run();
