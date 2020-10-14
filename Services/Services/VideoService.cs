using DulkyVideo.Services.Intrerfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Twilio.Jwt.AccessToken;

namespace DulkyVideo.Services.Services
{
    public class VideoService : IVideoService
    {
        public string GetAccessToken(string identity)
        {
            try
            {
                var grant = new VideoGrant();
                //grant.Room = "gagi1";
                var grants = new HashSet<IGrant> { grant };

                var token = new Token("ACe00c55e35e1d70b4a5b00497bc2a4f84",
                             "SKef6f4b9216613962a36c43edb0f5596b",
                             "SD1rVJFOKeou0gfgcuE8iukmyx8QoJ1R",
                             identity ?? Guid.NewGuid().ToString(),
                             grants: grants).ToJwt();
                return token;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.GetBaseException().Message);
                return "";
            }
        }
    }
}
