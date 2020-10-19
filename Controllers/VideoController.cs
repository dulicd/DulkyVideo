using DulkyVideo.Authorization;
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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IVideoService _videoService;

        public VideoController(UserManager<ApplicationUser> userManager, IVideoService videoService)
        {
            _userManager = userManager;
            _videoService = videoService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet()]
        public async Task<IActionResult> GetAccessTokenToCreateRoom(string roomName) 
        {
            var user = await _userManager.GetUserAsync(User);
            var response = _videoService.GetAccessTokenToCreateRoom(user.UserName, roomName);
           
            return Json(response); 
        }

        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            var user = await _userManager.GetUserAsync(User);
            var result = _videoService.GetContacts(user.Id);
            return PartialView("_SelectRoomPartial", result);
        }
    }
}
