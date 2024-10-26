using API;
using API_Library_Management.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API_Library_Management.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        private readonly Context _context;
        private readonly EmailService _emailService;
        private readonly JWTService _jwtService;



        public LibraryController(Context context, EmailService emailService, JWTService jwtService)
        {
            _context = context;
            _emailService = emailService;
            _jwtService = jwtService;
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register(User user)
        {
            user.AccountStatus = AccountStatus.UNAPPROVED;
            user.UserType = UserType.STUDENT;
            user.CreatedOn = DateTime.Now;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            const string subject = "Account Created";
            var body = "<html>" +
                 "<body>" +
                 "<h1>Hello, " + user.FirstName + " " + user.LastName + "</h1>" +
                 "<h2>" +
                 "Your account has been created and we have sent an approval request to the admin." +
                 "Once the request is approved by the admin, you will receive an email, and you will be" +
                 "able to log in to your account." +
                 "</h2>" +
                 "<h3>Thanks</h3>" +
                 "</body>" +
                 "</html>";

            _emailService.SendEmail(user.Email, subject, body);

            return Ok("Your account has been created and we have sent approval request to admin." +
                "Once the request is approved by admin you will receive email, and you will be" +
                "able to login in to your account.");

        }

        [HttpGet("Login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            if (_context.Users.Any(u => u.Email.Equals(email) && u.Password.Equals(password)))
            {
                var user = _context.Users.Single(user => user.Email.Equals(email) && user.Password.Equals(password));

                if (user.AccountStatus == AccountStatus.UNAPPROVED)
                {
                    return Ok("unapproved");
                }

                if (user.AccountStatus == AccountStatus.BLOCKED)
                {
                    return Ok("blocked");
                }

                return Ok(_jwtService.GenerateToken(user));
            }
            return Ok("not found");
        }

        [HttpGet("GetBooks")]
        public async Task<IActionResult> GetBooks()
        {
            if (await _context.Books.AnyAsync())
            {
                var books = await _context.Books.Include(b => b.BookCategory).ToListAsync();
                return Ok(books);
            }
            return NotFound();
        }


        [HttpPost("OrderBook")]
        public async Task<IActionResult> OrderBook(int userId, int bookId)
        {
            var canOrder = _context.Orders.Count(o => o.UserId == userId && !o.Returned) < 3;

            if (canOrder)
            {
                await _context.Orders.AddAsync(new()
                {
                    UserId = userId,
                    BookId = bookId,
                    OrderDate = DateTime.Now,
                    ReturnedOn = null,
                    Returned = false,
                    FinePaid = 0
                });

                var book = await _context.Books.FindAsync(bookId);
                if (book is not null)
                {
                    book.Ordered = true;
                }


                _context.SaveChanges();
                return Ok("ordered");
            }

            return Ok("cannot order");
        }

        [HttpGet("GetOrderOfBook")]
        public async Task<IActionResult> GetOrderOfBook(int userId)
        {
            // Validate input
            if (userId <= 0)
            {
                return BadRequest("Invalid user ID.");
            }
            try
            {

                var order = await _context.Orders
                    .Include(o => o.Book)
                    .Include(o => o.User)
                    .Where(o => o.UserId == userId)
                    .ToListAsync();

                if (order.Any())
                {
                    return Ok(order);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                // Log error

                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("AddCategory")]
        public async Task<IActionResult> AddCategory(BookCategory bookCategory)
        {
            var exists = _context.BookCategories.Any(bc => bc.Category == bookCategory.Category && bc.SubCategory == bookCategory.SubCategory);
            if (exists)
            {
                return Ok("cannot insert");
            }
            else
            {
                await _context.BookCategories.AddAsync(new()
                {
                    Category = bookCategory.Category,
                    SubCategory = bookCategory.SubCategory
                });
                _context.SaveChanges();
                return Ok("INSERTED");
            }
        }

        [HttpGet("GetCategories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.BookCategories.ToListAsync();
            if (categories.Any())
            {
                return Ok(categories);
            }
            return NotFound();
        }

        [HttpPost("AddBook")]
        public async Task<IActionResult> AddBook(Book book)
        {
            book.BookCategory = null;
            await _context.Books.AddAsync(book);
            _context.SaveChanges();

            return Ok("inserted");
        }


        [HttpDelete("DeleteBook")]
        public async Task<IActionResult> DeleteBook(int Id)
        {
            bool exist = await _context.Books.AnyAsync(b => b.Id == Id);
            if (exist)
            {
                var book = await _context.Books.FindAsync(Id);
                _context.Books.Remove(book);
                await _context.SaveChangesAsync();
                return Ok("deleted");
            }


            return NotFound();
        }


        [HttpGet("ReturnBook")]
        public async Task<IActionResult> ReturnBook(int userId, int bookId, int fine)
        {
            var order = await _context.Orders.SingleOrDefaultAsync(o => o.UserId == userId && o.BookId == bookId);

            if (order != null)
            {
                order.Returned = true;
                order.ReturnedOn = DateTime.Now;
                order.FinePaid = fine;
                var book = await _context.Books.SingleOrDefaultAsync(b => b.Id == order.BookId);

                if (book != null)
                {
                    book.Ordered = false;
                    await _context.SaveChangesAsync();
                    return Ok("returned");
                }
                else
                {
                    return NotFound("Book not found.");
                }
            }
            return NotFound("not returned");
        }
        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            return Ok(_context.Users.ToList());
        }

        [HttpGet("ApproveRequest")]
        public async Task<IActionResult> ApproveRequest(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            // Check if the user exists
            if (user is not null)
            {
                // Corrected the account status check
                if (user.AccountStatus == AccountStatus.UNAPPROVED)
                {
                    user.AccountStatus = AccountStatus.ACTIVE;
                    await _context.SaveChangesAsync(); // Use SaveChangesAsync for async

                    // Ensure you have an instance of EmailService
                    _emailService.SendEmail(user.Email, "Account Approved",
                       $"<html><body><h2>Hi, {user.FirstName} {user.LastName}</h2>" +
                       "<h3>Your account has been approved by the admin.</h3>" +
                       "<h3>You can now log in to your account.</h3></body></html>");

                    return Ok("approved");
                }
            }

            return Ok("not approved");
        }

        [HttpGet("GetOrders")]
        public async Task<IActionResult> GetOrders()
        {
            var order = await _context.Orders.Include(o => o.User).Include(o => o.Book).ToListAsync();
            if (order.Any())
            {
                return Ok(order);
            }
            else
            {
                return NotFound();
            }
        }


        [HttpGet("SendEmailForPendingReturns")]
        public async Task<IActionResult> SendEmailForPendingReturns()
        {
            var orders =  _context.Orders
                            .Include(o => o.Book)
                            .Include(o => o.User)
                            .Where(o => !o.Returned)
                            .ToList();

            var emailsWithFine = orders.Where(o => DateTime.Now > o.OrderDate.AddDays(10)).ToList();
            emailsWithFine.ForEach(x => x.FinePaid = (DateTime.Now - x.OrderDate.AddDays(10)).Days * 50);

            var firstFineEmails = emailsWithFine.Where(x => x.FinePaid == 50).ToList();
            firstFineEmails.ForEach(x =>
            {
                var body = $@"
    <html>
        <body>
            <h2>Hi, {x.User?.FirstName} {x.User?.LastName}</h2>
            <h4>Yesterday was your last day to return Book: ""{x.Book?.Title}"".</h4>
            <h4>From today, every day a fine of 50Rs will be added for this book.</h4>
            <h4>Please return it as soon as possible.</h4>
            <h4>If your fine exceeds 500Rs, your account will be blocked.</h4>
            <h4>Thanks</h4>
        </body>
    </html>";

                _emailService.SendEmail(x.User!.Email, "Return Overdue", body);
            });

            var regularFineEmails = emailsWithFine.Where(x => x.FinePaid > 50 && x.FinePaid <= 500).ToList();
            regularFineEmails.ForEach(x =>
            {
                var regularFineEmailsBody = $@"
    <html>
        <body>
            <h2>Hi, {x.User?.FirstName} {x.User?.LastName}</h2>
            <h4>You have {x.FinePaid}Rs fine on Book: ""{x.Book?.Title}""</h4>
            <h4>Please pay it as soon as possible.</h4>
            <h4>Thanks</h4>
        </body>
    </html>";

                _emailService.SendEmail(x.User?.Email!, "Fine To Pay", regularFineEmailsBody);
            });
            var overdueFineEmails = emailsWithFine.Where(x => x.FinePaid > 500).ToList();
            overdueFineEmails.ForEach(x =>
            {
                var overdueFineEmailsBody = $@"
    <html>
        <body>
            <h2>Hi, {x.User?.FirstName} {x.User?.LastName}</h2>
            <h4>You have {x.FinePaid}Rs fine on Book: ""{x.Book?.Title}""</h4>
            <h4>Your account is BLOCKED.</h4>
            <h4>Please pay it as soon as possible to UNBLOCK your account.</h4>
            <h4>Thanks</h4>
        </body>
    </html>";

                _emailService.SendEmail(x.User?.Email!, "Fine Overdue", overdueFineEmailsBody);
            });
            return Ok("sent");
        }

        [HttpGet("BlockFineOverdueUsers")]
        public async Task<IActionResult> BlockFineOverdueUsers()
        {
            var orders =  _context.Orders
                            .Include(o => o.Book)
                            .Include(o => o.User)
                            .Where(o => !o.Returned)
                            .ToList();

            var emailsWithFine = orders.Where(o => DateTime.Now > o.OrderDate.AddDays(10)).ToList();
            emailsWithFine.ForEach(x => x.FinePaid = (DateTime.Now - x.OrderDate.AddDays(10)).Days * 50);

            var users = emailsWithFine.Where(x => x.FinePaid > 500).Select(x => x.User!).Distinct().ToList();

            if (users is not null && users.Any())
            {
                foreach (var user in users)
                {
                    user.AccountStatus = AccountStatus.BLOCKED;
                }
                 _context.SaveChanges();

                return Ok("blocked");
            }
            else
            {
                return Ok("not blocked");
            }
        }

        
        [HttpGet("Unblock")]
        public async Task<IActionResult> Unblock(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user is not null)
            {
                user.AccountStatus = AccountStatus.ACTIVE;
                 _context.SaveChanges();
                return Ok("unblocked");
            }

            return Ok("not unblocked");
        }

    }
}
