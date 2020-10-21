using DulkyVideo.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DulkyVideo.Services.Intrerfaces
{
    public interface IVideoService
    {

        public Task<ResponseModel<string>> GetAccessTokenToCreateRoom(string identity, string roomName);
        public UserModel GetContacts(long userId);
        public Task<ResponseModel<string>> SendPushNotification(string notificationToken);
    }
}
