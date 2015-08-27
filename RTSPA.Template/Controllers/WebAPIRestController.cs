using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Results;

namespace RTSPA.Template.Controllers
{
    public class WebAPIRestController : ApiController
    {
        // GET api/<controller>
        [HttpGet]
        [Route("api/service/getData")]
        public IHttpActionResult getData()
        {
            Thread.Sleep(4000);
            Random rnd = new Random();
            int val = rnd.Next(52);

            try
            {
                if (val < 15)
                    throw new Exception("value less than 15");
                
                return Ok(new string[] { val.ToString() });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);                
            }                       
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}