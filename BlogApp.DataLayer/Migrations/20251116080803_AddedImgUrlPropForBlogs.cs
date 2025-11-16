using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApp.DataLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddedImgUrlPropForBlogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImgUrl",
                table: "Blogs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImgUrl",
                table: "Blogs");
        }
    }
}
