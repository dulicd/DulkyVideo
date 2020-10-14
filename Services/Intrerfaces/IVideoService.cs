using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DulkyVideo.Services.Intrerfaces
{
    public interface IVideoService
    {

        public string GetAccessToken(string identity);
    }
}
