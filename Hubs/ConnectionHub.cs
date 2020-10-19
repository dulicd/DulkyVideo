using DulkyVideo.Data;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DulkyVideo.Hubs
{
    public class ConnectionHub : Hub
    {
        private readonly DulkyVideoContext _entity;

        public ConnectionHub(DulkyVideoContext entity)
        {
            _entity = entity;
        }


        public void SendMessage(long who, string message)
        { 
        
        
        }


        public override Task OnConnectedAsync()
        {
            var name = Context.User.Identity;


            return base.OnConnectedAsync();
        }

    }
}
