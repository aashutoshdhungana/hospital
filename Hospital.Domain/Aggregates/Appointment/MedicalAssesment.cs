using Hospital.Domain.BaseEntities;

namespace Hospital.Domain.Aggregates.Appointment
{
    public class MedicalAssesment : AuditedEntity<int>
    {
        public string ChiefComplaint { get; private set; }
        public string HistoryOfIllness { get; private set; }
        public string Diagnosis { get; private set; }
        public string Advice { get; private set; }
        public int AppointmentInfoId {  get; private set; }
        public AppointmentInfo? AppointmentInfo { get; private set; }

        private MedicalAssesment() { }
        public MedicalAssesment(
            int appointmentInfoId,
            string chiefComplaint,
            string historyOfIllness,
            string diagnosis,
            string advice,
            int createdBy
        ) : base(createdBy)
        {
            AppointmentInfoId = appointmentInfoId;
            ChiefComplaint = chiefComplaint;
            HistoryOfIllness = historyOfIllness;
            Diagnosis = diagnosis;
            Advice = advice;
        }

        public void Update(
            string chiefComplaint,
            string historyOfIllness,
            string diagnosis,
            string advice,
            int updatedBy
            )
        {
            ChiefComplaint = chiefComplaint;
            HistoryOfIllness = historyOfIllness;
            Diagnosis = diagnosis;
            Advice = advice;
            Updated(updatedBy);
        }
    }
}