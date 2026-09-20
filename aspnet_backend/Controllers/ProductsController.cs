using Chronos.Api.Data;
using Chronos.Api.DTOs;
using Chronos.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Chronos.Api.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly ChronosDbContext _context;

        public ProductsController(ChronosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string? category,
            [FromQuery] string? brand,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? search)
        {
            var query = _context.Products.Include(p => p.Images).Include(p => p.Reviews).AsQueryable();

            if (!string.IsNullOrEmpty(category) && category.ToLower() != "all")
            {
                query = query.Where(p => p.Category.ToLower() == category.ToLower());
            }

            if (!string.IsNullOrEmpty(brand) && brand.ToLower() != "all")
            {
                query = query.Where(p => p.Brand.ToLower() == brand.ToLower());
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()) ||
                                         p.Brand.ToLower().Contains(search.ToLower()) ||
                                         p.Description.ToLower().Contains(search.ToLower()));
            }

            var products = await query.ToListAsync();

            var result = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Description = p.Description,
                Category = p.Category,
                Brand = p.Brand,
                CountInStock = p.CountInStock,
                Rating = p.Rating,
                NumReviews = p.NumReviews,
                Images = p.Images.Select(i => i.ImageUrl).ToList(),
                Reviews = p.Reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    Name = r.Name,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                }).ToList()
            });

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound(new { message = "Product not found" });

            return Ok(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                Category = product.Category,
                Brand = product.Brand,
                CountInStock = product.CountInStock,
                Rating = product.Rating,
                NumReviews = product.NumReviews,
                Images = product.Images.Select(i => i.ImageUrl).ToList(),
                Reviews = product.Reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    Name = r.Name,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                }).ToList()
            });
        }

        [HttpPost("{id}/reviews")]
        [Authorize]
        public async Task<IActionResult> AddReview(int id, [FromBody] AddReviewDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.FindFirstValue(ClaimTypes.Name) ?? "Customer";
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var product = await _context.Products.Include(p => p.Reviews).FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound(new { message = "Product not found" });

            var alreadyReviewed = product.Reviews.Any(r => r.UserId == userId);
            if (alreadyReviewed) return BadRequest(new { message = "Product already reviewed" });

            var review = new Review
            {
                ProductId = id,
                UserId = userId,
                Name = userName,
                Rating = dto.Rating,
                Comment = dto.Comment
            };

            product.Reviews.Add(review);
            product.NumReviews = product.Reviews.Count;
            product.Rating = product.Reviews.Average(r => r.Rating);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Review added successfully" });
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateProduct([FromBody] ProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                Description = dto.Description,
                Category = dto.Category,
                Brand = dto.Brand,
                CountInStock = dto.CountInStock,
                Images = dto.Images.Select(img => new ProductImage { ImageUrl = img }).ToList()
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto dto)
        {
            var product = await _context.Products.Include(p => p.Images).FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound(new { message = "Product not found" });

            product.Name = dto.Name;
            product.Price = dto.Price;
            product.Description = dto.Description;
            product.Category = dto.Category;
            product.Brand = dto.Brand;
            product.CountInStock = dto.CountInStock;

            if (dto.Images.Any())
            {
                product.Images = dto.Images.Select(img => new ProductImage { ImageUrl = img }).ToList();
            }

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound(new { message = "Product not found" });

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Product removed" });
        }
    }
}
