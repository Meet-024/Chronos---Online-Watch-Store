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
    [Route("api/orders")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ChronosDbContext _context;

        public OrdersController(ChronosDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            if (dto.OrderItems == null || !dto.OrderItems.Any())
            {
                return BadRequest(new { message = "No order items" });
            }

            var order = new Order
            {
                UserId = userId,
                Address = dto.ShippingAddress.Address,
                City = dto.ShippingAddress.City,
                PostalCode = dto.ShippingAddress.PostalCode,
                Country = dto.ShippingAddress.Country,
                PaymentMethod = dto.PaymentMethod,
                TotalPrice = dto.TotalPrice,
                IsPaid = true,
                PaidAt = DateTime.UtcNow,
                Status = "Pending",
                OrderItems = dto.OrderItems.Select(item => new OrderItem
                {
                    Name = item.Name,
                    Quantity = item.Quantity,
                    Image = item.Image,
                    Price = item.Price,
                    ProductId = item.Product
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

        [HttpGet("myorders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (!int.TryParse(userIdStr, out int userId)) return Unauthorized();

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound(new { message = "Order not found" });

            if (order.UserId != userId && role != "admin")
            {
                return Forbid();
            }

            return Ok(order);
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("{id}/deliver")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateOrderToDelivered(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Order not found" });

            order.IsDelivered = true;
            order.DeliveredAt = DateTime.UtcNow;
            order.Status = "Delivered";

            await _context.SaveChangesAsync();
            return Ok(order);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Order not found" });

            order.Status = status;
            if (status == "Delivered")
            {
                order.IsDelivered = true;
                order.DeliveredAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(order);
        }
    }
}
