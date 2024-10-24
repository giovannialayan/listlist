using ListList.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace ListList.Api.Data;

public class ListListContext(DbContextOptions<ListListContext> options)
    : DbContext(options)
{
    public DbSet<ListListEntity> Lists => Set<ListListEntity>();

    // public DbSet<User> Users => Set<User>();
}
