using Chronos.Api.Data;
using Chronos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ChronosDbContext context)
        {
            context.Database.EnsureCreated();

            if (context.Users.Any())
            {
                return; // DB has been seeded
            }

            var adminUser = new User
            {
                Name = "Admin User",
                Email = "admin@example.com",
                Password = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = "admin"
            };

            var testUser = new User
            {
                Name = "Test User",
                Email = "user@example.com",
                Password = BCrypt.Net.BCrypt.HashPassword("password123"),
                Role = "user"
            };

            context.Users.AddRange(adminUser, testUser);

            var categories = new List<Category>
            {
                new Category { Name = "Mechanical" },
                new Category { Name = "Smart" },
                new Category { Name = "For Him" },
                new Category { Name = "For Her" },
                new Category { Name = "For Kids" },
                new Category { Name = "Luxury" }
            };

            context.Categories.AddRange(categories);

            var products = new List<Product>
            {
                new Product
                {
                    Name = "Omega Speedmaster Professional", Price = 432000, Description = "The legendary Moonwatch. Hand-wound mechanical chronograph, the first watch worn on the Moon. Co-Axial Master Chronometer certified.", Category = "Mechanical", Brand = "Omega", CountInStock = 3, Rating = 4.8, NumReviews = 22, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Omega Speedmaster Professional.jpg" } }
                },
                new Product
                {
                    Name = "Seiko Presage Cocktail Time", Price = 29000, Description = "Stunning enamel sunburst dial inspired by Japanese cocktail bars. Automatic movement with 41-hour power reserve.", Category = "Mechanical", Brand = "Seiko", CountInStock = 10, Rating = 4.6, NumReviews = 15, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Seiko Presage Cocktail Time.jpg" } }
                },
                new Product
                {
                    Name = "Tissot Le Locle Powermatic 80", Price = 38500, Description = "Swiss-made dress watch with 80-hour power reserve. Elegant guilloche dial, sapphire crystal, heritage design.", Category = "Mechanical", Brand = "Tissot", CountInStock = 7, Rating = 4.5, NumReviews = 19, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Tissot Le Locle Powermatic 80.jpg" } }
                },
                new Product
                {
                    Name = "Apple Watch Ultra 2", Price = 89900, Description = "Precision dual-frequency GPS, depth gauge, 60-hour battery life. Titanium case with customisable Action Button. The ultimate adventure smartwatch.", Category = "Smart", Brand = "Apple", CountInStock = 8, Rating = 4.9, NumReviews = 40, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Apple Watch Ultra 2.jpg" } }
                },
                new Product
                {
                    Name = "Samsung Galaxy Watch 6 Classic", Price = 34999, Description = "Iconic rotating bezel, advanced sleep coaching, body composition analysis and BIA sensor. Sleek stainless steel finish.", Category = "Smart", Brand = "Samsung", CountInStock = 12, Rating = 4.5, NumReviews = 28, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Samsung Galaxy Watch 6 Classic.jpg" } }
                },
                new Product
                {
                    Name = "Garmin Fenix 7X Solar", Price = 74990, Description = "Solar-powered GPS multisport watch. Up to 37 days battery in smartwatch mode. Topographic maps and health monitoring.", Category = "Smart", Brand = "Garmin", CountInStock = 5, Rating = 4.7, NumReviews = 17, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Garmin Fenix 7X Solar.jpg" } }
                },
                new Product
                {
                    Name = "Rolex Submariner Date", Price = 875000, Description = "The quintessential diver's watch. Oystersteel case, waterproof to 300m, Cerachrom bezel insert. A timeless icon for every adventure.", Category = "For Him", Brand = "Rolex", CountInStock = 2, Rating = 5.0, NumReviews = 18, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Rolex Submariner Date.png" } }
                },
                new Product
                {
                    Name = "TAG Heuer Carrera Chronograph", Price = 262000, Description = "Iconic racing chronograph born on the circuit in 1963. Tachymeter scale, column-wheel movement, sapphire caseback.", Category = "For Him", Brand = "TAG Heuer", CountInStock = 6, Rating = 4.6, NumReviews = 9, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/TAG Heuer Carrera Chronograph.jpg" } }
                },
                new Product
                {
                    Name = "Casio G-Shock GA-2100", Price = 8995, Description = "CasiOak — carbon core guard structure, shock-resistant, 200m water resistance. Slim profile, analog-digital display.", Category = "For Him", Brand = "Casio", CountInStock = 30, Rating = 4.7, NumReviews = 120, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Casio G-Shock GA-2100.jpg" } }
                },
                new Product
                {
                    Name = "Cartier Tank Solo", Price = 234000, Description = "Timeless icon of elegance. Rectangular pale champagne dial, blued-steel sword hands, Roman numerals. The ultimate women's dress watch.", Category = "For Her", Brand = "Cartier", CountInStock = 5, Rating = 4.9, NumReviews = 30, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Cartier Tank Solo.jpg" } }
                },
                new Product
                {
                    Name = "Michael Kors Lexington Rose Gold", Price = 18995, Description = "Glamorous rose gold-tone chronograph with mother-of-pearl dial and crystal-studded bezel. Effortlessly chic.", Category = "For Her", Brand = "Michael Kors", CountInStock = 14, Rating = 4.3, NumReviews = 45, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Michael Kors Lexington Rose Gold.jpg" } }
                },
                new Product
                {
                    Name = "Titan Raga Viva", Price = 6995, Description = "Delicate floral-inspired bracelet watch with diamond-cut case and a jewel-like aesthetic. Made for the modern Indian woman.", Category = "For Her", Brand = "Titan", CountInStock = 20, Rating = 4.4, NumReviews = 68, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Titan Raga Viva.jpg" } }
                },
                new Product
                {
                    Name = "Timex Ironman Youth", Price = 3799, Description = "Durable resin case, easy-read digital display, water-resistant to 50m. Indiglo backlight for night-time reading. Perfect for active kids.", Category = "For Kids", Brand = "Timex", CountInStock = 25, Rating = 4.4, NumReviews = 55, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Timex Ironman Youth.jpg" } }
                },
                new Product
                {
                    Name = "Casio Baby-G BGA-280", Price = 6495, Description = "Shock-resistant and water-resistant to 100m. Pastel colour palette, step counter, and world timer. Fun, sporty and tough.", Category = "For Kids", Brand = "Casio", CountInStock = 20, Rating = 4.5, NumReviews = 32, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Casio Baby-G BGA-280.jpg" } }
                },
                new Product
                {
                    Name = "Fastrack Trendies", Price = 1995, Description = "Sporty digital watch with bold OLED display, alarm, stopwatch and splash resistance. Available in neon-pop colours kids will love.", Category = "For Kids", Brand = "Fastrack", CountInStock = 35, Rating = 4.2, NumReviews = 88, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Fastrack Trendies.jpg" } }
                },
                new Product
                {
                    Name = "Audemars Piguet Royal Oak", Price = 2350000, Description = "The watch that redefined luxury. Iconic octagonal bezel with 8 hexagonal screws, integrated bracelet, Grande Tapisserie dial. In polished steel.", Category = "Luxury", Brand = "Audemars Piguet", CountInStock = 1, Rating = 5.0, NumReviews = 7, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Audemars Piguet Royal Oak.jpg" } }
                },
                new Product
                {
                    Name = "Patek Philippe Calatrava", Price = 2940000, Description = "The apex of horological craft. Ultra-thin movement, hand-finished three-body polished case, hobnail guilloché bezel. A wristwatch for generations.", Category = "Luxury", Brand = "Patek Philippe", CountInStock = 1, Rating = 5.0, NumReviews = 4, Images = new List<ProductImage> { new ProductImage { ImageUrl = "/watch-img/Patek Philippe Calatrava.jpg" } }
                }
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
