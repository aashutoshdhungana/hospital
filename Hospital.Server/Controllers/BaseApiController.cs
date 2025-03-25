using Hospital.Application.Constants;
using Hospital.Application.Models;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.Server.Controllers
{
    public class BaseApiController : ControllerBase
    {
        public ActionResult HandleServiceResult<T>(ServiceResult<T> serviceResult)
        {
            return serviceResult.ResultType switch
            {
                ResultTypes.Success => Ok(serviceResult.Data),
                ResultTypes.Created => Created(string.Empty, serviceResult.Data),
                ResultTypes.NoContent => NoContent(),
                ResultTypes.Failure => BadRequest(new { Errors = serviceResult.Errors }),
                ResultTypes.ValidationError => BadRequest(new { FieldErrors = serviceResult.FieldErrors }),
                ResultTypes.Unauthorized => Unauthorized(),
                ResultTypes.Forbid => Forbid(),
                ResultTypes.NotFound => NotFound(),
                _ => StatusCode(500, new { Errors = new List<string> { "Unknown error occurred." } })
            };
        }
    }
}
