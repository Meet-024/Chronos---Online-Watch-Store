namespace Chronos.Api.DTOs
{
    public class RegisterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
    }

    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public int CountInStock { get; set; }
        public double Rating { get; set; }
        public int NumReviews { get; set; }
        public List<string> Images { get; set; } = new();
        public List<ReviewDto> Reviews { get; set; } = new();
    }

    public class ReviewDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class AddReviewDto
    {
        public double Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }

    public class OrderCreateDto
    {
        public List<OrderItemDto> OrderItems { get; set; } = new();
        public ShippingAddressDto ShippingAddress { get; set; } = new();
        public string PaymentMethod { get; set; } = "Dummy Payment";
        public decimal TotalPrice { get; set; }
    }

    public class OrderItemDto
    {
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Image { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Product { get; set; }
    }

    public class ShippingAddressDto
    {
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class MessageDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public class UpdateUserAdminDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
    }
}
