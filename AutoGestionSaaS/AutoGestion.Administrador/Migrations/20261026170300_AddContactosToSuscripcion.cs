using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoGestion.Administrador.Migrations
{
    public partial class AddContactosToSuscripcion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactoCorreo",
                table: "Suscripciones",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactoTelefono",
                table: "Suscripciones",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Suscripciones_ContactoCorreo",
                table: "Suscripciones",
                column: "ContactoCorreo");

            migrationBuilder.CreateIndex(
                name: "IX_Suscripciones_ContactoTelefono",
                table: "Suscripciones",
                column: "ContactoTelefono");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Suscripciones_ContactoCorreo",
                table: "Suscripciones");

            migrationBuilder.DropIndex(
                name: "IX_Suscripciones_ContactoTelefono",
                table: "Suscripciones");

            migrationBuilder.DropColumn(
                name: "ContactoCorreo",
                table: "Suscripciones");

            migrationBuilder.DropColumn(
                name: "ContactoTelefono",
                table: "Suscripciones");
        }
    }
}
