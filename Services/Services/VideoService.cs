using DulkyVideo.Authorization;
using DulkyVideo.Data;
using DulkyVideo.Models;
using DulkyVideo.Services.Intrerfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Twilio;
using Twilio.Jwt.AccessToken;
using Twilio.Rest.Video.V1;
using Twilio.TwiML.Video;

namespace DulkyVideo.Services.Services
{
    public class VideoService : IVideoService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public VideoService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        /** 
         * identity = logged user(user which create room) 
         * roomName = userId which will join room later 
         * **/     
        public ResponseModel<string> GetAccessTokenToCreateRoom(string identity, string roomName)
        {
            var response = new ResponseModel<string>();
            try
            {
                //Check if the user is in any room
                var room = GetRoomByName(roomName);
                if (room.Succeeded)
                {
                    response.StatusCode = HttpStatusCode.BadRequest;
                    response.Message = "User is already in room!";
                    return response;
                }

                var grant = new VideoGrant();
                grant.Room = roomName;
                var grants = new HashSet<IGrant> { grant };
        
                var token = new Token("ACe00c55e35e1d70b4a5b00497bc2a4f84",
                             "SKef6f4b9216613962a36c43edb0f5596b",
                             "SD1rVJFOKeou0gfgcuE8iukmyx8QoJ1R",
                             identity ?? Guid.NewGuid().ToString(),
                             grants: grants).ToJwt();
                response.StatusCode = HttpStatusCode.OK;
                response.Value = token;
            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.Message = ex.GetBaseException().Message;
            }
            return response;
        }

        public UserModel GetContacts(long userId)
        {
            var result = new UserModel() {
                Contacts = new List<SelectListItem>()
            };
            try
            {
                var contacts = _userManager.Users.Where(u => u.Id != userId).Select(u => 
                    new SelectListItem
                    { 
                        Value = u.Id.ToString(),
                        Text = u.UserName
                    }
                ).ToList();
                result.Contacts = contacts;
            }
            catch (Exception ex)
            {

                throw;
            }
            return result;
        }


        #region Helper

        public ResultModel<RoomResource> GetRoomByName(string roomName) 
        {
            var result = new ResultModel<RoomResource>();
            try
            {
                const string accountSid = "ACe00c55e35e1d70b4a5b00497bc2a4f84";
                const string authToken = "c831c48f912167d24e92129fbdab95cd";

                TwilioClient.Init(accountSid, authToken);

                var room = RoomResource.Fetch(pathSid: roomName);
                result.Value = room;
                result.Succeeded = true;
            }
            catch (Exception ex)
            {
                result.Succeeded = false;
            }
            return result;
        }



        #endregion
    }
}
