using ListList.Api.Data;
using ListList.Api.Endpoints;
using MongoDB.Driver;

ListListEntitySerializer.RegisterBsonClassMap();

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration["MONGODB_URI"];
var client = new MongoClient(connString);
builder.Services.AddSingleton<IMongoClient>(client);
builder.Services.AddScoped(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase("listlist");
});

var app = builder.Build();

app.MapListEndpoints();


app.Run();
