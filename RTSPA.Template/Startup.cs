using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(RTSPA.Template.Startup))]
namespace RTSPA.Template
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
