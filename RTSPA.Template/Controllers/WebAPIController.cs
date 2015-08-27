using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RTSPA.Template.Controllers
{
    public class webAPIController : Controller
    {
        public ActionResult Index()
        {
            return PartialView();
        }    
    }
}