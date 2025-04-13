using Hospital.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Aggregates.Rx
{
    public interface IRxRepository : IRepository<RxInfo>
    {
        Task<IEnumerable<RxInfo>> GetAll();
        Task<RxInfo?> Get(int id);
        void Add(RxInfo rxInfo);
        void Update(RxInfo rxInfo);
        void Delete(RxInfo rxInfo);
    }
}
