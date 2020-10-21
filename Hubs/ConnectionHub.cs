using DulkyVideo.Authorization;
using DulkyVideo.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DulkyVideo.Hubs
{
    public class ConnectionHub : Hub
    {
        private readonly DulkyVideoContext _entity;
        private readonly UserManager<ApplicationUser> _userManager;

        public ConnectionHub(DulkyVideoContext entity, UserManager<ApplicationUser> userManager)
        {
            _entity = entity;
            _userManager = userManager;
        }


        public void SendMessage(long who, string message)
        { 
        
        
        }


        public override Task OnConnectedAsync()
        {
            //var name = Context.User.Identity.Name;

            //var user = _userManager.Users.Where(u => u.UserName == name).FirstOrDefault();

            //if (user != null)
            //{
            //    var connection = new Connection
            //    {
            //        Connected = true,
            //        UserId = user.Id,
            //        ConnectionId = Context.ConnectionId
            //    };
            //    _entity.Connection.Add(connection);
            //}


            //_entity.SaveChanges();
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            //var name = Context.User.Identity.Name;
            //var user = _userManager.Users.Where(u => u.UserName == name).FirstOrDefault();
            //if (user != null)
            //{
            //    var connection = _entity.Connection.Where(c => c.ConnectionId == Context.ConnectionId && c.UserId == user.Id).FirstOrDefault();
            //    if (connection != null)
            //    {
            //        _entity.Connection.Remove(connection);
            //    }
            //    _entity.SaveChanges();
            //}

            return base.OnDisconnectedAsync(exception);
        }

    }
}
