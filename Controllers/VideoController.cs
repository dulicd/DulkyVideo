using DulkyVideo.Services.Intrerfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Twilio.Jwt.AccessToken;

namespace DulkyVideo.Controllers
{
    public class VideoController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IVideoService _videoService;

        public VideoController(UserManager<IdentityUser> userManager, IVideoService videoService)
        {
            _userManager = userManager;
            _videoService = videoService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet()]
        public async Task<IActionResult> GetAccessToken(string identity) 
        {
            var user = await _userManager.GetUserAsync(User);
            var token = _videoService.GetAccessToken(user.UserName);
            return Json(token);
        }
    }
}
