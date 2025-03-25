using FluentValidation.Results;
using Hospital.Application.Constants;

namespace Hospital.Application.Models
{
    public class ServiceResult<T>
    {
        public bool IsSuccess { get; }
        public T? Data { get; }
        public Dictionary<string, string[]> FieldErrors { get; }
        public List<string> Errors { get; }
        public ResultTypes ResultType { get; }

        private ServiceResult(T data, ResultTypes resultType)
        {
            IsSuccess = true;
            Data = data;
            ResultType = resultType;
            FieldErrors = new Dictionary<string, string[]>();
            Errors = new List<string>();
        }

        private ServiceResult(ResultTypes resultType, Dictionary<string, string[]> fieldErrors, List<string> errors)
        {
            IsSuccess = false;
            ResultType = resultType;
            FieldErrors = fieldErrors ?? new Dictionary<string, string[]>();
            Errors = errors ?? new List<string>();
        }

        public static ServiceResult<T> Success(T data) => new(data, ResultTypes.Success);
        public static ServiceResult<T> Created(T data) => new(data, ResultTypes.Created);
        public static ServiceResult<T> NoContent() => new(default!, ResultTypes.NoContent);
        public static ServiceResult<T> Unauthorized() => new(default!, ResultTypes.Unauthorized);
        public static ServiceResult<T> Forbid() => new(default!, ResultTypes.Forbid);
        public static ServiceResult<T> NotFound() => new(ResultTypes.NotFound, new Dictionary<string, string[]>(), new List<string>());
        public static ServiceResult<T> Failure(string error) => new(ResultTypes.Failure, new Dictionary<string, string[]>(), new List<string> { error });
        public static ServiceResult<T> Failure(List<string> errors) => new(ResultTypes.Failure, new Dictionary<string, string[]>(), errors);
        public static ServiceResult<T> ValidationError(Dictionary<string, string[]> fieldErrors) => new(ResultTypes.ValidationError, fieldErrors, new List<string>());
        public static ServiceResult<T> FromValidationResult(ValidationResult validationResult)
        {
            var fieldErrors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return new ServiceResult<T>(ResultTypes.ValidationError, fieldErrors, new List<string>());
        }

    }

}
