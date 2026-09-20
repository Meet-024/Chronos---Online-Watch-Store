using Chronos.Api.Data;
using Chronos.Api.DTOs;
using Chronos.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Chronos.Api.Controllers
{
    [ApiController]
    [Route("api/messages")]
    public class MessagesController : ControllerBase
    {
        private readonly ChronosDbContext _context;

        public MessagesController(ChronosDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage([FromBody] MessageDto dto)
        {
            var message = new Message
            {
                Name = dto.Name,
                Email = dto.Email,
                Subject = dto.Subject,
                MessageText = dto.Message
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Message sent successfully" });
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _context.Messages
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return Ok(messages);
        }

        [HttpPut("{id}/read")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var msg = await _context.Messages.FindAsync(id);
            if (msg == null) return NotFound(new { message = "Message not found" });

            msg.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(msg);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            var msg = await _context.Messages.FindAsync(id);
            if (msg == null) return NotFound(new { message = "Message not found" });

            _context.Messages.Remove(msg);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Message deleted" });
        }
    }
}
